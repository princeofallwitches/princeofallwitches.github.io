const works = [
  {
    id: "forge-runner",
    title: "Forge Runner",
    author: "Jalen Cross",
    genre: "LitRPG",
    price: "$4.99",
    color: "linear-gradient(145deg, #0b4549, #d9902f)",
    progress: 46,
    tags: ["LitRPG", "Crafting", "Raid"],
    bites: [
      {
        title: "A Hammer With a Cooldown",
        seconds: 180,
        retention: "91%",
        branch: "2 choices",
        audio: "An ex-blacksmith discovers his starter skill is not combat. It is customer service under fire.",
        body: "The raid timer blinked above the shop door. Marius had three minutes, a cracked apron, and one hammer that could only swing every twelve seconds. The heroes outside wanted swords. The monsters wanted meat. The system, with its perfect cruelty, wanted a tutorial.",
        choices: ["Bar the door and craft fast", "Open early and sell to both sides"]
      },
      {
        title: "Inventory Management Is Violence",
        seconds: 220,
        retention: "88%",
        branch: "3 choices",
        audio: "A funny, tense clip where sorting potions becomes the difference between a town and a crater.",
        body: "Every bottle had a number. Every number had a story. Marius learned that the difference between a healing draught and a blast flask was a thumb-width of red wax and the confidence of whoever threw it first.",
        choices: ["Trust the apprentice", "Audit every bottle", "Use the rare flask"]
      }
    ]
  },
  {
    id: "city-of-switches",
    title: "City of Switches",
    author: "Mara Voss",
    genre: "Interactive noir",
    price: "$3.99",
    color: "linear-gradient(145deg, #2f5d8c, #b94a3d)",
    progress: 18,
    tags: ["Branching", "Noir", "Mystery"],
    bites: [
      {
        title: "The Elevator That Lied",
        seconds: 160,
        retention: "86%",
        branch: "4 choices",
        audio: "A private investigator enters a building where each floor remembers a different crime.",
        body: "The elevator panel had thirteen buttons and no lobby. When Reina pressed three, the brass doors reflected a version of her that had already solved the case and deeply regretted it.",
        choices: ["Go to floor 3", "Press every odd number", "Leave a voice memo", "Cut the power"]
      }
    ]
  },
  {
    id: "canon-fodder",
    title: "Canon Fodder",
    author: "Theo Amadi",
    genre: "Literary games",
    price: "$5.99",
    color: "linear-gradient(145deg, #17191f, #126e72)",
    progress: 72,
    tags: ["Serious", "Games", "Family"],
    bites: [
      {
        title: "Patch Notes for My Father",
        seconds: 240,
        retention: "83%",
        branch: "linear",
        audio: "A measured, literary monologue using games as the language for grief and repair.",
        body: "My father never played games, but he understood patches. Fix the sink. Fix the car. Fix the tone in your voice before your mother hears it. Years later, I wrote his illness as a changelog because plain sentences kept breaking in my hands.",
        choices: []
      }
    ]
  },
  {
    id: "starved-saints",
    title: "Starved Saints of Level Nine",
    author: "Nico Vale",
    genre: "Progression fantasy",
    price: "$4.49",
    color: "linear-gradient(145deg, #7c2f25, #d9902f)",
    progress: 9,
    tags: ["Progression", "Dark", "Guild"],
    bites: [
      {
        title: "The Hunger Stat",
        seconds: 205,
        retention: "94%",
        branch: "2 choices",
        audio: "A brutal fantasy opener where every blessing has a cost measured in appetite.",
        body: "The priest said the gods loved sacrifice. He did not mention they loved math. When the blue window opened above Ira's palm, the first stat was not strength, grace, or faith. It was hunger, and it was already counting down.",
        choices: ["Eat the relic", "Refuse the blessing"]
      }
    ]
  }
];

let state = {
  view: "feed",
  feed: "smart",
  query: "",
  workIndex: 0,
  biteIndex: 0,
  completed: Number(localStorage.getItem("storybroCompleted") || 3)
};

