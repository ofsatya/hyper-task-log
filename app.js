(() => {
  const NAME = "the agent";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const MARK = '<svg width="20" height="20" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="23" stroke="currentColor" stroke-width="9"/><path d="M20 38c6-10 18-2 24-12" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>';
  const TASK_IC = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h8"/><path d="M8 12.5h5"/><path d="M14 16l1.5 1.5 3-3"/></svg>';

  // Tasks live in the embedded task log; chats point at them by id. Both come from data.js.
  const TASKS = Object.fromEntries(demoData().tasks.map((p) => [p.id, p.name]));

  const now = new Date();
  const ago = (min) => new Date(now.getTime() - min * 60000);
  function seedChats() {
    const chats = demoData().chats.map(({ minutesAgo, ...c }) => ({ ...c, time: ago(minutesAgo) }));
    // Seeded messages get times spread before the chat's last activity; new ones are stamped when first shown.
    chats.forEach((c) => c.msgs.forEach((m, i) => (m.at = c.time.getTime() - (c.msgs.length - 1 - i) * 90000)));
    return chats;
  }
  const state = {
    prefs: { length: "Default", formatting: "Default", tone: "Default", instructions: "" },
    chats: seedChats(),
  };
  try { const p = JSON.parse(localStorage.getItem("agent-prefs") || "null"); if (p) Object.assign(state.prefs, p); } catch {}
  const savePrefs = () => { try { localStorage.setItem("agent-prefs", JSON.stringify(state.prefs)); } catch {} };

  function fmt(d) {
    const t = new Date();
    if (d.toDateString() === t.toDateString()) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    if (d.toDateString() === new Date(t.getTime() - 86400000).toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  // ---------- settings model ----------
  const S_ICONS = {
    connectors: '<path d="M4 10h6V4H4zM14 4h6v6h-6zM4 20h6v-6H4z"/><path d="M14 17h6M17 14v6"/>',
    responses: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    approvals: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    dictation: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    files: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    general: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-4h4v4"/>',
    members: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    account: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6.5 6.5 0 0 1 11 0"/>',
    appearance: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.5-1.9-.4-1.2.4-2.1 1.6-2.1H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  };
  const S_GROUPS = [
    ["Agent", [["connectors", "Connectors"], ["responses", "Responses"], ["approvals", "Action approvals"]]],
    ["Device", [["dictation", "Dictation"], ["files", "File access"]]],
    ["Workspace", [["general", "General"], ["members", "Members"]]],
    ["Personal", [["account", "Account"], ["appearance", "Appearance"]]],
  ];
  const PREF_OPTS = {
    length: ["Default", "Concise", "Detailed"],
    formatting: ["Default", "Paragraphs", "Headings and lists"],
    tone: ["Default", "Friendly", "Direct", "Formal"],
  };
  const sIcon = (k) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${S_ICONS[k]}</svg>`;

  // ---------- navigation with back/forward ----------
  let view = { name: "tasklog" };
  const hist = [view]; let pos = 0;
  let fwdTask = null; // the task page you just stepped back out of, so Forward can return to it
  function go(v, push = true) {
    if (push) { hist.splice(pos + 1); hist.push(v); pos = hist.length - 1; fwdTask = null; }
    view = v; render();
    if (matchMedia("(max-width: 760px)").matches) $("#app").classList.remove("mobile-open");
  }

  // ---------- render ----------
  const ddMenu = (key, opts, cur, down) => `<div class="menu ${down ? "down" : ""}" role="menu" hidden>${opts.map((x) => `<button type="button" role="menuitemradio" data-pick="${key}" data-val="${esc(x)}" aria-checked="${x === cur}">${esc(x)} ${CHECK}</button>`).join("")}</div>`;
  let chatQ = "";
  const tl = () => { try { return frameReady ? tasklogFrame.contentWindow.taskApi : null; } catch { return null; } };
  const removedNames = {};
  const taskName = (id) => tl()?.get(id)?.name || removedNames[id] || TASKS[id] || "Task";
  const ST_COLORS = { "Needs you": "#FF8A78", Waiting: "#F2B36B", Done: "#8FCB8B" };
  let prevCounts = null; const flashUntil = {};
  function renderSide() {
    const inSettings = view.name === "settings";
    $("#nav-home").classList.toggle("active", view.name === "home" || view.name === "chat");
    $("#nav-tasklog").classList.toggle("active", view.name === "tasklog");
    $("#nav-settings").classList.toggle("active", inSettings);
    ["home", "tasklog", "settings"].forEach((k) => $("#nav-" + k).setAttribute("aria-current", $("#nav-" + k).classList.contains("active") ? "page" : "false"));
    $("#side-chats").hidden = inSettings; $("#side-settings").hidden = !inSettings; updateTitleBtn();
    const api = tl();
    // The task statuses stay in the sidebar in every view; one is highlighted only while the Task log shows it.
    $("#side-tasks").hidden = !api;
    if (api) {
      const n = api.counts(), cur = view.name === "tasklog" ? api.status() : null;
      // A count that just changed stays highlighted for a moment, so you notice the work landed.
      if (prevCounts) ["Needs you", "Waiting"].forEach((k) => { if (n[k] !== prevCounts[k]) { flashUntil[k] = Date.now() + 1600; setTimeout(renderSide, 1650); } });
      prevCounts = n;
      $("#side-tasks").innerHTML = `<div class="sec-h"><span id="tasks-h">Tasks</span></div>` +
        [["Needs you", "Needs you"], ["Waiting", "Waiting"]].map(([k, l]) =>
          `<button type="button" class="status-item${cur === k ? " active" : ""}${flashUntil[k] > Date.now() ? " flash" : ""}" data-status="${k}" style="--c:${ST_COLORS[k]}"><span class="dot" style="background:${ST_COLORS[k] || "var(--muted)"}"></span>${l}<span class="n">${n[k] ?? 0}</span></button>`).join("");
    }
    if (inSettings) {
      $("#side-favs").hidden = true;
      $("#side-settings").innerHTML = S_GROUPS.map(([g, items]) => `<section class="sec"><div class="sec-h"><span>${g}</span></div>${items.map(([k, l]) => `<button type="button" class="set-item${view.page === k ? " active" : ""}" data-set="${k}">${sIcon(k)}${l}</button>`).join("")}</section>`).join("");
      $("#side-settings").style.cssText = "display:flex;flex-direction:column;gap:22px";
      return;
    }
    const q = chatQ.trim().toLowerCase();
    const list = state.chats.filter((c) => !q || c.title.toLowerCase().includes(q) || c.tasks.some((t) => taskName(t).toLowerCase().includes(q)));
    const itemHtml = (c) => `<div class="item${view.name === "chat" && view.id === c.id ? " active" : ""}">
        ${renamingId === c.id ? `<div class="item-main rename"><label for="rename-input" class="sr">Rename conversation</label><input id="rename-input" type="text" value="${esc(c.title)}" autocomplete="off"></div>` : `<button class="item-main" type="button" data-chat="${c.id}" title="${esc(c.title)}"><span class="nm">${esc(c.title)}</span><span class="tm">${fmt(c.time)}</span></button>`}
        <button class="kebab" type="button" data-kebab="${c.id}" aria-haspopup="menu" aria-expanded="false" aria-label="Options for ${esc(c.title)}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg></button>
        ${c.tasks.length ? `<button type="button" class="sub" data-chat-tasks="${c.id}" title="Show these tasks in the Task log">${TASK_IC}${c.tasks.length} ${c.tasks.length === 1 ? "task" : "tasks"}</button>` : `<span class="sub" style="margin:0 6px 4px">${TASK_IC}No tasks yet</span>`}
      </div>`;
    const favs = list.filter((c) => c.fav), rest = list.filter((c) => !c.fav);
    // Favorites get their own section between Tasks and Chats.
    $("#side-favs").hidden = !favs.length;
    $("#fav-list").innerHTML = favs.map(itemHtml).join("");
    $("#chat-list").innerHTML = rest.length ? rest.map(itemHtml).join("") : list.length ? "" : `<div class="empty-side">No chats match “${esc(chatQ)}”.</div>`;
  }
  const SEND_IC = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></svg>';
  function draftCard(m, i) {
    const d = m.draft;
    if (m.status === "editing") return `<div class="draft"><dl><dt><label for="d-to-${i}">To</label></dt><dd><input id="d-to-${i}" value="${esc(d.to)}"></dd><dt><label for="d-sub-${i}">Subject</label></dt><dd><input id="d-sub-${i}" value="${esc(d.subject)}"></dd></dl>
      <div class="edit-body"><label for="d-body-${i}" class="sr">Email body</label><textarea id="d-body-${i}">${esc(d.body)}</textarea></div>
      <div class="draft-actions"><button type="button" class="btn-red" data-draft="send" data-i="${i}">${SEND_IC}Send</button><button type="button" class="btn-ghost" data-draft="save" data-i="${i}">Save changes</button></div></div>`;
    const foot = m.status === "sent"
      ? `<div class="draft-status sent">${CHECK}Sent to ${esc(d.to)} at ${esc(m.sentAt)}${m.task ? ` · saved to <button type="button" data-task="${m.task}">${esc(taskName(m.task))}</button>` : ""}</div>`
      : m.status === "discarded" ? `<div class="draft-status">Not sent. Draft discarded.</div>`
      : `<div class="draft-actions"><button type="button" class="btn-red" data-draft="send" data-i="${i}">${SEND_IC}Send</button><button type="button" class="btn-ghost" data-draft="edit" data-i="${i}">Edit</button></div>`;
    return `<div class="draft${m.status === "discarded" ? " discarded" : ""}"><dl><dt>To</dt><dd>${esc(d.to)}</dd><dt>Subject</dt><dd>${esc(d.subject)}</dd></dl><div class="body">${esc(d.body)}</div>${foot}</div>`;
  }
  // ---------- logging feedback in the chat ----------
  // m.logs: [{ kind: "new" | "upd", id, what, from, to, state: null | "renaming" | "removed" | "failed", snap, pending }]
  const statusOfTask = (id) => tl()?.get(id)?.status || null;
  const chip = (st, cls = "") => st ? `<span class="st-chip ${cls}" style="--c:${ST_COLORS[st]}"><span class="d"></span>${esc(st)}</span>` : "";
  const UNDO_IC = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>';
  const WARN_IC = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.01"/></svg>';
  const lgBtn = (act, i, j, label, cls = "btn-ghost sm") => `<button type="button" class="${cls}" data-lg="${act}" data-i="${i}" data-j="${j}">${label}</button>`;
  // A task that was logged shows as one underlined line under the work, with Undo and Delete beside it.
  const COPY_IC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  const SHARE_IC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
  const msgActs = (i) => `<div class="msg-acts"><button type="button" class="ma" data-ma="copy" data-i="${i}" aria-label="Copy" data-tip="Copy">${COPY_IC}</button><button type="button" class="ma" data-ma="share" data-i="${i}" aria-label="Share" data-tip="Share">${SHARE_IC}</button></div>`;
  function logLine(L, i, j) {
    const name = esc(L.snap?.name || taskName(L.id));
    if (L.state === "failed") return `<div class="logged lg-line failed">${WARN_IC}<span>Sent, but not logged to the Task log.</span><span class="lg-tools">${lgBtn("retry", i, j, "Retry", "lg-t")}</span></div>`;
    if (L.state === "removed") return `<div class="logged lg-line muted">${TASK_IC}<span>Undone. <b>${name}</b> was taken out of the Task log.</span><span class="lg-tools">${lgBtn("redo", i, j, "Redo", "lg-t")}</span></div>`;
    if (L.state === "deleted") return `<div class="logged lg-line muted">${TASK_IC}<span>Deleted <b>${name}</b> from the Task log.</span></div>`;
    if (L.state === "confirm") return `<div class="logged lg-line confirm">${TASK_IC}<span>Delete <b>${name}</b> from the Task log for good?</span><span class="lg-tools">${lgBtn("delyes", i, j, "Delete", "lg-t danger")}${lgBtn("delno", i, j, "Cancel", "lg-t")}</span></div>`;
    if (L.state === "renaming") return `<div class="logged lg-line renaming">${TASK_IC}<span>Logged to the Task log as</span> <span class="lg-rename"><label for="lg-${i}-${j}" class="sr">Task name</label><input id="lg-${i}-${j}" value="${esc(taskName(L.id))}">${lgBtn("save", i, j, "Save", "btn-red sm")}${lgBtn("cancel", i, j, "Cancel", "btn-ghost sm")}</span></div>`;
    return `<div class="logged lg-line done">${TASK_IC}<span>Logged to the Task log as <button type="button" class="lg-u" data-task="${L.id}">${esc(taskName(L.id))}</button></span><button type="button" class="lg-more" data-lgmenu="${i}-${j}" aria-haspopup="menu" aria-expanded="false" aria-label="Options for this task" data-tip="Options"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/></svg></button></div>`;
  }
  function logsHtml(c, m, i) {
    const L = m.logs; if (!L?.length) return "";
    const news = L.map((x, j) => [x, j]).filter(([x]) => x.kind === "new");
    const upds = L.map((x, j) => [x, j]).filter(([x]) => x.kind === "upd");
    let out = news.map(([x, j]) => logLine(x, i, j)).join("");
    out += upds.map(([x, j]) => {
      const gone = !tl()?.get(x.id);
      const moved = x.from && x.to && x.from !== x.to;
      const line = `<div class="logged upd">${TASK_IC} ${x.movedFrom ? "Moved to" : "Updated"} <button type="button" data-task="${x.id}">${esc(gone ? x.name || "task" : taskName(x.id))}</button>${x.what ? `<span class="sep">·</span><span>${esc(x.what)}</span>` : ""}${moved ? `<span class="sep">·</span>${chip(x.from, "sm was")}<span class="arr">→</span>${chip(x.to, "sm")}` : ""}</div>`;
      if (!x.unsure || gone) return line;
      // Not sure it's the right task: say so, and offer the other tasks in this chat or a new one.
      const others = c.tasks.filter((t) => t !== x.id && tl()?.get(t));
      const pick = x.picking ? `<div class="mv-opts" role="group" aria-label="Move this email to">${others.map((t) => `<button type="button" class="btn-ghost sm" data-lg="moveto" data-to="${t}" data-i="${i}" data-j="${j}">${esc(taskName(t))}</button>`).join("")}<button type="button" class="btn-ghost sm" data-lg="moveto" data-to="new" data-i="${i}" data-j="${j}">+ New task</button>${lgBtn("keep", i, j, "Keep it here", "lnk")}</div>` : "";
      return line + `<div class="unsure">I wasn't sure which task this belongs to, so I added it to the latest one. ${x.picking ? "" : lgBtn("move", i, j, "Move to…", "btn-ghost sm")}</div>${pick}`;
    }).join("");
    return out;
  }
  function pickerCard(m, i) {
    const pk = m.picker;
    if (pk.state === "done") return `<div class="picker done">${pk.added.length ? `<p class="picker-h">Added to sources</p>${pk.added.map((x) => `<div class="pick static">${TASK_IC}<span>${esc(x[0])}</span><em>${esc(x[1])}</em></div>`).join("")}` : `<p class="picker-h">Nothing added</p>`}</div>`;
    return `<div class="picker"><p class="picker-h">From your connected tools</p><div class="picker-list">${pk.options.map((o, j) => `<label class="pick"><input type="checkbox" id="pk-${i}-${j}" data-name="${esc(o[0])}" data-kind="${esc(o[1])}"><span>${esc(o[0])}</span><em>${esc(o[1])}</em></label>`).join("") || '<p class="picker-h">Everything connected is already a source.</p>'}</div>
      <label class="upload"><input type="file" id="pk-file-${i}" multiple><span>+ Upload a file</span></label>
      <div class="draft-actions" style="border:0;padding:4px 0 0"><button type="button" class="btn-red" data-picker="add" data-i="${i}">Add to task</button><button type="button" class="btn-ghost" data-picker="cancel" data-i="${i}">Cancel</button></div></div>`;
  }
  function pickerAction(c, act, i) {
    const m = c.msgs[i]; if (!m?.picker) return;
    let list = [];
    if (act === "add") {
      list = [...document.querySelectorAll(`[id^="pk-${i}-"]:checked`)].map((x) => [x.dataset.name, x.dataset.kind]);
      const f = $(`#pk-file-${i}`); if (f?.files) [...f.files].forEach((x) => list.push([x.name, "Upload"]));
      if (list.length && m.picker.task) tl()?.addSources(m.picker.task, list, { chat: c.id, chatTitle: c.title });
    }
    m.picker.state = "done"; m.picker.added = list;
    m.text = list.length ? `Added ${list.length === 1 ? "1 document" : list.length + " documents"} to ${m.picker.task ? "the task's sources" : "this chat"}.` : "No problem, nothing was added.";
    if (list.length && m.picker.task) m.logs = [{ kind: "upd", id: m.picker.task, what: `added ${list.length === 1 ? "1 source" : list.length + " sources"}` }];
    renderThread(c); renderSide();
    if (list.length) toast(`Added ${list.length === 1 ? "1 source" : list.length + " sources"}`);
  }
  const side = { id: null };
  const sideOpen = () => !$("#side-chat").hidden;
  const syncAsk = () => { try { tasklogFrame?.contentDocument?.documentElement.classList.toggle("side-open", sideOpen()); } catch {} };
  function openSide(id) {
    const c = state.chats.find((x) => x.id === id); if (!c) return;
    side.id = id; $("#side-chat").hidden = false; $("#view-tasklog").classList.add("with-side"); syncAsk();
    $("#side-title").textContent = c.title;
    $("#side-sub").textContent = c.tasks.length ? `Linked to ${taskName(c.tasks[0])}` : "";
    renderThread(c); renderSide();
  }
  function closeSide() { side.id = null; $("#side-chat").hidden = true; $("#view-tasklog").classList.remove("with-side"); $("#side-msgs-in").innerHTML = ""; syncAsk(); }
  function renderThread(c, pending) {
    c.msgs.forEach((m) => { m.at ||= Date.now(); });
    const inMain = view.name === "chat" && view.id === c.id;
    const inSide = !inMain && side.id === c.id && sideOpen();
    if (!inMain && !inSide) return;
    if (inSide) {
      $("#msgs-in").innerHTML = "";
      $("#side-msgs-in").innerHTML = msgsHtml(c, pending);
      $("#side-msgs").scrollTop = 1e9;
      return;
    }
    $("#side-msgs-in").innerHTML = "";
    // A chat that began as a task chat shows the original request and reply once it is opened in the main window,
    // so the thread never looks empty or like the transcript went missing. Tasks are logged automatically, so the request is the work itself.
    if (c.fromTask && !c.seeded) {
      c.seeded = true;
      const ph = PLACEHOLDERS[c.tasks[0]] || [`Take care of \u201c${taskName(c.tasks[0])}\u201d.`, "On it. I've set it up and I'll track progress on the task."];
      c.msgs.unshift({ role: "user", text: ph[0], placeholder: true }, { role: "ai", text: ph[1], logged: c.tasks[0], placeholder: true });
    }
    $("#chat-tasks").innerHTML = "";
    if (false) $("#chat-tasks").innerHTML = `<div class="chat-tasks-in"><span class="lbl sr">Tasks in this chat</span>${c.tasks.length
      ? c.tasks.map((t) => `<button type="button" class="task-chip" data-task="${t}" title="Open in Task log">${TASK_IC}<span>${esc(taskName(t))}</span></button>`).join("")
      : `<span style="font-size:13px;color:var(--faint)">None yet. Tasks are logged as the work takes shape.</span>`}</div>`;
    $("#msgs-in").innerHTML = msgsHtml(c, pending);
    $("#msgs").scrollTop = 1e9;
  }
  function msgsHtml(c, pending) {
    const last = c.msgs[c.msgs.length - 1];
    return c.msgs.map((m, i) => m.role === "user"
      ? `<div class="msg me">${esc(m.text)}</div>`
      : `<div class="msg ai"><span class="av">${MARK}</span><div class="tx">${esc(m.text)}${m.draft ? draftCard(m, i) : ""}${m.picker ? pickerCard(m, i) : ""}${logsHtml(c, m, i)}${(m.logs?.length || m.status === "sent") ? msgActs(i) : ""}${m.logged ? `<div class="logged">${TASK_IC} ${m.placeholder ? "Logged to" : "Linked to"} <button type="button" data-task="${m.logged}">${esc(taskName(m.logged))}</button></div>` : ""}</div></div>`).join("")
      + (pending === undefined && (!last || last.placeholder || last.text === GENERAL_FALLBACK || last.text === tl()?.fallback) ? `<div class="msg-chips">${suggestionsFor(c).map((q) => `<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>` : "")
      + (pending !== undefined ? `<div class="msg ai thinking" id="pending"><span class="av">${MARK}</span><div class="tx">${pending ? esc(pending) : "Thinking…"}</div></div>` : "");
  }
  function renderSettings() {
    const page = view.page;
    const title = S_GROUPS.flatMap((g) => g[1]).find((x) => x[0] === page)[1];
    let body = "";
    if (page === "responses") {
      const row = (k, t, d) => `<div class="row"><div class="t"><b>${t}</b><span>${d}</span></div><div class="dd"><button type="button" class="select" data-dd aria-haspopup="true" aria-expanded="false">${esc(state.prefs[k])}${CHEV}</button>${ddMenu(k, PREF_OPTS[k], state.prefs[k], true)}</div></div>`;
      body = `<section><h2>Style</h2>
          ${row("length", "Length", `How much ${NAME} says when it answers.`)}
          ${row("formatting", "Formatting", "Whether answers run as paragraphs or break into headings and lists.")}
          ${row("tone", "Tone", `How ${NAME} sounds when it writes to you.`)}
        </section>
        <section><h2>Custom instructions</h2>
          <label for="ci" class="sr">Custom instructions</label>
          <textarea id="ci" class="ci" maxlength="2000" placeholder="For example: I work in support at Acme. Assume our product names, and skip the recap at the end.">${esc(state.prefs.instructions)}</textarea>
          <div class="ci-foot"><span>${NAME} reads these at the start of every conversation.</span><span id="ci-count">${state.prefs.instructions.length}/2000</span></div>
        </section>`;
    } else if (page === "connectors") {
      const C = [["N", "Notion", "4 workspaces shared", true], ["G", "Gmail", "Founders' inboxes", true], ["in", "LinkedIn", "Messages only", true], ["C", "Cursor", "6 engineers", true], ["CC", "Claude Code", "6 engineers", true], ["S", "Slack", "Coming soon", false]];
      body = `<section><h2>Connected tools</h2>${C.map(([i, n, d, on]) => `<div class="conn"><span class="ic">${i}</span><span class="t"><b>${n}</b><span>${d}</span></span>${on ? `<span class="pill-ok">Connected</span>` : `<button type="button" class="btn-out" data-soon>Notify me</button>`}</div>`).join("")}</section>`;
    } else {
      body = `<p class="placeholder">${title} settings aren't part of this prototype.</p>`;
    }
    $("#view-settings").innerHTML = `<div class="settings"><h1>${title}</h1>${body}</div>`;
  }

  let tasklogFrame = null, pendingTask = null, frameReady = false;
  function ensureTasklog() {
    if (tasklogFrame) return;
    tasklogFrame = document.createElement("iframe");
    tasklogFrame.className = "tasklog"; tasklogFrame.title = "Task log";
    tasklogFrame.addEventListener("load", () => { frameReady = true; syncAsk(); if (pendingTask !== null) openTaskInFrame(pendingTask); renderSide(); updateNav(); });
    tasklogFrame.src = "tasklog.html";
    $("#view-tasklog").prepend(tasklogFrame);
  }
  function openTaskInFrame(id) {
    if (!frameReady) { pendingTask = id; return; }
    try { const w = tasklogFrame.contentWindow; if (w.location.hash.slice(1) === id) w.taskApi?.refresh(); else w.location.hash = id; pendingTask = null; }
    catch { pendingTask = null; }
  }
  // ---------- top-bar back / forward ----------
  // Back leaves a task page for the list first, then steps through the screens you've visited.
  const frameHash = () => { try { return tasklogFrame?.contentWindow.location.hash.slice(1) || ""; } catch { return ""; } };
  function updateNav() {
    const onTask = view.name === "tasklog" && frameReady && !!frameHash();
    $("#nav-back").disabled = !(onTask || pos > 0);
    $("#nav-fwd").disabled = !((view.name === "tasklog" && frameReady && !onTask && fwdTask) || pos < hist.length - 1);
  }
  function navBack() {
    const open = view.name === "tasklog" && frameReady ? frameHash() : "";
    if (open) { fwdTask = open; tl()?.showList(); return; }
    if (pos > 0) { fwdTask = null; go(hist[--pos], false); }
  }
  function navFwd() {
    if (view.name === "tasklog" && frameReady && !frameHash() && fwdTask) { const id = fwdTask; fwdTask = null; openTaskInFrame(id); return; }
    if (pos < hist.length - 1) go(hist[++pos], false);
  }
  function render() {
    ["home", "chat", "tasklog", "settings"].forEach((k) => ($("#view-" + k).hidden = view.name !== k));
    
    let where = "";
    titleRenaming = false; titleTasksOpen = false; closeChatMenu();
    if (view.name === "chat") { const c = state.chats.find((x) => x.id === view.id); where = c ? c.title : ""; if (c) renderThread(c); }
    if (view.name === "tasklog") { where = "Task log"; ensureTasklog(); openTaskInFrame(view.task || ""); }
    else if (side.id) closeSide();
    if (view.name === "settings") { where = "Settings"; renderSettings(); }
    $("#where").textContent = where;
    $("#transcript-btn").hidden = view.name !== "chat";
    renderSide();
    updateNav();
  }

  // ---------- chat ----------
  function guessTask(q) {
    const s = q.toLowerCase();
    const rules = [[/feedback|customer/, "customer-feedback"], [/weekly|signup|team update/, "weekly-update"], [/candidate|jordan|interview|hiring/, "candidate-follow-up"], [/invoice|acme/, "invoice-reminder"], [/meeting|summary/, "meeting-summary"], [/blog|post|launch/, "blog-post"], [/laptop|quote|supplier/, "laptop-quotes"], [/lunch/, "team-lunch"]];
    const hit = rules.find(([r]) => r.test(s));
    return hit ? hit[1] : null;
  }
  const wantsDraft = (q) => /\b(draft|write|compose|prepare)\b/i.test(q) && /\b(e-?mail|mail|update|note|message|reply|follow[- ]?up)\b/i.test(q);
  // The agent is simulated. Questions about a task are answered from its data in the task log;
  // chats with no task can ask about the log as a whole.
  const GENERAL_FALLBACK = "In this demo I can answer questions about the tasks in your Task log. Try one of the suggestions below.";
  const GENERAL_SUGGESTIONS = ["What needs my attention?", "What's waiting on other people?"];
  const chatTask = (c, q) => { const g = q && guessTask(q); return tl()?.get(g && c.tasks.includes(g) ? g : c.tasks[c.tasks.length - 1]) || null; };
  const suggestionsFor = (c) => (c.tasks.length ? tl()?.suggestions || [] : GENERAL_SUGGESTIONS);
  function canned(q, c) {
    const api = tl(), p = chatTask(c, q);
    if (p) return api.answer(p.id, q) || api.fallback;
    const s = q.toLowerCase(), all = api?.all() || [];
    const bullets = (xs) => xs.map((x) => "• " + x).join("\n");
    if (/need|attention|open|undecided|today|my plate/.test(s)) {
      const list = all.filter((t) => t.status === "Needs you");
      return list.length ? `${list.length === 1 ? "One task needs" : `${["Two", "Three", "Four", "Five", "Six", "Seven", "Eight"][list.length - 2] || list.length} tasks need`} you:\n${bullets(list.map((t) => { const x = t.attention.find((a) => a.kind !== "waiting"); return `${t.name}: ${x.kind === "reply" ? `${x.from} replied and is waiting on you` : x.text}`; }))}\n\nOpen one from the Task log to reply or mark it handled.` : "Nothing needs you right now. Every task is either done or waiting on someone else.";
    }
    if (/wait|hear back|repl|other people/.test(s)) {
      const list = all.filter((t) => t.status === "Waiting");
      return list.length ? `${list.length === 1 ? "One task is" : `${["Two", "Three", "Four", "Five", "Six", "Seven", "Eight"][list.length - 2] || list.length} tasks are`} waiting on other people:\n${bullets(list.map((t) => { const x = t.attention.find((a) => a.kind === "waiting"); return `${t.name}: ${x.from}, ${x.text.charAt(0).toLowerCase() + x.text.slice(1)}`; }))}` : "Nothing is waiting on anyone right now.";
    }
    return GENERAL_FALLBACK;
  }
  function templateDraft(p, q) {
    const s = q.toLowerCase();
    const prior = p?.artifacts.find((a) => a[1] === "email");
    const named = q.match(/\bto\s+([\w.+-]+@[\w.-]*)/i);
    const person = (q.match(/\bto\s+([A-Z][a-z]+)\b/) || [])[1];
    const to = named ? named[1] : person ? person : /manager/.test(s) ? "manager@" : /investor/.test(s) ? "investors@" : prior ? prior[3].to : "team@";
    if (!p) {
      const who = named ? named[1] : (q.match(/\bto\s+(?:the\s+)?(.+?)(?:\s+(?:asking|about|regarding|to ask|with)\b|[.?!]|$)/i) || [])[1] || "team@";
      const topic = (q.match(/\b(?:asking about|about|regarding)\s+(.+?)[.?!]*$/i) || [])[1];
      const subject = topic ? `Question about ${topic}` : "Quick question";
      return { to: who, subject, body: `Hi,\n\nI'm reaching out about ${topic ? topic : "a quick question"}. Could you let me know if that works, and what the next steps would be?\n\nThanks,` };
    }
    return { to, subject: `Update: ${p.name}`, body: `Hi,\n\nQuick update on \u201c${p.name}\u201d.\n\n${p.summary}\n\nThanks,` };
  }
  function actionDraft(p, x, act) {
    const first = x.from.split(/[ ,]/)[0];
    if (act === "reply") return { to: `${x.from} (${x.via})`, subject: `Re: ${p.name}`, body: `Hi ${first},\n\nThanks for getting back to me. On your question (\u201c${x.text}\u201d): happy to walk you through it. Would a 15-minute call this week work?\n\nThanks,` };
    return { to: `${x.from} (${x.via})`, subject: `Following up: ${p.name}`, body: `Hi {first_name},\n\nQuick follow-up on my last message. ${p.summary.split(/(?<=\.)\s+/)[0]}\n\nWould 20 minutes next week be useful?\n\nThanks,` };
  }
  async function makeDraft(p, q) {
    await new Promise((r) => setTimeout(r, 600));
    return templateDraft(p, q);
  }
  const PLACEHOLDERS = {
    "customer-feedback": ["Ask five of our most active customers for feedback on the new onboarding.", "Done. I emailed Priya (Northwind), Leo (Brightside) and three others, asking for 15 minutes this week. I'll track their replies on the task."],
    "weekly-update": ["Write this week's team update from our Notion notes.", "The draft is ready and with Alex for a quick check. I'll track it on the task."],
    "candidate-follow-up": ["Send Jordan a thank-you note after today's interview.", "Sent. I thanked Jordan for their time and said we'll be in touch by Friday. I'll watch for a reply."],
    "invoice-reminder": ["Remind Acme Studio about invoice #1042.", "Reminder sent to Acme Studio. I'll track whether they reply."],
    "meeting-summary": ["Summarise Monday's team meeting.", "The summary is ready, with action items, and saved on the task."],
    "blog-post": ["Draft a blog post for the launch.", "The post is drafted and with Sam for review. I'll track it on the task."],
    "laptop-quotes": ["Get laptop quotes from our two suppliers.", "Both suppliers have quoted for 4 laptops. Supplier B is $280 cheaper. The comparison is saved on the task."],
    "team-lunch": ["Book a team lunch for Friday.", "Lunch is booked at Lucia's, Friday at 1pm, table for 8."],
  };
  function newChat(title, tasks = []) {
    const c = { id: "c" + Date.now(), title: title.length > 42 ? title.slice(0, 42) + "…" : title, time: new Date(), tasks, msgs: [] };
    if (tasks.length) c.fromTask = true;
    state.chats.unshift(c); return c;
  }
  async function send(text, target) {
    let c = target || (view.name === "chat" ? state.chats.find((x) => x.id === view.id) : null);
    if (!c) { c = newChat(text); go({ name: "chat", id: c.id }); }
    c.msgs.push({ role: "user", text }); c.time = new Date();
    renderThread(c, ""); renderSide();
    const api = tl();

    if (wantsMulti(text)) { await new Promise((r) => setTimeout(r, 900)); doMulti(c, text); return; }
    // Actions: show the draft and ask. The task is logged or updated only when the person clicks Send.
    if (wantsDraft(text)) {
      const g = guessTask(text);
      const taskId = g && (c.tasks.includes(g) || !c.tasks.length) ? g : c.tasks[c.tasks.length - 1] || g;
      if (taskId && !c.tasks.includes(taskId)) c.tasks.push(taskId);
      // A follow-up or reply asked for in words behaves like the matching button: it answers that open item.
      const tp = api?.get(taskId);
      const act = /follow[- ]?up|haven'?t replied|not replied/i.test(text) ? "followup" : /\breply\b|answer/i.test(text) ? "reply" : null;
      const x = act && tp ? tp.attention.find((a) => a.kind === (act === "followup" ? "waiting" : "reply")) : null;
      // The chat already has a task but nothing in the request ties it to one: file it under the latest, and offer Move to….
      const unsure = !x && c.tasks.length > 0 && !(g && c.tasks.includes(g));
      const d = x ? actionDraft(tp, x, act) : await makeDraft(unsure ? null : tp, text);
      if (x) await new Promise((r) => setTimeout(r, 500));
      c.msgs.push({ role: "ai", text: "Here's a draft. Should I send it?", draft: d, status: "pending", task: taskId || null, attn: x?.id || null, act: x ? act : null, unsure });
      renderThread(c);
      renderSide(); return;
    }

    // Questions don't create tasks; they may link the chat to the task they're about.
    const task = guessTask(text);
    const linked = task && !c.tasks.includes(task) ? task : null;
    if (linked) c.tasks.push(linked);
    await new Promise((r) => setTimeout(r, 650));
    c.msgs.push({ role: "ai", text: canned(text, c), logged: linked });
    renderThread(c);
    renderSide();
  }
  // Adding documents = choosing files. The chat records what was added; nothing happens if the chooser is cancelled.
  let docTarget = null, attachCtx = null;
  const DOC_TYPES = ".pdf,.doc,.docx,.txt,.md,.rtf,.pages,.ppt,.pptx,.key,.xls,.xlsx,.csv";
  // ---------- transcript ----------
  const whoName = NAME.replace(/^the /, ""), whoLabel = whoName.charAt(0).toUpperCase() + whoName.slice(1);
  const tTime = (ms) => new Date(ms).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  function extraOf(m) {
    const out = [];
    if (m.draft) out.push(`Email ${m.status === "sent" ? "sent" : m.status === "discarded" ? "not sent" : "draft"} · To: ${m.draft.to} · Subject: ${m.draft.subject}\n${m.draft.body}`);
    if (m.picker?.added?.length) out.push("Added: " + m.picker.added.map((x) => `${x[0]} (${x[1]})`).join(", "));
    (m.logs || []).forEach((L) => out.push(L.state === "failed" ? "Not logged to the Task log" : L.state === "removed" ? "Removed from the Task log" : L.kind === "new" ? `Logged to the Task log as ${taskName(L.id)}` : `Updated ${taskName(L.id)}${L.what ? ": " + L.what : ""}`));
    if (m.logged) out.push(`${m.placeholder ? "Logged to" : "Linked to"} ${taskName(m.logged)}`);
    return out;
  }
  function openTranscript(c) {
    c.msgs.forEach((m) => { m.at ||= Date.now(); });
    const day = new Date(c.msgs[0]?.at || Date.now()).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    $("#tr-title").textContent = c.title;
    $("#tr-meta").textContent = `${c.msgs.length} messages · ${day}${c.tasks.length ? " · Tasks: " + c.tasks.map(taskName).join(", ") : ""}`;
    $("#tr-body").innerHTML = c.msgs.map((m) => `<li><span class="tr-who ${m.role === "user" ? "" : "ai"}">${m.role === "user" ? "You" : esc(whoLabel)}<span class="tr-when">${tTime(m.at)}</span></span><div><div class="tr-text">${esc(m.text)}</div>${extraOf(m).map((x) => `<div class="tr-extra">${esc(x)}</div>`).join("")}</div></li>`).join("");
    $("#tr-text").value = `${c.title}\n${$("#tr-meta").textContent}\n\n` + c.msgs.map((m) => `[${tTime(m.at)}] ${m.role === "user" ? "You" : whoLabel}: ${m.text}` + extraOf(m).map((x) => `\n    ${x.replace(/\n/g, "\n    ")}`).join("")).join("\n\n");
    $("#transcript").hidden = false; $("#tr-copy").textContent = "Copy"; $("#tr-copy").focus();
  }
  const closeTranscript = () => { $("#transcript").hidden = true; };
  function pickDocs(target) { docTarget = target; const inp = $("#doc-input"); inp.value = ""; inp.accept = target.kind === "doc" ? DOC_TYPES : ""; inp.click(); }
  $("#doc-input").addEventListener("change", (e) => {
    const files = [...e.target.files]; const tg = docTarget; docTarget = null;
    if (!files.length || !tg) return;
    let c = tg.chatId ? state.chats.find((x) => x.id === tg.chatId) : null;
    if (!c) { const p = tl()?.get(tg.taskId); c = newChat(`Add documents: ${p ? p.name : "task"}`, tg.taskId ? [tg.taskId] : []); openSide(c.id); }
    const list = files.map((f) => [f.name, tg.kind === "doc" ? "Document" : "File"]);
    c.msgs.push({ role: "user", text: `Added ${list.map((x) => x[0]).join(", ")}` });
    if (tg.taskId) tl()?.addSources(tg.taskId, list, { chat: c.id, chatTitle: c.title });
    const what = tg.kind === "doc" ? (list.length === 1 ? "1 document" : list.length + " documents") : (list.length === 1 ? "1 file" : list.length + " files");
    c.msgs.push({ role: "ai", text: `Added ${what} to ${tg.taskId ? "the task's sources" : "this chat"}.`, picker: { state: "done", added: list }, logs: tg.taskId ? [{ kind: "upd", id: tg.taskId, what: `added ${what}` }] : null });
    c.time = new Date(); renderThread(c); renderSide();
    toast(`Added ${what}`);
  });
  // Follow up / Reply / Recalibrate from the Task log run as a chat linked to the task.
  function runAction(taskId, act, attnId) {
    const api = tl(), p = api?.get(taskId); if (!p) return;
    const x = attnId ? p.attention.find((a) => a.id === attnId) : act === "followup" ? p.attention.find((a) => a.kind === "waiting") : null;
    if (act === "add-doc" || act === "add-file") { pickDocs({ taskId, kind: act === "add-doc" ? "doc" : "file" }); return; }
    const label = { followup: "Follow up", reply: "Reply", recalibrate: "Recalibrate" }[act];
    const c = newChat(`${label}: ${p.name}`, [taskId]);
    // Anything started from the Task log runs in the task chat, so the task stays in view.
    if (view.name === "tasklog") openSide(c.id); else go({ name: "chat", id: c.id });
    if (act === "recalibrate") {
      c.msgs.push({ role: "user", text: "Recalibrate this task with the latest sources." });
      renderThread(c, "");
      setTimeout(() => {
        const r = api.recalibrate(taskId, { chat: c.id, chatTitle: c.title });
        const lines = [`I re-ran \u201c${p.name}\u201d against the latest sources${r?.name ? ` and saved ${r.name}` : ""}.`];
        if (r?.flags.length) lines.push("", "The latest sources cover what I flagged earlier, so I've cleared it:", ...r.flags.map((f) => "• " + f));
        if (r?.removed.length) lines.push("", `I removed ${r.removed.length === 1 ? "a source that" : "sources that"} no longer ${r.removed.length === 1 ? "exists" : "exist"}:`, ...r.removed.map((f) => "• " + f));
        c.msgs.push({ role: "ai", text: lines.join("\n"), logs: [{ kind: "upd", id: taskId, what: r?.name ? `saved ${r.name}` : "recalibrated" }] });
        renderThread(c); renderSide();
      }, 700);
      return;
    }
    const ask = act === "reply" ? `Draft a reply to ${x.from}.` : `Draft a follow-up to ${x ? x.from : "everyone who hasn't replied"}.`;
    c.msgs.push({ role: "user", text: ask });
    renderThread(c, "");
    setTimeout(() => {
      c.msgs.push({ role: "ai", text: "Here's a draft. Should I send it?", draft: actionDraft(p, x || { from: "everyone who hasn't replied", via: "Email", text: "" }, act), status: "pending", task: taskId, attn: x?.id || null, act });
      renderThread(c); renderSide();
    }, 600);
  }
  function draftAction(c, act, i) {
    const m = c.msgs[i]; if (!m?.draft) return;
    if (m.status === "editing") m.draft = { to: $("#d-to-" + i).value.trim() || m.draft.to, subject: $("#d-sub-" + i).value.trim() || m.draft.subject, body: $("#d-body-" + i).value };
    if (act === "edit") { m.status = "editing"; renderThread(c); $("#d-body-" + i)?.focus(); return; }
    if (act === "save") { m.status = "pending"; renderThread(c); toast("Draft updated"); return; }
    if (act === "discard") { m.status = "discarded"; m.text = "Here's the draft you chose not to send."; renderThread(c); return; }
    if (act === "send") {
      const api = tl();
      m.status = "sent"; m.text = "Here's the email I sent."; m.sentAt = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      // Finished work is exported: a new task if this chat had none, otherwise an update to its task.
      const before = m.task ? statusOfTask(m.task) : null;
      const isNew = !m.task && !!api;
      if (isNew && sim.failNext) {
        // Simulated failure: the email went out, the record didn't.
        sim.failNext = false; syncSimControls();
        m.logs = [{ kind: "new", state: "failed", pending: true }];
        renderThread(c); renderSide(); toast(`Email sent to ${m.draft.to}`); return;
      }
      if (isNew) commitNew(c, m);
      else if (m.task && api) {
        api.addArtifact(m.task, "email", m.draft.subject, { to: m.draft.to, subject: m.draft.subject, body: m.draft.body.split(/\n\s*\n/) });
        if (m.attn) api.resolve(m.task, m.attn);
        // Sending something means waiting on the recipient until they reply or you mark it handled.
        api.addAttention(m.task, { kind: "waiting", from: m.draft.to.replace(/\s*\((LinkedIn|Email)\)$/, ""), via: /LinkedIn/.test(m.draft.to) ? "LinkedIn" : "Email", text: m.act === "followup" ? "Followed up. No reply yet." : m.act === "reply" ? "Replied. Waiting for their response." : "Sent. No reply yet." });
        api.log(m.task, { text: m.act === "reply" ? `Replied to ${m.draft.to}` : m.act === "followup" ? `Followed up with ${m.draft.to}` : `Sent \u201c${m.draft.subject}\u201d to ${m.draft.to}`, art: m.draft.subject, chat: c.id, chatTitle: c.title });
        const who = m.draft.to.replace(/\s*\((LinkedIn|Email)\)$/, "");
        m.logs = [{ kind: "upd", id: m.task, name: taskName(m.task), what: m.act === "reply" ? `replied to ${who}` : m.act === "followup" ? `followed up with ${who}` : "added an email", from: before, to: statusOfTask(m.task), unsure: !!m.unsure }];
      }
      renderThread(c); renderSide();
      if (isNew) announce(m.logs[0].id, `Email sent · logged to Task log`); else toast(`Email sent to ${m.draft.to}`);
    }
  }
  // The agent names the task after the work, not after the chat.
  function taskNameFor(d) {
    const who = d.to.replace(/\s*\((LinkedIn|Email)\)$/, "").split(",")[0].trim();
    const s = d.subject.trim(); let x;
    if ((x = s.match(/^Question about (.+)$/i))) return `Ask ${who} about ${x[1]}`;
    if ((x = s.match(/^Update: (.+)$/i))) return `Update ${who} on ${x[1]}`;
    if (/^quick question$/i.test(s)) return `Quick question for ${who}`;
    return `Email ${who}: ${s}`;
  }
  // Create the task for a sent draft in a chat that had none.
  function commitNew(c, m) {
    const api = tl(); if (!api) return null;
    const who = m.draft.to.replace(/\s*\((LinkedIn|Email)\)$/, "");
    const t = api.create({ name: taskNameFor(m.draft), summary: `Sent “${m.draft.subject}” to ${m.draft.to}.`, chat: c.id, chatTitle: c.title });
    m.task = t.id; c.tasks.push(t.id);
    api.addArtifact(t.id, "email", m.draft.subject, { to: m.draft.to, subject: m.draft.subject, body: m.draft.body.split(/\n\s*\n/) });
    api.addAttention(t.id, { kind: "waiting", from: who, via: /LinkedIn/.test(m.draft.to) ? "LinkedIn" : "Email", text: "Sent. No reply yet." });
    api.log(t.id, { text: `Sent “${m.draft.subject}” to ${m.draft.to}`, art: m.draft.subject, chat: c.id, chatTitle: c.title });
    m.logs = [{ kind: "new", id: t.id, what: `Sent “${m.draft.subject}” to ${who}. Waiting on their reply.` }];
    simulateReply(t.id, who);
    return t.id;
  }
  // Simulated: the recipient replies a little later, so the task flips to Needs you while you're elsewhere.
  const sim = { failNext: false, timers: [] };
  function simulateReply(id, who) {
    sim.timers.push(setTimeout(() => {
      const api = tl(), p = api?.get(id); if (!p) return;
      const w = p.attention.find((a) => a.kind === "waiting"); if (!w) return;
      api.resolve(id, w.id);
      api.addAttention(id, { kind: "reply", from: who, via: w.via, text: "Thanks for reaching out. Could we do a quick call on Thursday instead?" });
      api.log(id, { text: `${who} replied` });
      refreshOpenChat(); renderSide();
      if (isPhone()) toast(`${who} replied · ${taskName(id)} needs you`);
    }, 12000));
  }
  function refreshOpenChat() { const c = view.name === "chat" ? state.chats.find((x) => x.id === view.id) : side.id ? state.chats.find((x) => x.id === side.id) : null; if (c) { const ae = document.activeElement?.id; renderThread(c); if (ae) document.getElementById(ae)?.focus(); } }
  const isPhone = () => matchMedia("(max-width: 760px)").matches && !$("#app").classList.contains("mobile-open");
  // On phones the sidebar is closed, so the count change isn't visible: a toast with Open says it instead.
  function announce(id, msg) { if (isPhone() && id) toastHtml(`${esc(msg.replace(/ · .*/, ""))} · Logged to Task log <button type="button" class="lnk" data-task="${id}">Open</button>`, 4000); else toast(msg.replace(/ · .*/, "")); }
  function syncSimControls() { const b = $("#sim-fail"); if (b) b.checked = sim.failNext; }

  function logAction(c, act, i, j, to) {
    const m = c.msgs[i], L = m?.logs?.[j]; if (!L) return;
    const api = tl();
    if (act === "move") { L.picking = true; renderThread(c); return; }
    if (act === "delete") { L.state = "confirm"; renderThread(c); return; }
    if (act === "delno") { L.state = null; renderThread(c); return; }
    if (act === "delyes") {
      L.snap = { name: taskName(L.id) }; removedNames[L.id] = L.snap.name; api?.remove(L.id);
      c.tasks = c.tasks.filter((t) => t !== L.id); L.state = "deleted";
      renderThread(c); renderSide(); toast("Deleted from the Task log"); return;
    }
    if (act === "keep") { L.picking = false; L.unsure = false; renderThread(c); return; }
    if (act === "moveto" && api) {
      const fromName = taskName(L.id), b = api.takeLatest(L.id);
      if (to === "new") {
        const t = api.create({ name: taskNameFor(m.draft), summary: `Sent \u201c${m.draft.subject}\u201d to ${m.draft.to}.`, chat: c.id, chatTitle: c.title });
        api.put(t.id, b); c.tasks.push(t.id); m.task = t.id;
        m.logs[j] = { kind: "new", id: t.id, what: `Moved from ${fromName}. Sent \u201c${m.draft.subject}\u201d and waiting on a reply.` };
      } else {
        api.put(to, b); m.task = to;
        m.logs[j] = { kind: "upd", id: to, name: taskName(to), what: `moved from ${fromName}`, movedFrom: L.id };
      }
      renderThread(c); renderSide(); toast(`Moved to ${taskName(m.task)}`); return;
    }
    if (act === "rename") { L.state = "renaming"; renderThread(c); $(`#lg-${i}-${j}`)?.select(); return; }
    if (act === "cancel") { L.state = null; renderThread(c); return; }
    if (act === "save") { const v = $(`#lg-${i}-${j}`).value.trim(); if (v) api?.rename(L.id, v); L.state = null; renderThread(c); renderSide(); toast("Task renamed"); return; }
    if (act === "undo") {
      L.snap = api?.get(L.id); api?.remove(L.id);
      removedNames[L.id] = L.snap?.name; c.tasks = c.tasks.filter((t) => t !== L.id);
      L.state = "removed"; renderThread(c); renderSide(); toast("Removed from the Task log"); return;
    }
    if (act === "redo") {
      if (L.snap) { api?.restore(L.snap); if (!c.tasks.includes(L.id)) c.tasks.push(L.id); m.task = L.id; }
      L.state = null; renderThread(c); renderSide(); toast("Back in the Task log"); return;
    }
    if (act === "retry") {
      const id = commitNew(c, m);
      renderThread(c); renderSide(); if (id) announce(id, "Logged to Task log"); return;
    }
  }
  // Demo: one request that does two separate pieces of work logs two tasks in one card.
  const wantsMulti = (q) => /\b(book|order|reserve|schedule)\b.+\band\b.+\b(book|order|reserve|schedule|send)\b/i.test(q) && !wantsDraft(q);
  function doMulti(c, text) {
    const api = tl(); if (!api) return;
    const parts = text.replace(/[.?!]+$/, "").split(/\s+and\s+(?=(?:book|order|reserve|schedule|send)\b)/i).slice(0, 3).map((x) => x.trim().replace(/^./, (ch) => ch.toUpperCase()));
    const logs = parts.map((name) => {
      const vendor = /offsite|venue|lunch|dinner|room/i.test(name) ? "3 venues" : /kit|swag|laptop|order/i.test(name) ? "the supplier" : "the vendor";
      const t = api.create({ name, summary: `Asked ${vendor} for availability and pricing.`, chat: c.id, chatTitle: c.title });
      api.addAttention(t.id, { kind: "waiting", from: vendor.replace(/^the /, "").replace(/^./, (ch) => ch.toUpperCase()), via: "Email", text: "Request sent. No reply yet." });
      api.log(t.id, { text: `Emailed ${vendor} asking for availability and pricing`, chat: c.id, chatTitle: c.title });
      c.tasks.push(t.id);
      return { kind: "new", id: t.id, what: `Emailed ${vendor} for availability and pricing.` };
    });
    c.msgs.push({ role: "ai", text: `Done. These are separate pieces of work, so I've sent both requests and logged each as its own task. I'll track the replies there.`, logs });
    renderThread(c); renderSide(); announce(logs[0].id, `Logged ${logs.length} tasks`);
  }

  // Reset demo: every task and chat goes back to how it was when the page opened, without a reload.
  function resetDemo() {
    closeSide(); closeTranscript(); $("#about").hidden = true;
    state.chats = seedChats(); chatQ = "";
    sim.timers.forEach(clearTimeout); sim.timers = []; sim.failNext = false; syncSimControls(); prevCounts = null;
    tl()?.reset();
    hist.splice(0); hist.push({ name: "tasklog" }); pos = 0;
    go({ name: "tasklog" }, false);
    toast("Demo reset");
  }

  // Shared with the embedded task log so tasks can trace back to chats.
  window.appBridge = {
    chatsForTask: (id) => state.chats.filter((c) => c.tasks.includes(id)).map((c) => ({ id: c.id, title: c.title, time: c.time.getTime() })),
    // Chat links on a task page open in the task chat instead of leaving the task.
    openChat: (id) => (view.name === "tasklog" ? openSide(id) : go({ name: "chat", id })),
    startTaskChat(taskId, q) {
      const c = newChat(q || `About: ${taskName(taskId)}`, [taskId]);
      openSide(c.id);
      if (q) send(q, c);
      setTimeout(() => $("#side-input").focus(), 0);
    },
    runAction,
    hasChat: (id) => state.chats.some((c) => c.id === id),
    name: NAME,
    onTasksChanged: () => { renderSide(); refreshOpenChat(); },
    // The task chat belongs to a task page: it closes on the task list or when another task opens.
    onRoute(taskId) {
      updateNav();
      if (!side.id) return;
      const c = state.chats.find((x) => x.id === side.id);
      if (!taskId || !c || !c.tasks.includes(taskId)) { closeSide(); renderSide(); }
    },
  };
  document.querySelectorAll("[data-composer]").forEach((form) => {
    const input = form.querySelector("input"), btn = form.querySelector(".send");
    input.addEventListener("input", () => { btn.disabled = !input.value.trim(); });
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ""; btn.disabled = true; send(v, form.id === "side-form" ? state.chats.find((x) => x.id === side.id) : null); });
  });
  $("#suggest").innerHTML = ["Draft an email to Maya asking about the pricing page", "Book Friday's team offsite and order welcome kits for the new hires", "What am I working on this week?"].map((q) => `<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join("");

  // ---------- events ----------
  // ---------- chat item menu ----------
  let renamingId = null;
  function chatAction(act, c) {
    if (act === "tasks") { tl()?.showList({ ids: c.tasks, label: c.title }); go({ name: "tasklog" }); return; }
    if (act === "fav") { c.fav = !c.fav; renderSide(); toast(c.fav ? "Added to favourites" : "Removed from favourites"); return; }
    if (act === "rename") { renamingId = c.id; renderSide(); const i = $("#rename-input"); i?.focus(); i?.select(); return; }
    if (act === "delete") {
      const i = state.chats.indexOf(c); if (i < 0) return; state.chats.splice(i, 1);
      if (side.id === c.id) closeSide();
      if (view.name === "chat" && view.id === c.id) { go({ name: "home" }); } else renderSide();
      toast("Conversation deleted");
    }
  }
  function finishRename(save) {
    const c = state.chats.find((x) => x.id === renamingId), v = $("#rename-input")?.value.trim();
    renamingId = null;
    if (c && save && v && v !== c.title) { c.title = v; if (view.name === "chat" && view.id === c.id) $("#where").textContent = v; toast("Conversation renamed"); }
    renderSide();
  }
  // ---------- chat title menu (chevron in the top bar) ----------
  let titleTasksOpen = false, titleRenaming = false;
  const curChat = () => (view.name === "chat" ? state.chats.find((x) => x.id === view.id) : null);
  function updateTitleBtn() {
    const c = curChat(), b = $("#title-menu-btn"); if (b) b.hidden = !c || titleRenaming;
    const f = $("#fav-btn"), sh = $("#share-btn"); if (!f) return;
    f.hidden = sh.hidden = !c;
    if (c) { const l = c.fav ? "Remove from favourites" : "Add to favourites"; f.setAttribute("aria-label", l); f.dataset.tip = l; f.setAttribute("aria-pressed", String(!!c.fav)); }
  }
  function titleMenuHtml(c) {
    const IC = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const STAR = IC('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>');
    const PEN = IC('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>');
    const BIN = IC('<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>');
    const tasks = c.tasks.filter((id) => tl()?.get(id));
    return `<button type="button" role="menuitem" class="tm-tasks" data-tm="toggle" aria-expanded="${titleTasksOpen}">${TASK_IC.replace('width="14" height="14"', 'width="18" height="18"')}<span>Tasks in this chat</span><span class="tm-n">${tasks.length}</span><svg class="tm-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>`
      + (titleTasksOpen ? `<div class="tm-list">${tasks.length ? tasks.map((id) => { const st = tl().get(id).status; return `<button type="button" role="menuitem" data-task="${id}"><span class="tm-dot" style="background:${ST_COLORS[st]}" title="${esc(st)}"></span><span class="tm-name">${esc(taskName(id))}</span></button>`; }).join("") : `<p class="tm-empty">None yet. Tasks are logged as the work gets done.</p>`}</div>` : "")
      + `<div class="tm-sep" role="separator"></div>`
      + `<button type="button" role="menuitem" data-tm="rename">${PEN}Rename</button>`
      + `<button type="button" role="menuitem" class="danger" data-tm="delete">${BIN}Delete</button>`;
  }
  function openTitleMenu(keepFocus) {
    const c = curChat(), btn = $("#title-menu-btn"); if (!c) return;
    let m = document.querySelector(".chat-menu.title-menu");
    if (!m) { closeChatMenu(); m = document.createElement("div"); m.className = "chat-menu title-menu"; m.setAttribute("role", "menu"); document.body.appendChild(m); }
    m.innerHTML = titleMenuHtml(c);
    const r = btn.getBoundingClientRect();
    m.style.left = Math.max(8, Math.min(r.left, innerWidth - m.offsetWidth - 8)) + "px";
    m.style.top = r.bottom + 8 + "px";
    btn.setAttribute("aria-expanded", "true");
    if (!keepFocus) m.querySelector("button")?.focus(); else m.querySelector(keepFocus)?.focus();
  }
  function titleAction(act) {
    const c = curChat(); if (!c) return;
    if (act === "toggle") { titleTasksOpen = !titleTasksOpen; openTitleMenu(".tm-tasks"); return; }
    closeChatMenu();
    if (act === "fav") { chatAction("fav", c); return; }
    if (act === "delete") { chatAction("delete", c); return; }
    if (act === "rename") {
      titleRenaming = true; updateTitleBtn();
      $("#where").innerHTML = `<label for="title-input" class="sr">Rename conversation</label><input id="title-input" type="text" value="${esc(c.title)}" autocomplete="off">`;
      const i = $("#title-input"); i.focus(); i.select();
    }
  }
  function finishTitleRename(save) {
    if (!titleRenaming) return;
    const c = curChat(), v = $("#title-input")?.value.trim();
    titleRenaming = false;
    if (c && save && v && v !== c.title) { c.title = v; toast("Conversation renamed"); }
    $("#where").textContent = c ? c.title : ""; updateTitleBtn(); renderSide();
  }
  function closeChatMenu() { document.querySelector(".chat-menu")?.remove(); $("#title-menu-btn")?.setAttribute("aria-expanded", "false"); document.querySelectorAll("[data-lgmenu][aria-expanded=true]").forEach((b) => b.setAttribute("aria-expanded", "false")); document.querySelectorAll(".kebab[aria-expanded=true]").forEach((k) => { k.setAttribute("aria-expanded", "false"); k.closest(".item")?.classList.remove("menu-open"); }); }
  function openChatMenu(btn) {
    const c = state.chats.find((x) => x.id === btn.dataset.kebab); if (!c) return;
    const IC = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const STAR = IC('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>');
    const PEN = IC('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>');
    const BIN = IC('<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>');
    const m = document.createElement("div"); m.className = "chat-menu"; m.setAttribute("role", "menu");
    m.innerHTML = (c.tasks.length ? `<button type="button" role="menuitem" data-cm="tasks" data-id="${c.id}">${TASK_IC}Show ${c.tasks.length === 1 ? "1 task" : c.tasks.length + " tasks"} in Task log</button>` : "")
      + `<button type="button" role="menuitem" data-cm="fav" data-id="${c.id}">${STAR}${c.fav ? "Remove from favourites" : "Add to favourites"}</button>`
      + `<button type="button" role="menuitem" data-cm="rename" data-id="${c.id}">${PEN}Rename</button>`
      + `<button type="button" role="menuitem" class="danger" data-cm="delete" data-id="${c.id}">${BIN}Delete</button>`;
    document.body.appendChild(m);
    const r = btn.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    m.style.left = Math.max(8, Math.min(r.right - w + 4, innerWidth - w - 8)) + "px";
    m.style.top = (r.bottom + 6 + h > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + "px";
    btn.setAttribute("aria-expanded", "true"); btn.closest(".item")?.classList.add("menu-open");
    m.querySelector("button")?.focus();
  }
  let toastT;
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2000); };
  const toastHtml = (h, ms) => { const t = $("#toast"); t.innerHTML = h; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), ms); };
  const closeMenus = (except) => document.querySelectorAll(".dd .menu").forEach((m) => { if (m !== except) { m.hidden = true; m.previousElementSibling?.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("click", (e) => {
    const t = e.target;
    // Scoped prototype: the Task log, chats and tracing links work; Home, Settings, search and new chat say they aren't part of the demo.
    if (t.closest("#nav-home")) { go({ name: "home" }); return; }
    if (t.closest("#new-chat")) { go({ name: "home" }); setTimeout(() => $("#home-input")?.focus(), 0); return; }
    if (t.closest("#nav-settings, #chat-search-btn")) { toast("Not part of this demo."); return; }
    if (t.closest("#nav-back")) { navBack(); return; }
    if (t.closest("#nav-fwd")) { navFwd(); return; }
    if (t.closest("#nav-tasklog")) { tl()?.showList(); go({ name: "tasklog" }); return; }
    const sf = t.closest("[data-status]"); if (sf) { tl()?.showList({ status: sf.dataset.status }); go({ name: "tasklog" }); return; }
    if (t.closest("#fav-btn")) { const c = curChat(); if (c) chatAction("fav", c); return; }
    if (t.closest("#share-btn")) { toast("Sharing isn't part of this demo"); return; }
    if (t.closest("#title-menu-btn")) { const open = !!document.querySelector(".title-menu"); closeChatMenu(); if (!open) openTitleMenu(); return; }
    const tmB = t.closest("[data-tm]"); if (tmB) { titleAction(tmB.dataset.tm); return; }
    if (t.closest(".title-menu [data-task]")) closeChatMenu();
    const cm = t.closest("[data-cm]"); if (cm) { const c = state.chats.find((x) => x.id === cm.dataset.id); closeChatMenu(); if (c) chatAction(cm.dataset.cm, c); return; }
    const kb = t.closest("[data-kebab]"); if (kb) { const was = kb.getAttribute("aria-expanded") === "true"; closeChatMenu(); if (!was) openChatMenu(kb); return; }
    if (!t.closest(".chat-menu")) closeChatMenu();
    const ct = t.closest("[data-chat-tasks]"); if (ct) { const c = state.chats.find((x) => x.id === ct.dataset.chatTasks); if (c) { tl()?.showList({ ids: c.tasks, label: c.title }); go({ name: "tasklog" }); } return; }
    const chB = t.closest("[data-chat]"); if (chB) { go({ name: "chat", id: chB.dataset.chat }); return; }
    const tkB = t.closest("[data-task]"); if (tkB) { if (!tl()?.get(tkB.dataset.task)) { toast("This task was removed from the Task log"); return; } $("#toast").classList.remove("show"); go({ name: "tasklog", task: tkB.dataset.task }); return; }
    if (t.closest("#side-close")) { closeSide(); renderSide(); return; }
    if (t.closest("[data-tr-close]")) { closeTranscript(); return; }
    if (t.closest("#tr-copy")) {
      const txt = $("#tr-text").value, btn = $("#tr-copy");
      const done = () => { btn.textContent = "Copied"; toast("Transcript copied"); };
      navigator.clipboard?.writeText(txt).then(done, () => { const ta = $("#tr-text"); ta.classList.remove("sr"); ta.select(); try { document.execCommand("copy"); done(); } catch { toast("Select the text and copy it"); } ta.classList.add("sr"); }) ?? done();
      return;
    }
    if (t.closest("#about-btn")) { $("#about").hidden = false; $("#about [data-about-close].icon").focus(); return; }
    if (t.closest("[data-about-close]")) { $("#about").hidden = true; return; }
    if (t.closest("#reset-demo")) { resetDemo(); return; }
    if (t.closest("#transcript-btn")) { const c = state.chats.find((x) => x.id === view.id); if (c) openTranscript(c); return; }
    if (t.closest("#side-transcript")) { const c = state.chats.find((x) => x.id === side.id); if (c) openTranscript(c); return; }
    if (t.closest("#side-full")) { const id = side.id; closeSide(); go({ name: "chat", id }); return; }
    const cur = view.name === "chat" ? state.chats.find((x) => x.id === view.id) : sideOpen() ? state.chats.find((x) => x.id === side.id) : null;
    const qB = t.closest("[data-q]"); if (qB && (cur || view.name === "home")) { send(qB.dataset.q, cur); return; }
    const daB = t.closest("[data-draft]"); if (daB && cur) { draftAction(cur, daB.dataset.draft, +daB.dataset.i); return; }
    const lmB = t.closest("[data-lgmenu]");
    if (lmB) {
      const was = lmB.getAttribute("aria-expanded") === "true"; closeChatMenu(); if (was) return;
      const [i, j] = lmB.dataset.lgmenu.split("-");
      const IC = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
      const m = document.createElement("div"); m.className = "chat-menu log-menu"; m.setAttribute("role", "menu");
      m.innerHTML = `<button type="button" role="menuitem" data-lg="undo" data-i="${i}" data-j="${j}">${IC('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>')}Undo</button>`
        + `<button type="button" role="menuitem" data-lg="rename" data-i="${i}" data-j="${j}">${IC('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>')}Rename</button>`
        + `<button type="button" role="menuitem" class="danger" data-lg="delete" data-i="${i}" data-j="${j}">${IC('<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>')}Delete</button>`;
      document.body.appendChild(m);
      const r = lmB.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
      m.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + "px";
      m.style.top = (r.bottom + 6 + h > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + "px";
      lmB.setAttribute("aria-expanded", "true"); m.querySelector("button")?.focus();
      return;
    }
    const maB = t.closest("[data-ma]");
    if (maB && cur) {
      if (maB.dataset.ma === "share") { toast("Sharing isn't part of this demo"); return; }
      const m = cur.msgs[+maB.dataset.i], txt = [m?.text, ...(m ? extraOf(m) : [])].filter(Boolean).join("\n\n");
      navigator.clipboard?.writeText(txt).then(() => toast("Copied"), () => toast("Couldn't copy. Select the text instead.")) ?? toast("Couldn't copy. Select the text instead.");
      return;
    }
    const lgB = t.closest("[data-lg]"); if (lgB && cur) { if (lgB.closest(".log-menu")) closeChatMenu(); logAction(cur, lgB.dataset.lg, +lgB.dataset.i, +lgB.dataset.j, lgB.dataset.to); return; }
    const pkB = t.closest("[data-picker]"); if (pkB && cur) { pickerAction(cur, pkB.dataset.picker, +pkB.dataset.i); return; }
    const atB = t.closest("[data-attach]");
    if (atB && cur && (atB.closest("#side-chat") || atB.closest("#view-chat"))) {
      const m = $("#attach-menu"), r = atB.getBoundingClientRect();
      if (!m.hidden && attachCtx?.btn === atB) { m.hidden = true; return; }
      attachCtx = { btn: atB, chatId: cur.id, taskId: cur.tasks[cur.tasks.length - 1] || null };
      m.hidden = false; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 12) + "px"; m.style.top = (r.top - m.offsetHeight - 10) + "px";
      return;
    }
    const adB = t.closest("#attach-menu [data-add]");
    $("#attach-menu").hidden = true;
    if (adB && attachCtx) { const ctx = attachCtx; attachCtx = null; pickDocs({ chatId: ctx.chatId, taskId: ctx.taskId, kind: adB.dataset.add }); return; }
    // On phones the sidebar toggle stays live so Tasks and Chats remain reachable.
    if (t.closest("#toggle-side")) { if (matchMedia("(max-width: 760px)").matches) $("#app").classList.toggle("mobile-open"); else $("#app").classList.toggle("collapsed"); return; }
    if ($("#app").classList.contains("mobile-open") && !t.closest("aside")) $("#app").classList.remove("mobile-open");
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "chat-q") { chatQ = e.target.value; renderSide(); }
    if (e.target.id === "ci") { state.prefs.instructions = e.target.value; $("#ci-count").textContent = `${e.target.value.length}/2000`; savePrefs(); }
  });
  document.addEventListener("keydown", (e) => {
    const lm = e.target.id?.match(/^lg-(\d+)-(\d+)$/); const cur = view.name === "chat" ? state.chats.find((x) => x.id === view.id) : null;
    if (lm && cur && (e.key === "Enter" || e.key === "Escape")) { e.preventDefault(); e.stopPropagation(); logAction(cur, e.key === "Enter" ? "save" : "cancel", +lm[1], +lm[2]); }
  });
  document.addEventListener("change", (e) => { if (e.target.id === "sim-fail") sim.failNext = e.target.checked; });
  document.addEventListener("keydown", (e) => { if (e.target.id === "rename-input") { if (e.key === "Enter") { e.preventDefault(); finishRename(true); } else if (e.key === "Escape") { e.stopPropagation(); finishRename(false); } return; } });
  document.addEventListener("focusout", (e) => { if (e.target.id === "rename-input" && renamingId) finishRename(true); if (e.target.id === "title-input") finishTitleRename(true); });
  document.addEventListener("keydown", (e) => { if (e.target.id === "title-input" && (e.key === "Enter" || e.key === "Escape")) { e.preventDefault(); e.stopPropagation(); finishTitleRename(e.key === "Enter"); } }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeChatMenu(); closeMenus(); closeTranscript(); $("#about").hidden = true; } });

  render();
})();
