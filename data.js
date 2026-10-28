// Example data for the prototype: the sample tasks in the Task log and the chats in the sidebar.
// Both the app (index.html) and the task log (tasklog.html) read it. demoData() returns a fresh copy
// each time, which is how "Reset demo" puts everything back as it was on first load.
//
// A task is the record of work done in a chat. Times are minutes before the page loaded.
// attention: what is still open, and where it came from:
//   reply   = someone answered            -> Needs you
//   flag    = something couldn't be settled while working -> Needs you
//   waiting = people contacted haven't answered yet        -> Waiting
// A chat's `tasks` lists the ids of the tasks it is linked to.
window.demoData = () => {
  const D = 1440;
  const tasks = [
    { id: "customer-feedback", name: "Ask 5 customers for product feedback",
      summary: "Emailed five active customers asking for 15 minutes of feedback on the new onboarding. Two have replied so far.",
      attention: [
        { id: "a1", kind: "reply", from: "Priya Shah, Northwind", via: "Email", at: 90, text: "Happy to help. Could we do a quick call instead of filling in a form?" },
        { id: "a2", kind: "waiting", from: "3 customers", via: "Email", at: 2 * D, text: "No reply 2 days after the email." },
      ],
      activity: [
        { at: 90, text: "Priya Shah (Northwind) replied with a question" },
        { at: 5 * 60, text: "Leo Park (Brightside) replied and booked a call" },
        { at: 2 * D, text: "Emailed 5 customers", art: "Feedback request email" },
        { at: 2 * D + 20, text: "Picked 5 active customers from the CRM", art: "Customer shortlist", chat: "c5" },
        { at: 2 * D + 30, text: "Task logged from chat", chat: "c5" },
      ],
      artifacts: [
        [2 * D, "email", "Feedback request email", { to: "5 customers", subject: "15 minutes of feedback?", body: ["Hi {first_name},", "We just shipped a new onboarding flow and you're one of our most active teams. Could you spare 15 minutes this week to tell us what you think?", "Thanks!"] }],
        [2 * D + 20, "doc", "Customer shortlist", { body: ["Northwind: Priya Shah", "Brightside: Leo Park", "Fieldnote: Sam Ortiz", "Lumen Labs: Maya Chen", "Ordinal: Tom Reyes"] }],
      ],
      sources: [["CRM: active customers", "Sheets"], ["Gmail: customer threads", "Gmail"], ["Notion: old feedback form", "Notion", true]] },

    { id: "weekly-update", name: "Write the weekly team update",
      summary: "Wrote this week's update from the team's Notion notes and sent the draft to Alex for a quick check.",
      attention: [
        { id: "a1", kind: "flag", from: "Flagged while writing", via: "Sheets", at: 120, text: "Friday's signups weren't in the sheet yet, so the weekly total may be low." },
        { id: "a2", kind: "waiting", from: "Alex", via: "Slack", at: 110, text: "Asked for a quick check. No reply yet." },
      ],
      activity: [
        { at: 110, text: "Sent the draft to Alex for a quick check", art: "Weekly update draft" },
        { at: 120, text: "Flagged: Friday's signups are missing from the sheet" },
        { at: 130, text: "Wrote the update from the team's notes", art: "Signups this week", chat: "c4" },
        { at: 140, text: "Task logged from chat", chat: "c4" },
      ],
      artifacts: [
        [110, "doc", "Weekly update draft", { body: ["Shipped: the new onboarding checklist.", "Signups: 412 this week, up 9% (Friday still to come).", "Next week: refresh the pricing page."] }],
        [130, "chart", "Signups this week", { label: "Daily signups this week", series: [["Signups", [52, 61, 58, 70, 64, 48, 59]]], x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
      ],
      sources: [["Notion: team notes", "Notion"], ["Sheets: signups", "Sheets"], ["Notion: last week's update (draft)", "Notion", true], ["Slack #general", "Slack"]] },

    { id: "candidate-follow-up", name: "Follow up with a design candidate",
      summary: "Sent Jordan a thank-you note after the interview, with the next steps and timeline.",
      attention: [
        { id: "a1", kind: "reply", from: "Jordan Lee, candidate", via: "Email", at: 20 * 60, text: "Thanks so much! Is the role open to remote work?" },
      ],
      activity: [
        { at: 20 * 60, text: "Jordan Lee replied with a question" },
        { at: 22 * 60, text: "Sent Jordan a thank-you note", art: "Thank-you note to Jordan", chat: "c3" },
        { at: 22 * 60 + 10, text: "Task logged from chat", chat: "c3" },
      ],
      artifacts: [[22 * 60, "email", "Thank-you note to Jordan", { to: "jordan@", subject: "Thanks for today", body: ["Hi Jordan,", "Thanks for taking the time to talk with us today. We'll be in touch with next steps by Friday."] }]],
      sources: [["Gmail: interview thread", "Gmail"], ["Notion: job description", "Notion"]] },

    { id: "invoice-reminder", name: "Remind a client about an unpaid invoice",
      summary: "Sent Acme Studio a friendly reminder about invoice #1042, which is 10 days overdue.",
      attention: [
        { id: "a1", kind: "waiting", from: "Acme Studio", via: "Email", at: 3 * D, text: "No reply 3 days after the reminder." },
      ],
      activity: [
        { at: 3 * D, text: "Sent a reminder to Acme Studio", art: "Invoice reminder" },
        { at: 3 * D + 10, text: "Found invoice #1042, 10 days overdue", chat: "c2" },
        { at: 3 * D + 15, text: "Task logged from chat", chat: "c2" },
      ],
      artifacts: [[3 * D, "email", "Invoice reminder", { to: "billing@ (Acme Studio)", subject: "Friendly reminder: invoice #1042", body: ["Hi there,", "Just a quick reminder that invoice #1042 for $2,400 was due 10 days ago. Let me know if you need anything from us.", "Thanks!"] }]],
      sources: [["Sheets: invoices", "Sheets"], ["Gmail: Acme Studio thread", "Gmail"]] },

    { id: "meeting-summary", name: "Summarise Monday's team meeting",
      summary: "Turned Monday's meeting notes into a short summary with three action items and shared it in Slack.",
      attention: [],
      activity: [
        { at: 4 * D, text: "Shared the summary in #general", art: "Meeting summary" },
        { at: 4 * D + 10, text: "Summarised the meeting notes", chat: "c4" },
        { at: 4 * D + 15, text: "Task logged from chat", chat: "c4" },
      ],
      artifacts: [[4 * D, "doc", "Meeting summary", { body: ["Agreed to ship the onboarding checklist on Wednesday.", "Alex owns the pricing page refresh.", "Next team lunch on Friday."] }]],
      sources: [["Notion: Monday meeting notes", "Notion"]] },

    { id: "blog-post", name: "Draft a blog post for the launch",
      summary: "Drafted a 600-word post about the new onboarding and sent it to Sam for review.",
      attention: [
        { id: "a1", kind: "waiting", from: "Sam", via: "Slack", at: 6 * D, text: "Sent for review. No reply yet." },
      ],
      activity: [
        { at: 6 * D, text: "Sent the draft to Sam for review", art: "Launch blog post" },
        { at: 6 * D + 20, text: "Drafted the post from the release notes", chat: "c1" },
        { at: 6 * D + 30, text: "Task logged from chat", chat: "c1" },
      ],
      artifacts: [[6 * D, "doc", "Launch blog post", { body: ["Getting started should take minutes, not days.", "Our new onboarding checklist walks every new team through setup, step by step."] }]],
      sources: [["Notion: release notes", "Notion"], ["Notion: brand voice guide", "Notion"]] },

    { id: "laptop-quotes", name: "Compare quotes for new laptops",
      summary: "Asked two suppliers to quote for 4 laptops and compared the totals. Supplier B is $280 cheaper.",
      attention: [],
      activity: [
        { at: 3 * D + 60, text: "Compared both quotes", art: "Laptop quotes" },
        { at: 5 * D, text: "Asked two suppliers for quotes", chat: "c2" },
        { at: 5 * D + 10, text: "Task logged from chat", chat: "c2" },
      ],
      artifacts: [[3 * D + 60, "chart", "Laptop quotes", { label: "Quote for 4 laptops (USD)", series: [["Total", [5160, 4880]]], x: ["Supplier A", "Supplier B"] }]],
      sources: [["Gmail: supplier quotes", "Gmail"]] },

    { id: "team-lunch", name: "Book the team lunch",
      summary: "Booked a table for 8 at Lucia's for Friday at 1pm and sent the invite to the team.",
      attention: [],
      activity: [
        { at: 6 * D + 60, text: "Sent the lunch invite to the team", art: "Lunch invite" },
        { at: 6 * D + 90, text: "Booked a table for 8 at Lucia's", chat: "c1" },
        { at: 6 * D + 100, text: "Task logged from chat", chat: "c1" },
      ],
      artifacts: [[6 * D + 60, "email", "Lunch invite", { to: "team@", subject: "Team lunch on Friday", body: ["Hi all,", "We're booked at Lucia's this Friday at 1pm. See you there!"] }]],
      sources: [["Gmail: Lucia's booking", "Gmail"], ["Calendar: team availability", "Calendar"]] },
  ];

  const chats = [
    { id: "c6", title: "Plan the December team offsite", minutesAgo: 8, tasks: [], msgs: [
      { role: "user", text: "We want a two-day team offsite in early December for 12 people, within 2 hours of SF. Ideas?" },
      { role: "ai", text: "Three options that fit:\n• Cavallo Point, Sausalito: meeting barn, 30 min away\n• Carmel Valley Ranch: 2 hours, includes workshop rooms\n• Sonoma Retreat House: whole-house rental, sleeps 14\n\nSonoma is the best fit for 12 people on a budget. Want me to draft an email to check their availability?" },
    ]},
    { id: "c5", title: "Customer feedback round", minutesAgo: 25, tasks: ["customer-feedback"], msgs: [
      { role: "user", text: "Can you ask five of our most active customers for feedback on the new onboarding?" },
      { role: "ai", text: "Done. I emailed Priya (Northwind), Leo (Brightside) and three others, asking for 15 minutes this week. Replies will show up on the task in your Task log." },
    ]},
    { id: "c4", title: "Weekly update", minutesAgo: 94, tasks: ["weekly-update", "meeting-summary"], msgs: [
      { role: "user", text: "Write this week's team update from our Notion notes." },
      { role: "ai", text: "Here's the gist:\n• Shipped the new onboarding checklist\n• 412 signups this week, up 9%\n• Next week: pricing page refresh\n\nI sent the draft to Alex for a quick check. One thing: Friday's signups aren't in the sheet yet, so I flagged the total." },
    ]},
    { id: "c3", title: "Hiring a designer", minutesAgo: 60 * 22, tasks: ["candidate-follow-up"], msgs: [
      { role: "user", text: "Send Jordan a thank-you note after today's interview." },
      { role: "ai", text: "Sent. I thanked Jordan for their time and said we'll be in touch with next steps by Friday." },
    ]},
    { id: "c2", title: "Finance admin", minutesAgo: 60 * 24 * 3, tasks: ["invoice-reminder", "laptop-quotes"], msgs: [
      { role: "user", text: "Remind Acme Studio about invoice #1042, and get laptop quotes from our two suppliers." },
      { role: "ai", text: "Reminder sent to Acme Studio. Both suppliers have quoted for 4 laptops: Supplier B is $280 cheaper. The comparison is saved on the task." },
    ]},
    { id: "c1", title: "Launch week", minutesAgo: 60 * 24 * 6, tasks: ["blog-post", "team-lunch"], msgs: [
      { role: "user", text: "Draft a launch blog post and book a team lunch for Friday." },
      { role: "ai", text: "The post is drafted and with Sam for review. Lunch is booked at Lucia's, Friday at 1pm, table for 8." },
    ]},
  ];

  return { tasks, chats };
};
