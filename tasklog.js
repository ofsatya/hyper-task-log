(() => {
  // ---------- icons ----------
  const I = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B9CA3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>',
    task: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7CC4FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 12.5l2 2 4-4"/></svg>',
    arrow: '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3211A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    arrowSrc: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E3211A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    regen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/></svg>',
    expand: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M21 3l-7 7"/><path d="M9 21H3v-6"/><path d="M3 21l7-7"/></svg>',
    collapse: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6"/><path d="M10 14l-7 7"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    clip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>',
    plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    reply: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    doc: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CC4FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    email: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2B36B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    chart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E3211A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16l4-5 3 3 5-6"/></svg>',
  };
  const KIND = { doc: "Document", email: "Email", chart: "Chart" };
  // What the simulated agent suggests asking, and what it says when a question isn't covered.
  const SUGGESTIONS = ["What's still undecided?", "Summarise the latest artifacts", "What documents have you made?", "What sources did you use?", "Draft an update for my manager"];
  const FALLBACK = "In this demo I can answer questions about this task. Try one of the suggestions below.";

  // ---------- example data (data.js) ----------
  const CH = Object.fromEntries(demoData().chats.map((c) => [c.id, c.title]));
  // Store every time as an absolute timestamp so later actions can append without shifting dates.
  const NOW0 = Date.now();
  function seedTasks() {
    const list = demoData().tasks;
    list.forEach((p) => {
      p.attention.forEach((x) => (x.at = NOW0 - x.at * 60000));
      p.activity.forEach((x) => (x.at = NOW0 - x.at * 60000));
      p.artifacts.forEach((a) => (a[0] = NOW0 - a[0] * 60000));
    });
    return list;
  }
  const PROJECTS = seedTasks();

  const DOC_TYPES = ".pdf,.doc,.docx,.txt,.md,.rtf,.pages,.ppt,.pptx,.key,.xls,.xlsx,.csv";
  // Documents the person can add as sources (from connected tools).
  const CATALOG = [["Notion: Q4 roadmap", "Notion"], ["Notion: Brand voice guide", "Notion"], ["Drive: Customer research notes", "Drive"], ["Sheets: Weekly metrics", "Sheets"], ["Gmail: Latest client thread", "Gmail"], ["Slack #product", "Slack"]];
  const STATUSES = ["Needs you", "Waiting", "Done"];
  const statusOf = (p) => (p.attention.some((x) => x.kind !== "waiting") ? "Needs you" : p.attention.length ? "Waiting" : "Done");
  function recompute(p) { p.status = statusOf(p); p.last = Math.max(...p.activity.map((a) => a.at), ...p.artifacts.map((a) => a[0])); }
  PROJECTS.forEach(recompute);
  const stCls = (s) => (s === "Done" ? "done" : s === "Waiting" ? "wait" : "need");
  const stPill = (s) => `<span class="st ${stCls(s)}">${s}</span>`;

  // Embedded in the chat app: the host shares chats with us. Standalone: host is null.
  const host = (() => { try { return window.parent !== window && window.parent.appBridge ? window.parent.appBridge : null; } catch { return null; } })();
  const AI = (() => { try { return host?.name || "the agent"; } catch { return "the agent"; } })();
  const notifyHost = () => { try { host?.onTasksChanged?.(); } catch {} };

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const NOW = Date.now();
  const lastTouched = (p) => new Date(p.last);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const hm = (d) => d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  function stamp(d) {
    const today = new Date(NOW);
    if (sameDay(d, today)) return `Today, ${hm(d)}`;
    if (sameDay(d, new Date(NOW - 86400000))) return `Yesterday, ${hm(d)}`;
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + (d.getFullYear() !== today.getFullYear() ? " " + d.getFullYear() : "");
  }
  const dayLabel = (d) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  let toastT;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); }

  // ---------- state ----------
  const UI0 = () => ({ q: "", sort: "recent", range: 0, status: "all", ids: null, popOpen: false, expanded: false, summaries: {}, chats: {} });
  const ui = UI0();
  // The welcome card stays closed once dismissed. If the browser can't remember (e.g. a private window), it just shows again.
  const WELCOME_KEY = "tasklog-welcome-closed";
  let welcomeOpen = (() => { try { return localStorage.getItem(WELCOME_KEY) !== "1"; } catch { return true; } })();

  // ---------- Home ----------
  const CHAT_IC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7CC4FF" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M4 5h16v11H9l-5 4z"/></svg>';
  function renderHome() {
    const el = $("#home");
    const filtered = ui.sort !== "recent" || ui.range > 0 || ui.status !== "all";
    el.innerHTML = (welcomeOpen ? `
      <section class="welcome" aria-label="Welcome">
        <p><b>A product concept for Hyper's task log, by Satya.</b> The agent is simulated, but the screens and interactions are designed to be real.</p>
        <p><b>Try it:</b> open <a href="#customer-feedback">Ask 5 customers for product feedback</a> and reply to Priya.</p>
        <button type="button" class="welcome-x" id="welcome-close" aria-label="Close welcome message">${I.close}</button>
      </section>` : "") + `
      <div class="search-wrap">
        <form class="search" role="search" id="search-form">
          ${I.search}
          <label for="hm-q" class="sr">Search tasks</label>
          <input id="hm-q" type="search" autocomplete="off" placeholder="Search tasks" value="${esc(ui.q)}">
          <button type="button" class="icon-btn filter-pill" id="filter-btn" aria-label="Sort and filter tasks" aria-haspopup="true" aria-expanded="${ui.popOpen}" aria-pressed="${filtered}">${I.filter}<span class="lbl">Sort &amp; filter</span></button>
        </form>
        <div class="pop" id="pop" role="menu" ${ui.popOpen ? "" : "hidden"}>
          <p>Sort by</p>
          <button type="button" role="menuitemradio" data-sort="recent" aria-checked="${ui.sort === "recent"}">Most recent ${I.check}</button>
          <button type="button" role="menuitemradio" data-sort="oldest" aria-checked="${ui.sort === "oldest"}">Oldest first ${I.check}</button>
          <button type="button" role="menuitemradio" data-sort="az" aria-checked="${ui.sort === "az"}">Title A–Z ${I.check}</button>
          <hr>
          <p>Status</p>
          ${["all", ...STATUSES].map((st) => `<button type="button" role="menuitemradio" data-status="${st}" aria-checked="${ui.status === st}">${st === "all" ? "All statuses" : st} ${I.check}</button>`).join("")}
          <hr>
          <p>Last activity</p>
          ${[[0, "All time"], [7, "Last 7 days"], [30, "Last 30 days"], [90, "Last 90 days"]].map(([d, l]) => `<button type="button" role="menuitemradio" data-range="${d}" aria-checked="${ui.range === d}">${l} ${I.check}</button>`).join("")}
        </div>
      </div>
      <section aria-labelledby="hm-h" style="display:flex;flex-direction:column;gap:12px">
        <div class="recent-h"><h2 id="hm-h" class="eyebrow">Recent</h2><span class="count" id="count"></span></div>
        <div class="fchips" id="fchips"></div>
        <div class="table">
          <div class="thead"><span>Title</span><span>Status</span><span class="hide-sm">Last activity</span></div>
          <ul id="rows"></ul>
        </div>
      </section>`;
    renderRows();
  }
  function renderRows() {
    const q = ui.q.trim().toLowerCase();
    let list = PROJECTS.filter((p) => (!ui.range || Date.now() - p.last <= ui.range * 86400000) && (ui.status === "all" || p.status === ui.status) && (!ui.ids || ui.ids.ids.includes(p.id)) && (!q || p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)));
    if (ui.sort === "recent") list.sort((a, b) => b.last - a.last);
    if (ui.sort === "oldest") list.sort((a, b) => a.last - b.last);
    if (ui.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    const narrowed = q || ui.range || ui.status !== "all" || ui.ids;
    $("#count").textContent = narrowed ? `${list.length} of ${PROJECTS.length} tasks` : `${PROJECTS.length} tasks`;
    const chips = [];
    if (ui.ids) chips.push(`<span class="fchip">From chat: <b>${esc(ui.ids.label)}</b><button type="button" data-clear="ids" aria-label="Clear chat filter">${I.close}</button></span>`);
    if (ui.status !== "all") chips.push(`<span class="fchip">Status: <b>${esc(ui.status)}</b><button type="button" data-clear="status" aria-label="Clear status filter">${I.close}</button></span>`);
    if (ui.range) chips.push(`<span class="fchip">Last <b>${ui.range} days</b><button type="button" data-clear="range" aria-label="Clear date filter">${I.close}</button></span>`);
    $("#fchips").innerHTML = chips.join(""); $("#fchips").hidden = !chips.length;
    const hl = (name) => {
      if (!q) return esc(name);
      const i = name.toLowerCase().indexOf(q);
      return i < 0 ? esc(name) : esc(name.slice(0, i)) + "<mark>" + esc(name.slice(i, i + q.length)) + "</mark>" + esc(name.slice(i + q.length));
    };
    $("#rows").innerHTML = list.length ? list.map((p) => `
      <li><a class="hrow" href="#${p.id}">
        <span class="t">${I.task}<span class="nm">${hl(p.name)}</span>${p.isNew ? '<span class="new-badge">New</span>' : ""}${I.arrow}</span>
        ${stPill(p.status)}
        <span class="time hide-sm">${esc(stamp(lastTouched(p)))}</span>
      </a></li>`).join("")
      : `<li class="no-results">${q ? `No tasks match “${esc(ui.q)}”` : "No tasks match these filters"}.<br><button type="button" id="clear-q">Clear search and filters</button></li>`;
  }

  // ---------- Project ----------
  function groups(p) {
    const map = new Map();
    p.artifacts.forEach((a, i) => {
      const d = new Date(a[0]); const k = d.toDateString();
      if (!map.has(k)) map.set(k, { date: d, items: [] });
      map.get(k).items.push({ i, kind: a[1], name: a[2] });
    });
    return [...map.values()].sort((x, y) => y.date - x.date);
  }
  const chatTitle = (e) => e.chatTitle || CH[e.chat] || "a chat";
  const chatLink = (e) => (!e.chat ? "" : host ? `<button type="button" class="lnk" data-open-chat="${esc(e.chat)}">${esc(chatTitle(e))}</button>` : `<span>${esc(chatTitle(e))}</span>`);
  const ATTN_TAG = { reply: (x) => `Reply · ${x.via}`, flag: () => `Flagged by ${AI}`, waiting: (x) => `No reply · ${x.via}` };
  function renderProject(p) {
    const el = $("#project");
    const origin = [...p.activity].reverse().find((e) => e.chat);
    const waiting = p.attention.find((x) => x.kind === "waiting");
    const attn = p.attention.map((x) => {
      const primary = x.kind === "reply" ? ["reply", "Reply"] : x.kind === "waiting" ? ["followup", "Follow up"] : null;
      return `<li class="attn-item ${x.kind}">
        <div class="attn-top"><span class="tag ${x.kind}">${esc(ATTN_TAG[x.kind](x))}</span><span class="who">${esc(x.from)}</span><span class="when">${esc(stamp(new Date(x.at)))}</span></div>
        <p class="attn-text">${x.kind === "reply" ? `“${esc(x.text)}”` : esc(x.text)}</p>
        <div class="attn-actions">${primary ? `<button type="button" class="btn-lime sm" data-act="${primary[0]}" data-attn="${x.id}">${primary[1]}</button>` : ""}<button type="button" class="btn-text" data-act="dismiss" data-attn="${x.id}">Mark handled</button></div>
      </li>`;
    }).join("");
    const acts = p.activity.map((e) => {
      const ai = e.art ? p.artifacts.findIndex((a) => a[2] === e.art) : -1;
      return `<li><span class="dot"></span><div class="tl-body"><p>${esc(e.text)}</p><p class="tl-meta"><span>${esc(stamp(new Date(e.at)))}</span>${e.chat ? `<span>in ${chatLink(e)}</span>` : ""}${ai >= 0 ? `<button type="button" class="lnk" data-art="${ai}">${esc(e.art)}</button>` : ""}</p></div></li>`;
    }).join("");
    el.innerHTML = `
      <header class="proj-h">
        <a class="icon-btn back-btn" href="#" aria-label="Go back to all tasks" title="Back">${I.back}</a>
        <div style="min-width:0">
          <div class="crumb"><a href="#">All tasks</a></div>
          <h1>${esc(p.name)}</h1>
          <div class="proj-meta">${stPill(p.status)}<span>Last activity <b>${esc(stamp(lastTouched(p)))}</b></span>${origin ? `<span>Logged from ${chatLink(origin)}</span>` : ""}</div>
        </div>
      </header>

      <section class="summary" aria-labelledby="cb-sum">
        <h2 id="cb-sum" class="eyebrow">What was done</h2>
        <p class="summary-text" id="summary-text">${esc(p.summary)}</p>
        <form class="ask" id="ask-form">
          <label for="cb-ask" class="sr">Ask about this task</label>
          <span class="plus-wrap"><button type="button" class="ask-plus" data-plus aria-label="Add a document or files" aria-haspopup="true" aria-expanded="false">${I.plus}</button><span class="plus-menu" role="menu" hidden><button type="button" role="menuitem" data-add="doc">${I.doc}<span>Document</span></button><button type="button" role="menuitem" data-add="file">${I.clip}<span>Files</span></button></span></span>
          <input id="cb-ask" type="text" autocomplete="off" placeholder="Ask about this task or tell ${AI} what to do next…">
          <button type="submit" class="btn-lime">Ask</button>
        </form>
      </section>

      ${p.attention.length ? `<section class="attn" aria-labelledby="cb-attn" style="display:flex;flex-direction:column;gap:14px">
        <div class="sec-head"><h2 id="cb-attn" class="sec">Needs attention <span class="count-pill">${p.attention.length}</span></h2><p class="sec-sub">What's still open from this task's work: replies to answer, things ${AI} flagged, and people who haven't replied.</p></div>
        <ul class="attn-list">${attn}</ul>
      </section>` : ""}

      <section class="activity" aria-labelledby="cb-act" style="display:flex;flex-direction:column;gap:14px">
        <div class="sec-head"><h2 id="cb-act" class="sec">Activity</h2><p class="sec-sub">Everything that happened on this task, newest first. Replies and follow-ups you send later are added here.</p></div>
        <ol class="tl">${acts}</ol>
      </section>

      <section aria-labelledby="cb-art" style="display:flex;flex-direction:column;gap:20px">
        <div class="sec-head"><h2 id="cb-art" class="sec">Artifacts</h2><p class="sec-sub">What this task has produced so far: documents, emails and charts, newest first.</p></div>
        ${p.artifacts.length ? groups(p).map((g) => `
          <div class="art-group">
            <p class="date">${esc(dayLabel(g.date))}</p>
            <div class="art-grid">
              ${g.items.map((a) => `<button type="button" class="card" data-art="${a.i}">${I[a.kind]}<span class="nm"><b>${esc(a.name)}</b><span>${KIND[a.kind]}</span></span></button>`).join("")}
            </div>
          </div>`).join("") : `<p class="sec-sub" style="color:var(--faint)">Nothing produced yet.</p>`}
      </section>

      <section class="sources" aria-labelledby="cb-src" style="display:flex;flex-direction:column;gap:8px">
        <div class="sec-head src-head" style="margin-bottom:8px"><h2 id="cb-src" class="sec">Sources</h2><p class="sec-sub">What this task drew on: docs, messages and sessions. Deleted sources stay listed so you can see what the work was based on.</p></div>
        <ol>
          ${p.sources.map(([name, kind, gone], i) => {
            const n = String(i + 1).padStart(2, "0");
            return gone
              ? `<li><div class="src gone"><span class="src-n">${n}</span><span class="src-name">${esc(name)}</span><span class="gone-pill">No longer exists</span></div></li>`
              : `<li><button type="button" class="src" data-src="${i}"><span class="src-n">${n}</span><span class="src-name">${esc(name)}</span><span class="src-kind">${esc(kind)}</span>${I.arrowSrc}</button></li>`;
          }).join("")}
        </ol>
      </section>`;
  }

  // ---------- API shared with the host chat app ----------
  function changed(p) { if (p) recompute(p); if (current() === p) route(); else if (!current()) renderHome(); notifyHost(); }
  window.taskApi = {
    get: (id) => PROJECTS.find((p) => p.id === id),
    // Simulated agent: an answer about one task, or null when the question isn't covered.
    answer: (id, q) => { const p = PROJECTS.find((x) => x.id === id); return p ? answer(p, q) : null; },
    suggestions: SUGGESTIONS, fallback: FALLBACK,
    all: () => PROJECTS,
    counts: () => Object.fromEntries([["all", PROJECTS.length], ...STATUSES.map((st) => [st, PROJECTS.filter((p) => p.status === st).length])]),
    status: () => (ui.ids ? null : ui.status),
    showList(opts = {}) {
      ui.status = opts.status || "all"; ui.ids = opts.ids ? { ids: opts.ids, label: opts.label } : null; ui.q = ""; ui.range = 0;
      if (location.hash.length > 1) location.hash = ""; else route();
      notifyHost();
    },
    refresh: () => route(),
    // Reset demo: put every task back exactly as it was on first load.
    reset() {
      PROJECTS.splice(0, PROJECTS.length, ...seedTasks()); PROJECTS.forEach(recompute);
      Object.assign(ui, UI0());
      if (location.hash.length > 1) location.hash = ""; else route();
      notifyHost();
    },
    log(id, entry) { const p = this.get(id); if (!p) return; p.activity.unshift({ at: Date.now(), ...entry }); changed(p); },
    addArtifact(id, kind, name, content) { const p = this.get(id); if (!p) return; p.artifacts.unshift([Date.now(), kind, name, content]); changed(p); },
    addAttention(id, item) { const p = this.get(id); if (!p) return; p.attention.push({ id: "a" + Date.now().toString(36), at: Date.now(), ...item }); changed(p); },
    resolve(id, attnId) { const p = this.get(id); if (!p) return; p.attention = p.attention.filter((x) => x.id !== attnId); changed(p); },
    // Re-run the task's latest doc or chart against current sources: save a new version, settle flags, log it.
    recalibrate(id, chat) {
      const p = this.get(id); if (!p) return null;
      const base = p.artifacts[0];
      const flags = p.attention.filter((x) => x.kind === "flag");
      let name = null;
      if (base) {
        const m = base[2].match(/^(.*?)(?:\s+v(\d+))?$/); name = `${m[1]} v${(+m[2] || 1) + 1}`;
        const content = JSON.parse(JSON.stringify(base[3]));
        if (content.body) content.body.push(`Recalibrated ${new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" })} with the latest sources.`);
        p.artifacts.unshift([Date.now(), base[1], name, content]);
      }
      p.attention = p.attention.filter((x) => x.kind !== "flag");
      const removed = p.sources.filter((x) => x[2]).map((x) => x[0]);
      p.sources = p.sources.filter((x) => !x[2]);
      p.activity.unshift({ at: Date.now(), text: `Recalibrated with the latest sources${flags.length ? " and settled the flag" : ""}${removed.length ? `, removed ${removed.length} deleted ${removed.length === 1 ? "source" : "sources"}` : ""}`, art: name, ...(chat || {}) });
      changed(p);
      return { name, flags: flags.map((f) => f.text), removed };
    },
    catalog(id) {
      const p = this.get(id); if (!p) return CATALOG.slice();
      const have = new Set(p.sources.map((x) => x[0]));
      return CATALOG.filter((x) => !have.has(x[0]));
    },
    addSources(id, list, chat) {
      const p = this.get(id); if (!p || !list.length) return;
      list.forEach((x) => p.sources.push([x[0], x[1]]));
      p.activity.unshift({ at: Date.now(), text: `Added ${list.length === 1 ? "a source" : list.length + " sources"}: ${list.map((x) => x[0]).join(", ")}`, ...(chat || {}) });
      changed(p);
    },
    create({ name, summary, chat, chatTitle }) {
      const id = "t-" + Date.now().toString(36);
      const p = { id, name, summary, attention: [], activity: [{ at: Date.now(), text: "Task logged from chat", chat, chatTitle }], artifacts: [], sources: chatTitle ? [[`Chat: ${chatTitle}`, "Chat"]] : [], isNew: true };
      recompute(p); PROJECTS.unshift(p); changed(null); return p;
    },
    rename(id, name) { const p = this.get(id); if (p) { p.name = name; changed(p); } },
    remove(id) { const i = PROJECTS.findIndex((p) => p.id === id); if (i >= 0) PROJECTS.splice(i, 1); if (location.hash.slice(1) === id) location.hash = ""; else route(); notifyHost(); },
  };
  function pickerHtml(opts, pre) {
    return `<p class="picker-h">From your connected tools</p><div class="picker-list">${opts.map((o, i) => `<label class="pick"><input type="checkbox" id="${pre}-${i}" data-name="${esc(o[0])}" data-kind="${esc(o[1])}"><span>${esc(o[0])}</span><em>${esc(o[1])}</em></label>`).join("") || '<p class="sec-sub">Everything connected is already a source.</p>'}</div>
      <label class="upload"><input type="file" id="${pre}-file" multiple><span>${I.plus}Upload a file</span></label>`;
  }
  // Standalone page (no chat app): run actions with the built-in task chat.
  function runLocal(p, act, attnId) {
    const x = attnId ? p.attention.find((a) => a.id === attnId) : p.attention.find((a) => a.kind === "waiting");
    if (act === "dismiss") { window.taskApi.resolve(p.id, attnId); window.taskApi.log(p.id, { text: `Marked as handled: ${x ? x.from : "item"}` }); toast("Marked as handled"); return; }
    if (act === "recalibrate") { const r = window.taskApi.recalibrate(p.id); toast(r?.name ? `Saved ${r.name}` : "Recalibrated"); return; }
    if (act === "add-doc" || act === "add-file") { const doc = act === "add-doc"; const inp = $("#lp-file"); inp.value = ""; inp.accept = doc ? DOC_TYPES : ""; inp.onchange = () => { const list = [...inp.files].map((f) => [f.name, doc ? "Document" : "File"]); if (list.length) { window.taskApi.addSources(p.id, list); toast(`Added ${list.length === 1 ? "1 item" : list.length + " items"}`); } }; inp.click(); return; }
    openChat(p, act === "reply" ? `Draft a reply to ${x.from}` : `Draft a follow-up to ${x ? x.from : "everyone who hasn't replied"}`, x?.id, act);
  }

  // ---------- overlays ----------
  let lastFocus = null;
  function openOverlay(html, cls) {
    lastFocus = document.activeElement;
    $("#overlay").innerHTML = `<div class="scrim" data-close></div><div class="${cls}" role="dialog" aria-modal="true">${html}</div>`;
    const f = $("#overlay [data-autofocus]") || $("#overlay .icon-btn");
    f && f.focus();
  }
  function closeOverlay() {
    if (!$("#overlay").innerHTML) return;
    $("#overlay").innerHTML = "";
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  const head = (title, sub, icon) => `<div class="modal-h">${icon || ""}<div class="ttl"><b>${esc(title)}</b><span>${esc(sub)}</span></div><button type="button" class="icon-btn" data-close aria-label="Close">${I.close}</button></div>`;

  function chartSvg(c) {
    const W = 640, H = 280, L = 44, R = 16, T = 16, B = 34;
    const all = c.series.flatMap((s) => s[1]);
    let lo = Math.min(...all), hi = Math.max(...all);
    const pad = (hi - lo) * 0.15 || 1; lo = Math.max(0, lo - pad); hi = hi + pad;
    const x = (i) => L + (i * (W - L - R)) / Math.max(1, c.x.length - 1);
    const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const cols = ["#E3211A", "#7CC4FF"];
    const ticks = [0, 1, 2, 3].map((k) => lo + (k * (hi - lo)) / 3);
    const fmt = (v) => (hi - lo < 10 ? v.toFixed(1) : Math.round(v).toLocaleString());
    let g = ticks.map((t) => `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)"/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`).join("");
    g += c.x.map((lab, i) => `<text x="${x(i)}" y="${H - 10}" text-anchor="middle">${esc(lab)}</text>`).join("");
    c.series.forEach(([, vals], si) => {
      const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
      if (si === 0) g += `<polygon points="${x(0)},${H - B} ${pts} ${x(vals.length - 1)},${H - B}" fill="${cols[0]}" fill-opacity=".10"/>`;
      g += `<polyline points="${pts}" fill="none" stroke="${cols[si]}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      const li = vals.length - 1;
      g += `<circle cx="${x(li)}" cy="${y(vals[li])}" r="4.5" fill="${cols[si]}" stroke="#17181C" stroke-width="2"/>`;
    });
    const legend = c.series.map(([n], si) => `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;font-size:13px;color:var(--muted)"><i style="width:10px;height:10px;border-radius:3px;background:${cols[si]}"></i>${esc(n)}</span>`).join("");
    return `<h4>${esc(c.label)}</h4><div style="margin-bottom:10px">${legend}</div><div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.label)}">${g}</svg></div>`;
  }
  function openArtifact(p, i) {
    const [, kind, name, c] = p.artifacts[i];
    let body = "";
    if (kind === "doc") body = c.body.map((t) => `<p>${esc(t)}</p>`).join("");
    if (kind === "email") body = `<dl class="email-meta"><dt>To</dt><dd>${esc(c.to)}</dd><dt>Subject</dt><dd>${esc(c.subject)}</dd></dl>` + c.body.map((t) => `<p>${esc(t)}</p>`).join("");
    if (kind === "chart") body = chartSvg(c);
    openOverlay(head(name, `${KIND[kind]} · ${p.name}`, I[kind]) + `<div class="modal-b">${body}</div>`, "modal");
  }
  function openSource(p, i) {
    const [name, kind] = p.sources[i];
    openOverlay(head(name, `Source · ${kind}`) + `<div class="modal-b"><p>This is where <b>${esc(name)}</b> would open in its own app.</p><p style="color:var(--muted)">In this prototype, sources show as a preview only.</p></div>`, "modal");
  }

  // ---------- task chat (standalone page only; inside the app the side chat is used) ----------
  function openChat(p, first, attnId, act) {
    ui.pendingAttn = attnId || null; ui.pendingAct = act || null;
    const log = (ui.chats[p.id] ||= []);
    openOverlay(head("Task chat", p.name) + `
      <div class="msgs" id="msgs" aria-live="polite"></div>
      <form id="chat-form" class="ask" style="margin:0 16px 16px">
        <label for="chat-input" class="sr">Message</label>
        <input id="chat-input" type="text" autocomplete="off" placeholder="Ask about ${esc(p.name)}…" data-autofocus>
        <button type="submit" class="btn-lime send-icon" aria-label="Send" title="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg></button>
      </form>`, "drawer");
    drawMsgs(p);
    if (first) send(p, first);
  }
  function drawMsgs(p, pending) {
    const log = ui.chats[p.id] || [];
    const box = $("#msgs"); if (!box) return;
    let h = `<div class="msg note">Answers use this task's summary, artifacts and sources.</div>`;
    const last = log[log.length - 1];
    h += log.map((m, i) => m.draft ? draftHtml(m, i) : `<div class="msg ${m.role === "user" ? "me" : "ai"}">${esc(m.content)}</div>`).join("");
    if ((!last || last.content === FALLBACK) && pending === undefined) h += `<div class="chips">${SUGGESTIONS.map((q) => `<button type="button" data-suggest="${esc(q)}">${esc(q)}</button>`).join("")}</div>`;
    if (pending !== undefined) h += `<div class="msg ai ${pending ? "" : "thinking"}" id="pending">${pending ? esc(pending) : "Thinking…"}</div>`;
    box.innerHTML = h; box.scrollTop = box.scrollHeight;
    if (pending === undefined && last && last.draft) { const el = box.querySelector(".has-draft:last-of-type") || [...box.querySelectorAll(".has-draft")].pop(); if (el) box.scrollTop = el.offsetTop - box.offsetTop - 12; }
  }
  // ---------- email drafts: draft, ask, then send on the user's click ----------
  const SEND_IC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></svg>';
  const wantsDraft = (q) => /\b(draft|write|compose|prepare)\b/i.test(q) && /\b(e-?mail|mail|update|note|message|reply|follow[- ]?up)\b/i.test(q);
  function templateDraft(p, q) {
    const s = q.toLowerCase();
    const prior = p.artifacts.find((a) => a[1] === "email");
    const named = q.match(/\bto\s+([\w.+-]+@[\w.-]*)/i);
    const to = named ? named[1] : /manager/.test(s) ? "manager@" : /investor/.test(s) ? "investors@" : prior ? prior[3].to : "team@";
    const x = ui.pendingAttn && p.attention.find((a) => a.id === ui.pendingAttn);
    if (x) return actionDraft(p, x, ui.pendingAct);
    return { to, subject: `Update: ${p.name}`, body: `Hi,\n\nQuick update on \u201c${p.name}\u201d.\n\n${p.summary}\n\nThanks,` };
  }
  function actionDraft(p, x, act) {
    const first = x.from.split(/[ ,]/)[0];
    if (act === "reply") return { to: `${x.from} (${x.via})`, subject: `Re: ${p.name}`, body: `Hi ${first},\n\nThanks for getting back to me. On your question (\u201c${x.text}\u201d): happy to walk you through it. Would a 15-minute call this week work?\n\nThanks,` };
    return { to: `${x.from} (${x.via})`, subject: `Following up: ${p.name}`, body: `Hi {first_name},\n\nQuick follow-up on my last message. ${p.summary.split(/(?<=\.)\s+/)[0]}\n\nWould 20 minutes next week be useful?\n\nThanks,` };
  }
  async function makeDraft(p, q) {
    await new Promise((r) => setTimeout(r, 650));
    return templateDraft(p, q);
  }
  function draftHtml(m, i) {
    const d = m.draft;
    let card;
    if (m.status === "editing") {
      card = `<div class="draft"><dl><dt><label for="d-to-${i}">To</label></dt><dd><input id="d-to-${i}" value="${esc(d.to)}"></dd><dt><label for="d-sub-${i}">Subject</label></dt><dd><input id="d-sub-${i}" value="${esc(d.subject)}"></dd></dl>
        <div class="edit-body"><label for="d-body-${i}" class="sr">Email body</label><textarea id="d-body-${i}">${esc(d.body)}</textarea></div>
        <div class="draft-actions"><button type="button" class="btn-lime" data-draft="send" data-i="${i}">${SEND_IC}Send</button><button type="button" class="btn-ghost" data-draft="save" data-i="${i}">Save changes</button></div></div>`;
    } else {
      const foot = m.status === "sent"
        ? `<div class="draft-status sent">${I.check}Sent to ${esc(d.to)} at ${esc(m.sentAt)} · saved to Artifacts</div>`
        : m.status === "discarded"
        ? `<div class="draft-status">Not sent. Draft discarded.</div>`
        : `<div class="draft-actions"><button type="button" class="btn-lime" data-draft="send" data-i="${i}">${SEND_IC}Send</button><button type="button" class="btn-ghost" data-draft="edit" data-i="${i}">Edit</button><button type="button" class="btn-ghost" data-draft="discard" data-i="${i}">Don't send</button></div>`;
      card = `<div class="draft${m.status === "discarded" ? " discarded" : ""}"><dl><dt>To</dt><dd>${esc(d.to)}</dd><dt>Subject</dt><dd>${esc(d.subject)}</dd></dl><div class="body">${esc(d.body)}</div>${foot}</div>`;
    }
    const lead = m.status === "sent" ? "Here's the email I sent." : m.status === "discarded" ? "Here's the draft you chose not to send." : "Here's a draft. Should I send it?";
    return `<div class="msg ai has-draft">${lead}${card}</div>`;
  }
  function draftAction(p, act, i) {
    const log = ui.chats[p.id] || []; const m = log[i]; if (!m || !m.draft) return;
    if (m.status === "editing") {
      m.draft = { to: $("#d-to-" + i).value.trim() || m.draft.to, subject: $("#d-sub-" + i).value.trim() || m.draft.subject, body: $("#d-body-" + i).value };
    }
    if (act === "edit") { m.status = "editing"; drawMsgs(p); $("#d-body-" + i)?.focus(); return; }
    if (act === "save") { m.status = "pending"; drawMsgs(p); toast("Draft updated"); return; }
    if (act === "discard") { m.status = "discarded"; m.content = "Draft discarded."; drawMsgs(p); return; }
    if (act === "send") {
      m.status = "sent"; m.sentAt = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      m.content = `Sent the email "${m.draft.subject}" to ${m.draft.to}.`;
      window.taskApi.addArtifact(p.id, "email", m.draft.subject, { to: m.draft.to, subject: m.draft.subject, body: m.draft.body.split(/\n\s*\n/) });
      if (m.attn) window.taskApi.resolve(p.id, m.attn);
      window.taskApi.addAttention(p.id, { kind: "waiting", from: m.draft.to, via: "Email", text: m.act === "followup" ? "Followed up. No reply yet." : m.act === "reply" ? "Replied. Waiting for their response." : "Sent. No reply yet." });
      window.taskApi.log(p.id, { text: m.act === "reply" ? `Replied to ${m.draft.to}` : m.act === "followup" ? `Followed up with ${m.draft.to}` : `Sent \u201c${m.draft.subject}\u201d to ${m.draft.to}`, art: m.draft.subject });
      drawMsgs(p); toast(`Email sent to ${m.draft.to}`);
    }
  }

  // ---------- agent answers ----------
  // The agent is simulated: answers to questions about a task are built from that task's data.
  // The app's chats use these too (taskApi.answer), so both places reply the same way.
  const bullets = (xs) => xs.map((x) => "• " + x).join("\n");
  const firstName = (from) => from.split(/[ ,]/)[0];
  const count = (n, one, many) => (n === 1 ? `one ${one}` : `${["two", "three", "four", "five", "six", "seven", "eight", "nine"][n - 2] || n} ${many}`);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function gist(a) {
    const [, kind, name, c] = a;
    if (kind === "email") return `${name}: email to ${c.to}, \u201c${c.subject}\u201d`;
    if (kind === "chart") return `${name}: chart of ${c.label.charAt(0).toLowerCase() + c.label.slice(1)}`;
    if (c.body.length > 2 && c.body.every((l) => l.length < 40)) return `${name}: a list of ${c.body.length}, starting with ${c.body[0]} and ${c.body[1]}`;
    return `${name}: ${c.body[0]}`;
  }
  function answer(p, q) {
    const s = q.toLowerCase();
    if (/source/.test(s)) {
      const live = p.sources.filter((x) => !x[2]), gone = p.sources.filter((x) => x[2]);
      let out = live.length ? `For \u201c${p.name}\u201d I worked from ${count(live.length, "source", "sources")}:\n${bullets(live.map((x) => `${x[0]} (${x[1]})`))}` : `\u201c${p.name}\u201d has no sources yet.`;
      if (gone.length) out += `\n\nI also used ${gone.length === 1 ? "one that has" : count(gone.length, "", "that have").replace("  ", " ")} since been deleted:\n${bullets(gone.map((x) => x[0]))}`;
      return out + "\n\nThey're listed under Sources on the task page.";
    }
    if (/summar|latest artifact/.test(s)) {
      if (!p.artifacts.length) return `Nothing has been produced for \u201c${p.name}\u201d yet.`;
      const latest = p.artifacts.slice(0, 3);
      return `The latest ${latest.length === 1 ? "artifact" : count(latest.length, "", "artifacts").trim()} on \u201c${p.name}\u201d, newest first:\n${bullets(latest.map(gist))}\n\nOpen any of them under Artifacts on the task page.`;
    }
    if (/document|artifact|made|produced|created|written|file/.test(s)) {
      if (!p.artifacts.length) return `I haven't made anything for \u201c${p.name}\u201d yet.`;
      const n = p.artifacts.length;
      return `I've made ${count(n, "thing", "things")} for \u201c${p.name}\u201d:\n${bullets(p.artifacts.map((a) => `${a[2]} (${KIND[a[1]]}, ${dayLabel(new Date(a[0]))})`))}\n\nEach one is saved under Artifacts on the task page.`;
    }
    if (/undecided|open|attention|question|waiting|repl|left|remaining|pending|need|decide/.test(s)) {
      if (!p.attention.length) return `Nothing is undecided on \u201c${p.name}\u201d. Everything has been handled, so the task is Done.`;
      const line = (x) => x.kind === "reply" ? `${x.from} replied: \u201c${x.text}\u201d` : x.kind === "flag" ? `I flagged: ${x.text}` : `${x.from}: ${x.text}`;
      const reply = p.attention.find((x) => x.kind === "reply"), wait = p.attention.find((x) => x.kind === "waiting");
      const next = reply ? `\n\nWant me to answer ${firstName(reply.from)}? Ask me to \u201cdraft a reply to ${firstName(reply.from)}\u201d, or use Reply on the task page.`
        : wait ? "\n\nI can follow up if you like: ask me to \u201cdraft a follow-up\u201d." : "";
      return `${cap(count(p.attention.length, "thing is", "things are"))} still open on \u201c${p.name}\u201d:\n${bullets(p.attention.map(line))}${next}`;
    }
    if (/happen|activity|history|did|status|where are we|progress/.test(s)) return `\u201c${p.name}\u201d is ${p.status === "Needs you" ? "waiting on you" : p.status === "Waiting" ? "waiting on other people" : "done"}. What happened, newest first:\n${bullets(p.activity.slice(0, 5).map((e) => e.text))}`;
    if (/update|manager|email/.test(s)) return `Quick update on ${p.name}:\n\n${p.summary}`;
    return null;
  }
  const canned = (p, q) => answer(p, q) || FALLBACK;
  async function send(p, q) {
    const log = (ui.chats[p.id] ||= []);
    log.push({ role: "user", content: q });
    drawMsgs(p, "");
    if (wantsDraft(q)) {
      const d = await makeDraft(p, q);
      log.push({ role: "assistant", content: `Drafted an email to ${d.to} with subject "${d.subject}". Asked whether to send it.`, draft: d, status: "pending", attn: ui.pendingAttn, act: ui.pendingAct });
      ui.pendingAttn = ui.pendingAct = null;
      drawMsgs(p); return;
    }
    await new Promise((r) => setTimeout(r, 600));
    log.push({ role: "assistant", content: canned(p, q) });
    drawMsgs(p);
  }

  // ---------- routing ----------
  function current() { return PROJECTS.find((p) => p.id === location.hash.slice(1)); }
  function route() {
    closeOverlay();
    const p = current();
    $("#home").hidden = !!p; $("#project").hidden = !p;
    const el = p ? $("#project") : $("#home");
    if (p) { ui.expanded = false; renderProject(p); } else { ui.popOpen = false; renderHome(); }
    el.classList.remove("view-enter"); void el.offsetWidth; el.classList.add("view-enter");
    window.scrollTo(0, 0);
    document.title = p ? `${p.name} · Task Log Prototype` : "Task Log Prototype";
    try { host?.onRoute?.(p ? p.id : null); } catch {}
  }
  window.addEventListener("hashchange", route);

  // ---------- events ----------
  document.addEventListener("input", (e) => {
    if (e.target.id === "hm-q") { ui.q = e.target.value; renderRows(); }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = current();
    if (e.target.id === "search-form") { const a = $("#rows a"); a && (location.hash = a.getAttribute("href")); }
    if (e.target.id === "ask-form" && p) { const v = $("#cb-ask").value.trim(); $("#cb-ask").value = ""; if (host) host.startTaskChat(p.id, v || null); else openChat(p, v || null); }
    if (e.target.id === "chat-form" && p) { const i = $("#chat-input"), v = i.value.trim(); if (v) { i.value = ""; send(p, v); } }
  });
  document.addEventListener("click", (e) => {
    const t = e.target;
    const p = current();
    if (t.closest("[data-close]")) { closeOverlay(); return; }
    if (t.closest("#welcome-close")) { welcomeOpen = false; try { localStorage.setItem(WELCOME_KEY, "1"); } catch {} $(".welcome")?.remove(); return; }
    if (t.closest("#filter-btn")) { ui.popOpen = !ui.popOpen; $("#pop").hidden = !ui.popOpen; t.closest("#filter-btn").setAttribute("aria-expanded", ui.popOpen); if (ui.popOpen) $("#pop button[aria-checked=true]").focus(); return; }
    const so = t.closest("[data-sort]");
    if (so) { ui.sort = so.dataset.sort; ui.popOpen = false; renderHome(); $("#filter-btn").focus(); return; }
    const sf = t.closest("#pop [data-status]");
    if (sf) { ui.status = sf.dataset.status; ui.ids = null; ui.popOpen = false; renderHome(); $("#filter-btn").focus(); notifyHost(); return; }
    const cl = t.closest("[data-clear]");
    if (cl) { const k = cl.dataset.clear; if (k === "ids") ui.ids = null; if (k === "status") ui.status = "all"; if (k === "range") ui.range = 0; renderHome(); notifyHost(); return; }
    const rg = t.closest("[data-range]");
    if (rg) { ui.range = +rg.dataset.range; ui.popOpen = false; renderHome(); $("#filter-btn").focus(); return; }
    if (ui.popOpen && !t.closest("#pop")) { ui.popOpen = false; $("#pop").hidden = true; $("#filter-btn")?.setAttribute("aria-expanded", false); }
    if (t.closest("#clear-q")) { ui.q = ""; ui.range = 0; ui.status = "all"; ui.ids = null; notifyHost(); renderHome(); $("#hm-q").focus(); return; }
    if (!p) return;
    const oc = t.closest("[data-open-chat]"); if (oc && host) { host.openChat(oc.dataset.openChat); return; }
    const pl = t.closest("[data-plus]");
    if (pl) { const m = pl.nextElementSibling; m.hidden = !m.hidden; pl.setAttribute("aria-expanded", String(!m.hidden)); return; }
    const ad = t.closest("[data-add]");
    document.querySelectorAll(".plus-menu").forEach((m) => { m.hidden = true; m.previousElementSibling?.setAttribute("aria-expanded", "false"); });
    if (ad) { const act = ad.dataset.add === "doc" ? "add-doc" : "add-file"; if (host) host.runAction(p.id, act); else runLocal(p, act); return; }
    const ac = t.closest("[data-act]");
    if (ac && !ac.disabled) {
      const act = ac.dataset.act, attnId = ac.dataset.attn || null;
      if (act === "dismiss") { const x = p.attention.find((a) => a.id === attnId); window.taskApi.resolve(p.id, attnId); window.taskApi.log(p.id, { text: `Marked as handled: ${x ? x.from : "item"}` }); toast("Marked as handled"); return; }
      if (host) host.runAction(p.id, act, attnId); else runLocal(p, act, attnId);
      return;
    }
    const a = t.closest("[data-art]"); if (a) { openArtifact(p, +a.dataset.art); return; }
    const s = t.closest("[data-src]"); if (s) { openSource(p, +s.dataset.src); return; }
    const sg = t.closest("[data-suggest]"); if (sg) { send(p, sg.dataset.suggest); return; }
    const da = t.closest("[data-draft]"); if (da) { draftAction(p, da.dataset.draft, +da.dataset.i); return; }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#overlay").innerHTML) closeOverlay();
    else if (ui.popOpen) { ui.popOpen = false; $("#pop").hidden = true; $("#filter-btn").focus(); }
    else if (current() && !/INPUT/.test(document.activeElement.tagName)) location.hash = "";
  });

  route();
})();