const viewTitles = {
  feed: "For You",
  library: "Library",
  store: "Store",
  reader: "Reader",
  format: "BookBite Format"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function currentWork() {
  return works[state.workIndex];
}

function currentBite() {
  return currentWork().bites[state.biteIndex];
}

function allBites() {
  return works.flatMap((work, workIndex) =>
    work.bites.map((bite, biteIndex) => ({ ...bite, work, workIndex, biteIndex }))
  );
}

function matchesQuery(item) {
  const text = `${item.title} ${item.work?.title || item.title} ${item.author || item.work?.author} ${(item.tags || item.work?.tags || []).join(" ")}`.toLowerCase();
  return text.includes(state.query.toLowerCase());
}

function rankedBites() {
  let bites = allBites().filter(matchesQuery);
  if (state.feed === "litrpg") bites = bites.filter((bite) => bite.work.tags.some((tag) => ["LitRPG", "Progression", "Raid", "Crafting"].includes(tag)));
  if (state.feed === "serious") bites = bites.filter((bite) => bite.work.tags.includes("Serious"));
  if (state.feed === "audio") bites = bites.filter((bite) => bite.audio);
  return bites.sort((a, b) => parseInt(b.retention, 10) - parseInt(a.retention, 10));
}

function cover(work) {
  return `<div class="cover-chip" style="background:${work.color}">${work.title.split(" ").map((word) => word[0]).join("").slice(0, 3)}</div>`;
}

function renderFeed() {
  $("#feedGrid").innerHTML = rankedBites().map((bite) => `
    <article class="bite-card">
      <div class="card-meta"><span>${bite.work.genre}</span><span>${bite.seconds}s</span></div>
      ${cover(bite.work)}
      <h3>${bite.title}</h3>
      <p>${bite.body.slice(0, 126)}...</p>
      <div class="tags">${bite.work.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <button class="primary-action" data-open="${bite.workIndex}:${bite.biteIndex}">Read BookBite</button>
    </article>
  `).join("");
}

function renderLibrary() {
  $("#librarySummary").textContent = `${works.length} works, ${allBites().length} BookBites sampled`;
  $("#libraryGrid").innerHTML = works.filter(matchesQuery).map((work, index) => `
    <article class="shelf-card">
      ${cover(work)}
      <h3>${work.title}</h3>
      <p>${work.author} - ${work.genre}</p>
      <span class="meter"><span style="width:${work.progress}%"></span></span>
      <div class="card-meta"><span>${work.progress}% complete</span><span>${work.bites.length} bites loaded</span></div>
      <button class="secondary-action" data-work="${index}">Continue</button>
    </article>
  `).join("");
}

function renderStore() {
  $("#storeGrid").innerHTML = works.filter(matchesQuery).map((work, index) => `
    <article class="store-card">
      <div class="card-meta"><span>${work.genre}</span><strong>${work.price}</strong></div>
      ${cover(work)}
      <h3>${work.title}</h3>
      <p>By ${work.author}. Includes bite feed entries, full-work reading, audio clips, and creator updates.</p>
      <div class="tags">${work.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <button class="primary-action" data-work="${index}">Preview</button>
    </article>
  `).join("");
}

function renderReader() {
  const work = currentWork();
  const bite = currentBite();
  $("#readerSeries").textContent = `${work.title} by ${work.author}`;
  $("#readerProgress").textContent = `BookBite ${state.biteIndex + 1} of ${work.bites.length}`;
  $("#readerTitle").textContent = bite.title;
  $("#readerBody").textContent = bite.body;
  $("#audioTitle").textContent = bite.audio;
  $("#retentionStat").textContent = bite.retention;
  $("#branchStat").textContent = bite.branch;
  $("#prevBite").disabled = state.biteIndex === 0;
  $("#nextBite").textContent = state.biteIndex === work.bites.length - 1 ? "Find next entry" : "Next BookBite";
  $("#choiceBox").innerHTML = bite.choices.length
    ? bite.choices.map((choice) => `<button data-choice="${choice}">${choice}</button>`).join("")
    : `<button data-choice="linear">Save this line and continue</button>`;
}

function renderStats() {
  $("#biteCount").textContent = state.completed;
  $("#streakMeter").style.width = `${Math.min(100, state.completed * 8)}%`;
}

function render() {
  $("#viewTitle").textContent = viewTitles[state.view];
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === state.view));
  renderFeed();
  renderLibrary();
  renderStore();
  renderReader();
  renderStats();
}

function openReader(workIndex, biteIndex = 0) {
  state.workIndex = workIndex;
  state.biteIndex = biteIndex;
  state.view = "reader";
  render();
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  const feed = event.target.closest("[data-feed]");
  const open = event.target.closest("[data-open]");
  const work = event.target.closest("[data-work]");
  const choice = event.target.closest("[data-choice]");

  if (nav) state.view = nav.dataset.view;
  if (feed) {
    state.feed = feed.dataset.feed;
    $$(".segment").forEach((item) => item.classList.toggle("active", item === feed));
  }
  if (open) {
    const [workIndex, biteIndex] = open.dataset.open.split(":").map(Number);
    openReader(workIndex, biteIndex);
    return;
  }
  if (work) {
    openReader(Number(work.dataset.work));
    return;
  }
  if (choice) {
    choice.textContent = `Selected: ${choice.dataset.choice}`;
    choice.classList.add("selected");
    return;
  }
  render();
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

$("#clearSearch").addEventListener("click", () => {
  state.query = "";
  $("#searchInput").value = "";
  render();
});

$("#nextBite").addEventListener("click", () => {
  const work = currentWork();
  if (state.biteIndex < work.bites.length - 1) {
    state.biteIndex += 1;
  } else {
    state.workIndex = (state.workIndex + 1) % works.length;
    state.biteIndex = 0;
  }
  state.completed += 1;
  localStorage.setItem("storybroCompleted", state.completed);
  render();
});

$("#prevBite").addEventListener("click", () => {
  state.biteIndex = Math.max(0, state.biteIndex - 1);
  render();
});

$("#playAudio").addEventListener("click", (event) => {
  event.currentTarget.textContent = event.currentTarget.textContent.startsWith("Play") ? "Pause sample" : "Play 43s sample";
});

render();
