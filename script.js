// GHT Study Tool by Nathan P. Wiebe. Javascript content. Granted to the Public Domain.

const debugMode = true;
const debugModeExtra = false;

const greekToUnicode = {
  a: 'α', b: 'β', g: 'γ', d: 'δ',
  e: 'ε', z: 'ζ', h: 'η', u: 'θ',
  i: 'ι', k: 'κ', l: 'λ', m: 'μ',
  n: 'ν', j: 'ξ', o: 'ο', p: 'π',
  r: 'ρ', s: 'σ', w: 'ς', t: 'τ',
  y: 'υ', f: 'φ', x: 'χ', c: 'ψ',
  v: 'ω'
};

const greekToTranslit = {
  a: 'a', b: 'b', g: 'g', d: 'd',
  e: 'e', z: 'z', h: 'ā', u: 'th',
  i: 'i', k: 'k', l: 'l', m: 'm',
  n: 'n', j: 'x', o: 'o', p: 'p',
  r: 'r', s: 's', w: 's', t: 't',
  y: 'u', f: 'ph', x: 'ch', c: 'ps',
  v: 'ō'
};

const posMap = {
  '_': 'unknown',
  'N': 'noun',
  'V': 'verb',
  'Adj': 'adjective',
  'Adv': 'adverb',
  'Prep': 'preposition',
  'Art': 'article',
  'Conj': 'conjunction',
  'Pron': 'pronoun',
  'Prtcl': 'participle',
  'Inj': 'interjection',
  'DPro': 'demonstrative pronoun',
  'IPro': 'interrogative/indefinite pronoun',
  'PerPro': 'personal pronoun', 
  'PosPro': 'possessive pronoun', 
  'RecPro': 'reciprocal pronoun', 
  'RelPro': 'relative pronoun', 
  'RefPro': 'reflexive pronoun', 
  'Heb': 'Hebrew word',
  'Aram': 'Aramaic word',
  '#': 'numeral'
};

const greekToLatin = {
  'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd',
  'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': 'u',
  'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm',
  'ν': 'n', 'ξ': 'j', 'ο': 'o', 'π': 'p',
  'ρ': 'r', 'σ': 's', 'ς': 'w', 'τ': 't',
  'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'c',
  'ω': 'v'
};
// Create reverse mapping
const latinToGreek = {};
for (const [grk, lat] of Object.entries(greekToLatin)) {
  latinToGreek[lat] = grk;
}

const bookNames = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew",
  "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter",
  "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const bookAbb = [
  "Gen", "Ex", "Lev", "Num", "Deut",
  "Josh", "Judg", "Ruth", "1Sam", "2Sam",
  "1Ki", "2Ki", "1Chr", "2Chr", "Ezra",
  "Neh", "Esth", "Job", "Pslm", "Prvb",
  "Eccl", "Song", "Is", "Jer", "Lam",
  "Ezek", "Dan", "Hos", "Joel", "Amos",
  "Obad", "Jonah", "Micah", "Nahum", "Habak",
  "Zeph", "Hagg", "Zech", "Mal", "Matt",
  "Mark", "Luke", "John", "Acts", "Rom",
  "1Cor", "2Cor", "Gal", "Eph", "Phil",
  "Col", "1Thes", "2Thes", "1Tim", "2Tim",
  "Tit", "Phm", "Heb", "James", "1Pet",
  "2Pet", "1John", "2John", "3John", "Jude", "Rev"
];

function toGreek(str) {
  if (!str || str.trim() === "") return "&nbsp;";
  return str.replace(/[a-z]/g, c => greekToUnicode[c] || c);
}

function toInterlin(str) {
  if (!str || str.trim() === "") return "&nbsp;";
  return str.replace(/[a-z]/g, c => greekToTranslit[c] || c);
}

function toLatin(str) {
  return str.toLowerCase().split('').map(ch => greekToLatin[ch] || ch).join('');
}

// Options popups.
function togglePopup(id) {
  if (debugMode) console.log("togglePopup()")
  // Close any other popups
  document.querySelectorAll('.popup').forEach(p => {
    if (p.id !== id) p.style.display = 'none';
  });

  const popup = document.getElementById(id);
  const isVisible = window.getComputedStyle(popup).display !== 'none';
  if (isVisible) {
    popup.style.display = 'none';
    return;
  }

  // Show popup first (block or grid)
  const displayType = popup.classList.contains('ref-popup') ? 'grid' : 'block';
  popup.style.display = displayType;

  // Force layout
  popup.getBoundingClientRect();

  // Get button
  const button = document.querySelector(`[data-toggle-popup][onclick*="'${id}'"]`);
  if (button) {
    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Position below button initially
    let top = rect.bottom + window.scrollY;

    // Adjust max height so popup doesn't overflow viewport
    let maxHeight = viewportHeight - rect.bottom - 18; // 10px margin
    maxHeight = Math.max(maxHeight, 120); // Give it at least some height.
    popup.style.maxHeight = `${maxHeight}px`;

    popup.style.top = `${top}px`;

    // Horizontal positioning
    let left = rect.left + window.scrollX;
    const popupWidth = popup.offsetWidth || 280;
    const viewportWidth = document.documentElement.clientWidth;
    if (left + popupWidth > viewportWidth) {
      left = viewportWidth - popupWidth - 10; // 10px margin
    }
    popup.style.left = `${left}px`;
  }
}


function toggleHelpPopup(pop, but) {
  if (debugMode) console.log("toggleHelpPopup()")
  const popup = document.getElementById(pop);
  const button = document.getElementById(but);

  if (popup.style.display === 'block') {
    popup.style.display = 'none';
    return;
  }

  // Close other popups
  document.querySelectorAll('.popup').forEach(p => {
    if (p !== popup) p.style.display = 'none';
  });

  const rect = button.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Space available below the button
  const availableHeight = viewportHeight - (rect.bottom + 8);

  Object.assign(popup.style, {
    display: 'block',
    position: 'fixed',
    left: '20px',
    right: '20px',
    width: 'auto',
    maxWidth: 'none',
    boxSizing: 'border-box',
    top: `${rect.bottom + 8}px`,
    maxHeight: `${availableHeight - 20}px`, // leave bottom margin
    overflowY: 'auto'
  });
}

async function getLastModified(url) {
  if (debugMode) console.log("getLastModified()")
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const lastMod = res.headers.get("last-modified");
    return lastMod ? new Date(lastMod) : null;
  } catch (e) {
    console.warn("Failed to fetch", url, e);
    return null;
  }
}

async function updateToolLastUpdated() {
  if (debugMode) console.log("updateToolLastUpdated()")
  const el = document.getElementById("tool_last_updated");

  let lastModifiedUTC = el?.dataset.compileLastmod || null;

  if (!lastModifiedUTC) {
    // fallback: fetch last-modified headers
    const files = ["ght-i.html", "styles.css", "script.js"];
    const dates = await Promise.all(files.map(f => getLastModified(f)));
    const latest = dates.filter(d => d).sort((a, b) => b - a)[0];
    lastModifiedUTC = latest ? latest.toUTCString() : null;
  }

  if (lastModifiedUTC) {
    const date = new Date(lastModifiedUTC);
    const formatted = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
    el.textContent = `${formatted} ${time}`;
  } else {
    el.textContent = "unknown";
  }
}

// Run it
updateToolLastUpdated();
let compData;
// DO NOT TOUCH THE NEXT TWO LINES They are removed by the compile script.
let baseData;
let lookupdb;
// Main initialization function
function loadBaseJson() {
  if (debugMode) console.log("loadBaseJson()")
  if (debugMode) document.getElementById("alpha").style.display = "block"; // Show alpha warning if in debug mode.
  const params = new URLSearchParams(window.location.search);
  const dbName = params.get("db") === "basex" ? "basex.json" : "base.json";
  const lookupsName = params.get("db") === "basex" ? "lookupsex.json" : "lookups.json";

  // If already available (compiled build), skip fetch
  if (typeof baseData !== "undefined" && typeof lookupdb !== "undefined" && dbName !== "basex.json") {
    // Prefer compile-time injected UTC timestamp
    const el = document.getElementById("data_last_updated");
    const precompiled = el?.dataset.compileLastmod || null;

    if (precompiled) {
      const date = new Date(precompiled);
      const formatted = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      el.textContent = `${formatted} ${time}`;
    }

    initializeSelections();
    initPickers();
    setupEventListeners();
    setFontSize();
    setMode("init");
    if (currentRender === "search") {
      searchVerses();
    } else {
      render();
    }
    // getCount is depreciated now that the NT is complete. If we do the OT, we will re-enable it.
    // getCount();
    return;
  }

  const baseUrl = dbName + '?t=' + Date.now();
  const lookupUrl = lookupsName + '?t=' + Date.now();

  Promise.all([
    fetch(baseUrl).then(res => {
      if (!res.ok) throw new Error('Failed to fetch base.json');
      const lastModified = res.headers.get('Last-Modified');
      if (lastModified) {
        const date = new Date(lastModified);
        const formatted = date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const time = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        document.getElementById("data_last_updated").textContent = `${formatted} ${time}`;
      }
      return res.json();
    }),
    fetch(lookupUrl).then(res => {
      if (!res.ok) throw new Error('Failed to fetch lookups.json');
      return res.json();
    })
  ])
  .then(([baseJson, lookupsJson]) => {
    baseData = baseJson;
    lookupdb = lookupsJson; // or whatever variable you're using for the lookup table
    initializeSelections();
    autoGapInputWidth(elements.gapInput);
    initPickers();
    setupEventListeners();
    setFontSize();
    setMode("init");
    if (currentRender === "search") {
      searchVerses();
    } else {
      render();
    }
    // getCount is depreciated now that the NT is complete. If we do the OT, we will re-enable it.
    // getCount();
  })
  .catch(err => {
    console.error("Error loading JSON files:", err);
  });
}

function getCount() {
  if (debugMode) console.log("getCount()")
  // Used to determine progress of translation. Maintain this code in case we do OT later.
  let countWithIdent = 0;

  for (let b = 39; b <= 65; b++) {
    if (!baseData[b]) continue; // skip if book missing
    const book = baseData[b];
    for (let c = 0; c < book.length; c++) {
      const chapter = book[c];
      for (let v = 0; v < chapter.length; v++) {
        const verse = chapter[v];
        for (let w = 0; w < verse.length; w++) {
          const word = verse[w];
          if (word[1][0] !== '[') countWithIdent++;
        }
      }
    }
  }

  const totalWords = 140146;
  const percentage = (countWithIdent / totalWords) * 100;

  //document.getElementById("count").textContent = countWithIdent;
  document.getElementById("percentage").textContent = percentage.toFixed(2) + "%";
}

const elements = {};
document.querySelectorAll("[data-id]").forEach(el => {
  elements[el.id] = el;
});
let lastChanged = null; // Track which selection was last changed (start or end) to use when auto-adjusting selections
const onOptionsChange = () => {
  saveSettings();
  if (currentRender === "search") {
    // We are showing search results, so re-run search to apply filters
    searchVerses();
  } else {
    // Default render mode
    render();
  }
};

let restoring = false;
const historyStacks = [];   // array of stacks, one per panel
const historyIndexes = [];  // array of indexes, one per panel

function initHistoryForPanels(count) {
  for (let i = 0; i < count; i++) {
    if (!historyStacks[i]) historyStacks[i] = [];
    if (historyIndexes[i] === undefined) historyIndexes[i] = -1;
  }
}

function statesEqual(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

let lastEmpty = [false, false, false]; // If we are on a failed search, use a temporary state that will be dumped or overwritten.

function saveState(empty = false) {
  if (debugMode) console.log("saveState()")
  if (restoring) return;

  const activePanel = document.getElementById("output");
  if (!activePanel) return;

  let panelID = Number(activePanel.dataset.panelID);

  if (select.value !== "none" && panelID === 1) panelID = 2; // Use third stack for alternate translation panel.

  const stack = historyStacks[panelID] !== undefined && historyStacks[panelID] !== null
    ? historyStacks[panelID]
    : (historyStacks[panelID] = []);

  let index = historyIndexes[panelID] !== undefined && historyIndexes[panelID] !== null
    ? historyIndexes[panelID]
    : (historyIndexes[panelID] = -1);

  let override = false;
  if (panelID !== 0 && elements.linkPanels.checked && stack[index]) { // When link panels is active, only update history stack on second panel if search.
    if (stack[index]['currentRender'] !== "search") { // Nested if-statement needed due to the initial load of 3rd panel having no valid [index]['currentRender'] value, but that will never be a search since a translation load is always reference-call. If this were in the first if-statement, it would cause an error on alternate translation load.
      override = true;
    }
  }

  const state = {};
  Object.keys(elements).forEach(id => {
    const el = elements[id];
    if (!el) return;
    if (el.hasAttribute("global-setting")) return;

    if (el.type === "checkbox") state[id] = el.checked;
    else state[id] = el.value;
  });

  state['centerScroll'] = centerFromSearch;
  state['currentRender'] = currentRender;

  // Do not save if identical to current
  if (index >= 0 && statesEqual(stack[index], state)) {
    return;
  }

  // Remove “future” states if not at the end
  if (index < stack.length - 1) {
    stack.splice(index + 1);
  }

  if (!lastEmpty[panelID] && !override) {
    // Push new state
    stack.push(state);
    index++;
  } else {
    stack[index] = state;
  }

  // Limit to 100
  if (stack.length > 100) {
    stack.shift();
    index--;
  }

  historyIndexes[panelID] = index;

  if (empty) {
    lastEmpty[panelID] = true;
  } else {
    lastEmpty[panelID] = false;
  }

  updateHistoryButtons(panelID)
}

function getSizeBytes(obj) {
  return new TextEncoder().encode(JSON.stringify(obj)).length;
}

// Example
// console.log("historyStack size (bytes):", getSizeBytes(historyStack));

function loadState(panelID, increment, fromChangeTranslation = false) {
  if (debugMode) console.log("loadState()")
  const stackID = panelID === 1 && select.value !== "none" ? 2 : panelID;
  let index = historyIndexes[stackID] + increment;
  const stack = historyStacks[stackID];
  if (!stack) return;
  if (index < 0 || index >= stack.length) return;

  const activePanel = document.getElementById("output");
  const originalPanel = activePanel;

  const targetPanel = outputContainer.querySelector(`[data-panel-i-d="${panelID}"]`);
  if (!targetPanel) return;

  restoring = true;

  if (targetPanel !== originalPanel) {
    activate(targetPanel);
  }
  let state = stack[index];

  if (panelID !== 0 && elements.linkPanels.checked && state) { // When link panels is active, do not load any reference histories.
    while (state['currentRender'] === "reference" && index > 0 && increment !== 0 && index < stack.length - 1) {
      index += increment;
      state = stack[index];
    }
    if ((index === 0 || increment === 0 || index === stack.length - 1) && state['currentRender'] === "reference" && !fromChangeTranslation) {
      if (increment !== 0) showToast("No more search histories to load in this direction.\n Use left navigation buttons to navigate reference histories when panels are linked.", 3000);
      restoring = false;
      historyIndexes[stackID] = index;
      if (originalPanel && targetPanel !== originalPanel) {
        activate(originalPanel);
      }
      return;
    }
  }

  Object.keys(state).forEach(id => {
    const el = elements[id];
    if (!el) return;

    if (el.type === "checkbox") el.checked = state[id];
    else {
      if (panelID !== 0 && elements.linkPanels.checked) {
        if (id === "bookStart" || id === "chapterStart" || id === "verseStart" || id === "bookEnd" || id === "chapterEnd" || id === "verseEnd" || id === "gapInput") {
          // skip loading reference histories into non-reference panel when panels are linked.
          return;
        }
      }
      if (el.id === "chapterStart") populateChapters(state.bookStart, el);
      if (el.id === "chapterEnd") populateChapters(state.bookEnd, el);
      if (el.id === "verseStart") populateVerses(state.bookStart, state.chapterStart, el);
      if (el.id === "verseEnd") populateVerses(state.bookEnd, state.chapterEnd, el);
      el.value = state[id];
    }
  });

  centerFromSearch = state['centerScroll'];
  currentRender = state['currentRender']

  historyIndexes[stackID] = index;

  // Trigger appropriate re-run
  updateDisplay();
  saveSettings();
  if (currentRender === "search") searchVerses();
  else render();
  if (originalPanel && targetPanel !== originalPanel) {
    activate(originalPanel);
  }

  restoring = false;
}

document.getElementById("swapPanelsBtn").addEventListener("click", () => {
  swapPanelsHistory(0, 1);
});

function activateAllPanelsAndRefresh() {
  if (debugMode) console.log("activateAllPanelsAndRefresh()")
  const current = document.getElementById("output");
  const originalPanelID = current?.dataset.panelID;

  restoring = true;

  let panels = outputContainer.querySelectorAll("[data-panel-i-d]");
  panels.forEach(panel => {
    if (select.value !== "none" && panel.dataset.panelID === "1") return; // skip alternate translation panel if active
    activate(panel, false);
    onOptionsChange();
  });

  restoring = false;

  if (originalPanelID !== undefined) {
    const panel = outputContainer.querySelector(
      `[data-panel-i-d="${originalPanelID}"]`
    );
    if (panel) activate(panel);
  }
}

function swapPanelsHistory(a = 0, b = 1) {
  if (debugMode) console.log("swapPanelsHistory()")
  if (!historyStacks[0] || !historyStacks[1]) return;
  // swap history stacks
  [historyStacks[a], historyStacks[b]] =
    [historyStacks[b], historyStacks[a]];

  // swap history indexes
  [historyIndexes[a], historyIndexes[b]] =
    [historyIndexes[b], historyIndexes[a]];

  // Swap panel settings
  const settings = loadAllSettings();

  [settings.panels[0], settings.panels[1]] =
    [settings.panels[1], settings.panels[0]];

  saveAllSettings(settings);

  // Update history buttons for both panels
  updateHistoryButtons(a);
  if (select.value === "none") {
    updateHistoryButtons(b);
  }

  activateAllPanelsAndRefresh();
}

document.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

  if (!ctrlOrCmd) return;

  const key = e.key.toLowerCase(); // normalize

  // Undo: Ctrl+Z / Cmd+Z
  if (key === "z" && !e.shiftKey) {
    e.preventDefault();
    historyBack(getActivePanelId());
  }

  // Redo: Ctrl+Shift+Z / Cmd+Shift+Z
  if (key === "z" && e.shiftKey) {
    e.preventDefault();
    historyForward(getActivePanelId());
  }
});

function updateHistoryButtons(panelID) {
  if (debugMode) console.log("updateHistoryButtons()")
  buttonID = panelID === 0 ? 0 : 1;
  panelID = panelID === 1 && select.value !== "none" ? 2 : panelID;
  const index = historyIndexes[panelID];
  const stack = historyStacks[panelID];

  const backBtn = document.querySelector(`[data-history-back="${buttonID}"]`);
  const fwdBtn  = document.querySelector(`[data-history-forward="${buttonID}"]`);

  if (!backBtn || !fwdBtn) return;

  backBtn.classList.toggle("inactive", index <= 0);
  fwdBtn.classList.toggle("inactive", index >= stack.length - 1);
}

function historyBack(panelID) {
  if (debugMode) console.log("historyBack()")
  loadState(panelID, -1);
  updateHistoryButtons(panelID);
}

function historyForward(panelID) {
  if (debugMode) console.log("historyForward()")
  loadState(panelID, 1);
  updateHistoryButtons(panelID);
}

function handleGreekInput(e) {
  if (debugModeExtra) console.log("handleGreekInput()") // Upon every key press.
  const input = e.target;
  const originalValue = input.value;

  const normalized = originalValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized !== originalValue) {
    const pos = input.selectionStart;
    input.value = normalized;
    input.setSelectionRange(pos, pos);
  }
  saveSettings('save-id');
}

function handleGreekBeforeInput(e, convertToGreekCheckbox) {
  if (debugModeExtra) console.log("handleGreekInput()") // Upon every key press.
  if (!convertToGreekCheckbox.checked) return;
  if (e.inputType !== "insertText") return;
  if (!e.data) return;

  e.preventDefault();

  const input = e.target;
  const start = input.selectionStart;
  const end = input.selectionEnd;

  const cleanChar = e.data
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const greekChar = latinToGreek[cleanChar] || cleanChar;

  input.setRangeText(greekChar, start, end, "end");
}

function blockSpacesBeforeInput(e) {
  // Block typing a space
  if (e.inputType === "insertText" && e.data === " ") {
    e.preventDefault();
    return;
  }

  // Block pasted spaces
  if (e.inputType === "insertFromPaste" && e.data?.includes(" ")) {
    e.preventDefault();

    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const noSpaces = e.data.replace(/\s+/g, "");
    input.setRangeText(noSpaces, start, end, "end");
  }
}

// Called only after baseData is loaded
function setupEventListeners() {
  if (debugMode) console.log("setupEventListeners()");
  // Helper for start/end selectors
  const rangeSelectors = [
    { book: "bookStart", chapter: "chapterStart", verse: "verseStart", type: "start" },
    { book: "bookEnd", chapter: "chapterEnd", verse: "verseEnd", type: "end" }
  ];

  rangeSelectors.forEach(({ book, chapter, verse, type }) => {
    elements[book].addEventListener("change", (e) => {
      lastChanged = type;
      const b = +elements[book].value;
      populateChapters(b, elements[chapter]);
      elements[chapter].value = 0;
      populateVerses(b, 0, elements[verse]);
      elements[verse].value = 0;
      adjustSelections();
      // Removed render() call. Handled by new fancy ref picker.
    });

    elements[chapter].addEventListener("change", (e) => {
      lastChanged = type;
      const b = +elements[book].value;
      const c = +elements[chapter].value;
      populateVerses(b, c, elements[verse]);
      elements[verse].value = 0;
      adjustSelections();
      // Removed render() call. Handled by new fancy ref picker.
    });

    elements[verse].addEventListener("change", (e) => {
      lastChanged = type;
      adjustSelections();
      // Removed render() call. Handled by new fancy ref picker.
    });
  });

  // Gap input listener
  elements.gapInput.addEventListener("input", () => {
    let verseRange = parseInt(elements.gapInput.value, 10);
    if (isNaN(verseRange) || verseRange < 1) elements.gapInput.value = 1;
    if (currentRender === "search") searchVerses();
    else if (elements.enforceGap.checked) {
      lastChanged = "start";
      adjustSelections();
      render();
    }
  });

  elements.enforceGap.addEventListener("change", () => {
    elements.gapInput.disabled = !elements.enforceGap.checked;
    lastChanged = "start";
    adjustSelections();
  });

  // For checkboxes that trigger onOptionsChange
  [
    "showGreek", "showEnglish", "showPcode", "showVerses",
    "showStrongs", "showRoots", "newlineAfterVerse", "reverseInterlinear", "highlightSearch", "searchSize", "customFormat", "altSearch", "uncialGreek"
  ].forEach(id => {
    elements[id].addEventListener("change", onOptionsChange);
  });

  // For checkboxes or inputs that trigger searchVerses
  [
    "centerRange", "exactMatch", "ordered", "adjacent", "normalized","expandMorph"
  ].forEach(id => {
    const el = elements[id];
    el.addEventListener("change", searchChange);
  });

  // For mutually exclusive showContext and uniqueWords
  ["showContext", "uniqueWords"].forEach(id => {
    const el = elements[id];
    el.addEventListener("change", (e) => {
      const otherId = id === "showContext" ? "uniqueWords" : "showContext";
      const otherEl = elements[otherId];

      // If this element is checked, uncheck the other
      if (el.checked) {
        otherEl.checked = false;
      }

      // Call your existing search change handler
      searchChange(e);
    });
  });

  // Button (not in elements)
  document.getElementById("searchBtn")
    .addEventListener("click", searchChange);

  elements.searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      searchVerses();
    }
  });

  const fontSizeSlider = document.getElementById('fontSize');
  const fontSize2Slider = document.getElementById('fontSize2');
  const englishSecondary = document.getElementById('englishSecondary');
  const greekSecondary = document.getElementById('greekSecondary');
  // Live updates
  fontSizeSlider.addEventListener('input', setFontSize);
  fontSize2Slider.addEventListener('input', setFontSize);
  englishSecondary.addEventListener('change', () => {
    if (englishSecondary.checked) {
      greekSecondary.checked = false;
    }
    setFontSize();
  });

  greekSecondary.addEventListener('change', () => {
    if (greekSecondary.checked) {
      englishSecondary.checked = false;
    }
    setFontSize();
  });

  elements.searchInput.addEventListener("beforeinput", (e) =>
    handleGreekBeforeInput(e, elements.convertToGreek)
  );

  elements.searchInput.addEventListener("input", handleGreekInput);

  window.addEventListener('click', function(e) {
    const isMenuPopup = e.target.closest('.menu-popup, .ref-popup');
    const isMenuToggleButton = e.target.matches('button[data-toggle-popup]');

    if (!isMenuPopup && !isMenuToggleButton) {
      document.querySelectorAll('.menu-popup, .ref-popup').forEach((p) => {
        p.style.display = 'none';
      });
    }
  });

  const toggleGreekHelpBtn = document.getElementById('toggleGreekHelp');
  const greekHelpPopup = document.getElementById('greekHelpPopup');
  const greekHelpImage = greekHelpPopup.querySelector('img');

  // Toggle popup when ? button is clicked
  toggleGreekHelpBtn.addEventListener('click', () => {
    greekHelpPopup.hidden = !greekHelpPopup.hidden;
  });

  // Close popup when image is clicked
  greekHelpImage.addEventListener('click', () => {
    greekHelpPopup.hidden = true;
  });

  document.getElementById("historyBackBtnRight").addEventListener("click", () => historyBack(1));
  document.getElementById("historyForwardBtnRight").addEventListener("click", () => historyForward(1));
  document.getElementById("historyBackBtnLeft").addEventListener("click", () => historyBack(0));
  document.getElementById("historyForwardBtnLeft").addEventListener("click", () => historyForward(0));
}

// Fancy Reference Selector Box code.

function makeHeaderSpacerFromColumn(col, text) {
  if (debugMode) console.log("makeHeaderSpacerFromColumn()");
  const spacer = document.createElement("div");
  spacer.className = "ref-header-spacer";
  spacer.textContent = text;
  spacer.style.pointerEvents = "none";
  spacer.style.fontWeight = "bold";

  // Copy the actual rendered width of the column
  spacer.style.width = Math.floor(chapColWidth) + "px";
  
  return spacer;
}

let useAbbrev = true; // controlled externally
function getBookLabel(i) {
  if (debugModeExtra) console.log("getBookLabel()"); // Excessive calls
  return useAbbrev ? bookAbb[i] : bookNames[i];
}

function selectBook(prefix, i) {
  if (debugMode) console.log("selectBook()");
  const bookSel = document.getElementById("book" + prefix);
  if (!bookSel) return;

  bookSel.value = i;
  elements["book" + prefix].dispatchEvent(new Event("change", { bubbles: true }));
  buildChapters(prefix, i);
  selectChapter(prefix, 0);
}

function selectChapter(prefix, i) {
  if (debugMode) console.log("selectChapter()");
  const chapSel = document.getElementById("chapter" + prefix);
  if (!chapSel) return;

  chapSel.value = i;
  const book = document.getElementById("book" + prefix)?.value;
  elements["chapter" + prefix].dispatchEvent(new Event("change", { bubbles: true }));
  buildVerses(prefix, book, i);
  selectVerse(prefix, 0, false);
}

function selectVerse(prefix, i, close = true) {
  if (debugMode) console.log("selectVerse()");
  const verseSel = document.getElementById("verse" + prefix);
  if (!verseSel) return;

  verseSel.value = i;
  elements["verse" + prefix].dispatchEvent(new Event("change", { bubbles: true }));
  if (close) {
    togglePopup("ref" + prefix + "Popup");
  }
  render();
}

function buildBookList(prefix) {
  if (debugMode) console.log("buildBookList()");
  const bookCol = document.getElementById(prefix + "Books");
  bookCol.innerHTML = "";
  bookNames.forEach((_, i) => {
    if (!baseData[i]?.length) return;
    const d = document.createElement("div");
    d.textContent = getBookLabel(i);
    d.onclick = () => selectBook(prefix, i);
    bookCol.appendChild(d);
  });
}

function buildChapters(prefix, bookIndex) {
  if (debugMode) console.log("buildChapters()");
  const col = document.getElementById(prefix + "Chapters");
  if (!col) return;

  col.innerHTML = "";
  col.scrollTop = 0;

  const bookLabel = getBookLabel(bookIndex);
  col.appendChild(makeHeaderSpacerFromColumn(col, bookLabel));

  const chapters = baseData[bookIndex] || [];
  chapters.forEach((_, i) => {
    const d = document.createElement("div");
    d.textContent = i + 1;
    d.onclick = (event) => {
      event.stopPropagation(); // Prevent the click from reaching the window handler
      selectChapter(prefix, i);
    };
    col.appendChild(d);
  });
}

function buildVerses(prefix, bookIndex, chapIndex) {
  if (debugMode) console.log("buildVerses()");
  const col = document.getElementById(prefix + "Verses");
  if (!col) return;

  col.innerHTML = "";
  col.scrollTop = 0;

  const headerText = `${getBookLabel(bookIndex)} ${parseInt(chapIndex) + 1}`;
  col.appendChild(makeHeaderSpacerFromColumn(col, headerText));

  const verses = baseData[bookIndex]?.[chapIndex] || [];
  verses.forEach((_, i) => {
    const d = document.createElement("div");
    d.textContent = i + 1;
    d.onclick = (event) => {
      event.stopPropagation();
      selectVerse(prefix, i);
    };
    col.appendChild(d);
  });
}

function updateDisplay() {
  if (debugMode) console.log("updateDisplay()");
  ["Start", "End"].forEach(prefix => {
    const b = document.getElementById("book" + prefix).value;
    const c = document.getElementById("chapter" + prefix).value;
    const v = document.getElementById("verse" + prefix).value;
    document.querySelector(`#${prefix.toLowerCase()}Picker .ref-display`)
      .textContent = `${getBookLabel(b)} ${+c + 1}:${+v + 1}`;
    buildChapters(prefix, b);
    buildVerses(prefix, b, c);
  });
}

let chapColWidth = 0;

function initPickers() {
  if (debugMode) console.log("initPickers()");
  ["Start", "End"].forEach(prefix => {
    buildBookList(prefix);
  });

  ["refStartPopup", "refEndPopup"].forEach(id => {
    const popup = document.getElementById(id);
    if (!popup) return;

    // Temporarily show offscreen for layout
    popup.style.visibility = "hidden";
    popup.style.display = "grid";
    popup.style.position = "absolute";
    popup.style.left = "-9999px";
    popup.style.top = "-9999px";

    popup.getBoundingClientRect();

    // Measure text widths
    const temp = document.createElement("span");
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.font = getComputedStyle(popup).font;
    document.body.appendChild(temp);

    let maxBookWidth = 0;
    bookAbb.forEach(b => {
      temp.textContent = b;
      maxBookWidth = Math.max(maxBookWidth, temp.offsetWidth + 16);
    });

    temp.textContent = "175";
    let chapWidth = temp.offsetWidth + 16;

    // Update CSS variables dynamically
    document.documentElement.style.setProperty('--book-width', `${maxBookWidth-16}px`);
    document.documentElement.style.setProperty('--number-width', `${chapWidth-16}px`);


    document.body.removeChild(temp);

    // Initial preferred items per row
    let booksPerRow = 3;
    let chapPerRow = 4;

    // Calculate initial column widths
    let bookColWidth = maxBookWidth * booksPerRow;
    chapColWidth = chapWidth * chapPerRow;

    // Gap between columns
    const colGap = 0; // px between columns
    let totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;

    const viewportWidth = window.innerWidth;

    // Reduce items per row if total width exceeds viewport
    if (totalWidth > viewportWidth) chapPerRow = 3, chapColWidth = chapWidth * chapPerRow, totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;
    if (totalWidth > viewportWidth) booksPerRow = 2, bookColWidth = maxBookWidth * booksPerRow, totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;
    if (totalWidth > viewportWidth) chapPerRow = 2, chapColWidth = chapWidth * chapPerRow, totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;
    if (totalWidth > viewportWidth) booksPerRow = 1, bookColWidth = maxBookWidth * booksPerRow, totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;
    if (totalWidth > viewportWidth) chapPerRow = 1, chapColWidth = chapWidth * chapPerRow, totalWidth = bookColWidth + chapColWidth * 2 + colGap * 2;

    // Apply column widths
    ["Start", "End"].forEach(prefix => {
      const bookCol = document.getElementById(prefix + "Books");
      const chapCol = document.getElementById(prefix + "Chapters");
      const verseCol = document.getElementById(prefix + "Verses");

      if (bookCol) bookCol.style.width = bookColWidth + "px";
      if (chapCol) chapCol.style.width = chapColWidth + "px";
      if (verseCol) verseCol.style.width = chapColWidth + "px";
    });
    
    // Set popup width to fit all columns (or max screen width)
    popup.style.width = Math.min(totalWidth, viewportWidth) + "px";

    const desiredHeight = Math.min(271, window.innerHeight - 100);
    popup.style.height = desiredHeight + "px";

    // Hide again
    popup.style.display = "none";
    popup.style.visibility = "";
    popup.style.left = "";
    popup.style.top = "";
  });

  updateDisplay();
}

window.addEventListener('resize', () => {
  initPickers();
});

function applyRefColumnWidths(prefixes = ["Start", "End"]) {
  if (debugMode) console.log("applyRefColumnWidths()");
  // Measure text widths
  const temp = document.createElement("span");
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.font = getComputedStyle(document.body).font;
  document.body.appendChild(temp);

  // Books
  let maxBookWidth = 0;
  bookAbb.forEach(b => {
    temp.textContent = b;
    maxBookWidth = Math.max(maxBookWidth, temp.offsetWidth + 12); // add padding
  });

  // Chapters / Verses (up to 3 digits)
  temp.textContent = "175";
  let chapWidth = temp.offsetWidth + 12;

  document.body.removeChild(temp);

  prefixes.forEach(prefix => {
    const bookCol = document.getElementById(prefix + "Books");
    const chapCol = document.getElementById(prefix + "Chapters");
    const verseCol = document.getElementById(prefix + "Verses");

    if (bookCol) bookCol.style.width = maxBookWidth + "px";
    if (chapCol) chapCol.style.width = chapWidth + "px";
    if (verseCol) verseCol.style.width = chapWidth + "px";
  });
}

// Dropdown setup
function populateBookDropdowns() {
  if (debugMode) console.log("populateBookDropdowns()");
  elements.bookStart.innerHTML = "";
  elements.bookEnd.innerHTML = "";
  bookNames.forEach((name, i) => {
    if (!baseData[i] || baseData[i].length === 0) return; // Skip books with no chapters
    elements.bookStart.add(new Option(name, i));
    elements.bookEnd.add(new Option(name, i));
  });
}
function populateChapters(bookIndex, chapterSelect) {
  if (debugMode) console.log("populateChapters()");
  chapterSelect.innerHTML = "";
  const numChapters = baseData[bookIndex]?.length || 0;
  for (let i = 0; i < numChapters; i++) {
    chapterSelect.add(new Option(i + 1, i));
  }
}
function populateVerses(bookIndex, chapterIndex, verseSelect) {
  if (debugMode) console.log("populateVerses()");
  verseSelect.innerHTML = "";
  const numVerses = baseData[bookIndex]?.[chapterIndex]?.length || 0;
  for (let i = 0; i < numVerses; i++) {
    verseSelect.add(new Option(i + 1, i));
  }
}
// Populate book filter dropdown
function populateBookFilter() {
  if (debugMode) console.log("populateBookFilter()");
  const bookFilter = document.getElementById("bookFilter");
  if (!bookFilter) return;
  
  // Keep "All Books" option, add individual books
  bookNames.forEach((name, i) => {
    if (!baseData[i] || baseData[i].length === 0) return;
    const option = document.createElement("option");
    option.value = i;
    option.textContent = name;
    bookFilter.appendChild(option);
  });
}

function selectAllBooks() {
  if (debugMode) console.log("selectAllBooks()");
  const bookFilter = document.getElementById("bookFilter");
  Array.from(bookFilter.options).forEach(opt => {
    if (opt.value === "all") opt.selected = true;
    else opt.selected = false;
  });
  saveSettings('save-id');
}

function selectGospels() {
  if (debugMode) console.log("selectGospels()");
  const bookFilter = document.getElementById("bookFilter");
  const gospelIndices = [39, 40, 41, 42];
  
  Array.from(bookFilter.options).forEach(opt => {
    if (opt.value === "all") opt.selected = false;
    else opt.selected = gospelIndices.includes(parseInt(opt.value));
  });
  saveSettings('save-id');
}

function selectPaul() {
  if (debugMode) console.log("selectPaul()");
  const bookFilter = document.getElementById("bookFilter");
  const paulIndices = [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56];
  
  Array.from(bookFilter.options).forEach(opt => {
    if (opt.value === "all") opt.selected = false;
    else opt.selected = paulIndices.includes(parseInt(opt.value));
  });
  saveSettings('save-id');
}

function initializeSelections() {
  if (debugMode) console.log("initializeSelections()");
  populateBookDropdowns();

  const range = getUrlRange();

  const allSettings = loadAllSettings();
  const settings = allSettings.panels[0] || {};

  if (settings) {
    loadSettings();
  }

  if (range?.gapInput > 0) {
    elements.gapInput.value = range.gapInput;
  } else if (settings?.gapInput > 0) {
    elements.gapInput.value = settings.gapInput;
  } else {
    elements.gapInput.value = Math.floor(Math.random() * (20 - 2 + 1)) + 2; // random 2–20
  }

  // Initialize display variables after loading settings
  updatePadding(slider.value);
  updateBorder(borderToggle.checked);
  updateFont(fontToggle.checked);

  // --- Pick START reference ---
  let startBook, startChapter, startVerse;

  if (range?.bookStart != null) {
    startBook = range.bookStart - 1;
  } else if (settings?.bookStart != null) {
    startBook = settings.bookStart;
  } else {
    // Random from available books
    const bookOptions = [...elements.bookStart.options].map(opt => parseInt(opt.value));
    startBook = bookOptions[Math.floor(Math.random() * bookOptions.length)];
  }
  elements.bookStart.value = startBook;

  populateChapters(startBook, elements.chapterStart);

  if (range?.chapterStart != null) {
    startChapter = range.chapterStart - 1;
  } else if (settings?.chapterStart != null) {
    startChapter = settings.chapterStart;
  } else {
    const chapterOptions = [...elements.chapterStart.options].map(opt => parseInt(opt.value));
    startChapter = chapterOptions[Math.floor(Math.random() * chapterOptions.length)];
  }
  elements.chapterStart.value = startChapter;

  populateVerses(startBook, startChapter, elements.verseStart);

  if (range?.verseStart != null) {
    startVerse = range.verseStart - 1;
  } else if (settings?.verseStart != null) {
    startVerse = settings.verseStart;
  } else {
    const verseOptions = [...elements.verseStart.options].map(opt => parseInt(opt.value));
    startVerse = verseOptions[Math.floor(Math.random() * verseOptions.length)];
  }
  elements.verseStart.value = startVerse;

  // --- Pick END reference ---
  let endBook, endChapter, endVerse;

  if (range?.bookEnd != null) {
    endBook = range.bookEnd - 1;
  } else if (settings?.bookEnd != null) {
    endBook = settings.bookEnd;
  } else {
    // Use gapInput to calculate from start reference
    endBook = null;
  }
  elements.bookEnd.value = endBook;

  populateChapters(endBook, elements.chapterEnd);

  if (range?.chapterEnd != null) {
    endChapter = range.chapterEnd - 1;
  } else if (settings?.chapterEnd != null) {
    endChapter = settings.chapterEnd;
  } else {
    endChapter = null;
  }
  elements.chapterEnd.value = endChapter;

  populateVerses(endBook, endChapter, elements.verseEnd);

  if (range?.verseEnd != null) {
    endVerse = range.verseEnd - 1;
  } else if (settings?.verseEnd != null) {
    endVerse = settings.verseEnd;
  } else {
    endVerse = null; // temp, will adjust below
  }
  elements.verseEnd.value = endVerse;

  // --- Adjust if no explicit end reference ---
  if (range?.bookEnd == null && settings?.bookEnd == null) {
    lastChanged = "start"; // Default to adjusting start
    adjustSelections();
  }

  // Load search params if present
  applyUrlSearch();
  // Initialize panel ref/search based on saved/random data.
  populateBookFilter();
  //for (let i = 0; i < maxPanels; i++) {
  //  storePanelState(i);
  //}
}

// Helper function to pad numbers for url encoding
function pad (n, len = 3) {
  return (n+1).toString().padStart(len, '0');
}
function getUrlRange() {
  if (debugMode) console.log("getUrlRange()");
  const params = new URLSearchParams(location.search);
  const range = params.get("range");
  if (!range || !/^\d{8}-\d{8}$/.test(range)) return null;

  const [from, to] = range.split("-");
  return {
    bookStart: parseInt(from.slice(0, 2)),
    chapterStart: parseInt(from.slice(2, 5)),
    verseStart: parseInt(from.slice(5, 8)),
    bookEnd: parseInt(to.slice(0, 2)),
    chapterEnd: parseInt(to.slice(2, 5)),
    verseEnd: parseInt(to.slice(5, 8)),
  };
}

function encodeRangeToUrl() {
  if (debugMode) console.log("encodeRangeToUrl()");
  const bookStartVal = parseInt(elements.bookStart.value);
  const chapterStartVal = parseInt(elements.chapterStart.value);
  const verseStartVal = parseInt(elements.verseStart.value);
  const bookEndVal = parseInt(elements.bookEnd.value);
  const chapterEndVal = parseInt(elements.chapterEnd.value);
  const verseEndVal = parseInt(elements.verseEnd.value);

  const from = pad(bookStartVal, 2) + pad(chapterStartVal) + pad(verseStartVal);
  const to = pad(bookEndVal, 2) + pad(chapterEndVal) + pad(verseEndVal);


  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}?range=${from}-${to}`;
  // Copy to clipboard
  navigator.clipboard.writeText(newUrl)
    .then(() => showToast("URL copied to clipboard!"))
    .catch(err => alert("Failed to copy URL: " + err));
  window.history.replaceState(null, "", newUrl);

  togglePopup("sharePopup");
}

// URL Search Save
function saveUrlSearch() {
  if (debugMode) console.log("saveUrlSearch()");
  const params = new URLSearchParams();

  const searchInput = elements.searchInput?.value.trim();
  const exactMatch = elements.exactMatch?.checked;
  const showContext = elements.showContext?.checked;
  const uniqueWords = elements.uniqueWords?.checked;
  const gapInput = elements.gapInput?.value;
  const centerRange = elements.centerRange?.checked;
  const ordered = elements.ordered?.checked;
  const adjacent = elements.adjacent?.checked;
  const reverseInterlinear = elements.reverseInterlinear?.checked;
  const highlightSearch = elements.highlightSearch?.checked;

  if (searchInput) params.set("search", searchInput);
  if (exactMatch) params.set("e", "1");
  if (showContext) params.set("c", "1");
  if (uniqueWords) params.set("u", "1");
  // Only save gapInput if showContext is true or searchInput contains a space
  if (gapInput && (showContext || (searchInput && searchInput.includes(" ")))) {
    params.set("g", gapInput);
  }
  if (centerRange) params.set("s", "1");
  if (ordered) params.set("o", "1");
  if (adjacent) params.set("a", "1");
  if (showContext) {
    if (!reverseInterlinear) params.set("r", "0");
    if (!highlightSearch) params.set("h", "0");
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}?${params.toString()}`;
  // Copy to clipboard
  navigator.clipboard.writeText(newUrl)
    .then(() => showToast("URL copied to clipboard!"))
    .catch(err => alert("Failed to copy URL: " + err));
  window.history.replaceState(null, "", newUrl);

  togglePopup("sharePopup");
}

function resetUrl() {
  if (debugMode) console.log("resetUrl()");
  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}`;
  // Copy to clipboard
  navigator.clipboard.writeText(newUrl)
    .then(() => showToast("URL copied to clipboard!"))
    .catch(err => alert("Failed to copy URL: " + err));
  window.history.replaceState(null, "", newUrl);

  togglePopup("sharePopup");
}

function applyUrlSearch() {
  if (debugMode) console.log("applyUrlSearch()");
  const params = new URLSearchParams(window.location.search);

  if (!params.has("search")) {
    return; // bail out early if no search term
  }

  elements.searchInput.value = params.get("search");
  // Checkboxes: set according to params, default to unchecked
  elements.exactMatch.checked = params.get("e") === "1";
  elements.showContext.checked = params.get("c") === "1";
  elements.uniqueWords.checked = params.get("u") === "1";
  elements.centerRange.checked = params.get("s") === "1";
  elements.ordered.checked = params.get("o") === "1";
  elements.adjacent.checked = params.get("a") === "1";
  elements.reverseInterlinear.checked = params.get("r") !== "0";
  elements.highlightSearch.checked = params.get("h") !== "0";

  if (params.has("g")) elements.gapInput.value = params.get("g");
  
  autoGapInputWidth(elements.gapInput);

  currentRender = "search";
}

function showToast(message, duration = 2000) {
  if (debugMode) console.log("showToast()");
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(0,0,0,0.8)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = 10000;
  toast.style.fontFamily = 'sans-serif';
  toast.style.fontSize = '14px';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// Compare two BCV (Book, Chapter, Verse) tuples returns negative if bcv1 < bcv2, positive if bcv1 > bcv2, and 0 if they are equal
function compareBCV(b1, c1, v1, b2, c2, v2) {
  return b1 !== b2 ? b1 - b2 : c1 !== c2 ? c1 - c2 : v1 - v2;
}

function addVerses(b, c, v, delta, err = false) {
  if (debugModeExtra) console.log("addVerses()");
  // delta can be positive (add) or negative (subtract)
  while (delta !== 0) {
    if (!baseData[b] || !baseData[b][c]) break;
    const versesInChapter = baseData[b][c].length;

    if (delta > 0) {
      v++;
      if (v >= versesInChapter) {
        v = 0;
        c++;
        if (c >= baseData[b].length) {
          c = 0;
          b++;
          if (b >= baseData.length || baseData[b].length === 0) { // Remove second case once NT is complete.
            // overflow → return last valid verse
            return [ 
              b - 1,
              baseData[b - 1].length - 1,
              baseData[b - 1][baseData[b - 1].length - 1].length - 1,
              true
            ];
          }
        }
      }
      delta--;
    } else {
      v--;
      if (v < 0) {
        c--;
        if (c < 0) {
          b--;
          if (b < 39) { // Old Testament not available yet.
            // underflow → return very first verse
            return [39, 0, 0, true];
          } else {
            c = baseData[b].length - 1;
          }
        }
        v = baseData[b][c].length - 1;
      }
      delta++;
    }
  }

  return [b, c, v, false];
}

function adjustSelections() {
  if (debugMode) console.log("adjustSelections()");
  let bS = +elements.bookStart.value, cS = +elements.chapterStart.value, vS = +elements.verseStart.value;
  let bE = +elements.bookEnd.value, cE = +elements.chapterEnd.value, vE = +elements.verseEnd.value;
  let gap = parseInt(elements.gapInput.value, 10) - 1; // -1 to match 0-based index
  if (isNaN(gap)) gap = 0;

  const diff = compareBCV(bS, cS, vS, bE, cE, vE);

  if (diff > 0 || elements.enforceGap.checked) {
    // Start is after end — fix whichever side wasn't just changed
    if (lastChanged === "start") {
      // User changed start → push end forward
      [bE, cE, vE] = addVerses(bS, cS, vS, gap);
      elements.bookEnd.value = bE;
      populateChapters(bE, elements.chapterEnd);
      elements.chapterEnd.value = cE;
      populateVerses(bE, cE, elements.verseEnd);
      elements.verseEnd.value = vE;
    } else if (lastChanged === "end") {
      // User changed end → push start backward
      [bS, cS, vS] = addVerses(bE, cE, vE, -gap);
      elements.bookStart.value = bS;
      populateChapters(bS, elements.chapterStart);
      elements.chapterStart.value = cS;
      populateVerses(bS, cS, elements.verseStart);
      elements.verseStart.value = vS;
    }
  }

  updateDisplay();
}

  const fontSizeScale = [10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40];

function setFontSize() {
  let size1 = fontSizeScale[elements.fontSize.value];
  let size2 = fontSizeScale[elements.fontSize2.value];
  let size3 = elements.englishSecondary.checked ? size2 : size1;
  let size4 = elements.greekSecondary.checked ? size2 : size1;
  document.documentElement.style.setProperty("--font-size", size1 + "px");
  document.documentElement.style.setProperty("--font-size-reduced", size2 + "px");
  document.documentElement.style.setProperty("--font-size-english", size3 + "px");
  document.documentElement.style.setProperty("--font-size-greek", size4 + "px");
  saveSettings();
}

const lookupUnderscore = { // Run reportnonadjacent.py to update this
  "not": ["mh", "oy", "oyx", "oyk"],
  "not-still": ["oyketi"],
  "not-yet": ["oypv"],
  "no": ["mh", "oy"],
  "all": ["panta"],
  "any": ["tiw"],
  "emphatically-not": ["oyxi"],
  "first": ["prvton"],
  "hardly": ["moliw"],
  "me": ["me"],
  "myself": ["emayton"],
  "same": ["oyton", "ayto"],
  "time": ["xronon"],
  "us": ["hmaw"],
  "you": ["ymas"],
  "[not]": [""]
};
function processUnderscoreWord(eng, grk, lookupUnderscore) {
  if (debugMode) console.log("processUnderscoreWord()");
  if (!eng.includes("_")) return eng;

  const parts = eng.toLowerCase().split("_");
  if (parts.length < 2) return eng;

  // edge word = first + last parts concatenated (or with dash)
  const edgeWord = parts[0] + parts[parts.length - 1];

  // Find if Greek matches any Greek forms in lookup
  for (const [key, greekForms] of Object.entries(lookupUnderscore)) {
    if (greekForms.includes(grk)) {
      return key; // matched English lookup key
    }
  }

  // No match, reconstruct with dash
  return `${parts[0]}-${parts[parts.length - 1]}`;
}

function processFormatting(input) {
  if (debugMode) console.log("processFormatting()");
  const reducedStyle = 'font-size: var(--font-size-reduced); color: rgb(50, 100, 50);';

  function smallText(str) {
    return `<span class="formatted-chunk subtext">${str}</span>`;
  }

  function processBracketed(text, beforeChar, afterChar) {
    const exceptions = ["ing", "?"]; // anything that should never get a hyphen
    let trimmed = text.trim();

    if (!exceptions.includes(trimmed.toLowerCase())) {
      const firstChar = trimmed[0];
      const lastChar  = trimmed[trimmed.length - 1];

      const isLatinBefore = /[a-zA-Z]$/.test(beforeChar) && /[a-zA-Z]/.test(firstChar);
      const isLatinAfter  = /^[a-zA-Z]/.test(afterChar) && /[a-zA-Z]/.test(lastChar);

      if (isLatinBefore) trimmed = "-" + trimmed;
      if (isLatinAfter)  trimmed = trimmed + "-";
    }

    let result = smallText(trimmed);

    return result;
  }

  function toSubscript(str) {
    // use a span so styling matches smallText; vertical-align keeps it “sub”
    return `<span class="formatted-chunk subscript">${str}</span>`;
  }

  // Define special replacements
  const specialMap = {
    "feminine": "f",
    "masculine": "m",
    "neuter": "n",
    "singular": "sg",
    "plural": "pl",
    "adverb": "adv",
    "noun": "noun",
    "Hebrew": "Heb",
    "Latin": "Lat",
    "adjective": "adj",
    "comparatively": "comp",
    "masculine singular": "m,sg",
    "neuter plural": "n,pl",
    "adjective plural": "adj,pl",
    "participle": "ptcpl",
    "accusative": "acc",
    "feminine plural": "f,pl",
    "masculine plural": "m,pl",
    "neuter singular": "n,sg",
    "conjunction": "cnj",
    "pronoun": "prn",
    "subject": "sbj",
    "object": "obj",
    "noun plural": "n,pl",
    "weight": "weight",
    "verb participle": "verb,ptcpl",
    "verb imperative": "verb,imp",
    "vocative": "voc",
    "verb": "v"
  };

  const specialBracketSequences = {
    "[ing][a]": smallText("ing-a-"),      // or whatever replacement you want
    "[other][one]": smallText("-other-one")
  };

  for (const seq in specialBracketSequences) {
    const replacement = specialBracketSequences[seq];
    const escapedSeq = seq.replace(/[[\]]/g, '\\$&'); // escape brackets for regex
    const re = new RegExp(escapedSeq, 'g');
    input = input.replace(re, replacement);
  }

  // Replace "of" or "to" before {
  let output = input.replace(/\b(of|to)\s*(?={)/gi, (_, word) => smallText(word));

  // Replace { and } with lower half brackets
  const leftCorner  = `<span class="formatted-chunk bracket" style="display:inline-block; transform:scaleX(0.8);">⌞</span>`;
  const rightCorner = `<span class="formatted-chunk bracket" style="display:inline-block; transform:scaleX(0.8);">⌟</span>`;
  output = output.replace(/{/g, leftCorner).replace(/}/g, rightCorner);

  // 3) [ ... ] → subscript if mapped; else smallText (with auto-parens for multiword)
  output = output.replace(/\[([^\]]+)\]/g, (match, innerRaw, offset) => {
    const beforeChar = output[offset - 1] || "";
    const afterChar  = output[offset + match.length] || "";
    const inner = innerRaw.trim();
    const key = inner.toLowerCase();
    if (specialMap[key]) return toSubscript(specialMap[key]);
    let s = inner;
    const forceParen = ["diminutive", "4x", "3x", "Greek", "you"];
    if (/\s/.test(s) || forceParen.includes(s)) {
      s = '(' + s + ')';
    }
    return processBracketed(s, beforeChar, afterChar);
  });

  // 4) Wrap all remaining *plain text nodes* in .formatted-chunk
  const container = document.createElement('div');
  container.innerHTML = output;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // skip pure whitespace
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  for (const textNode of nodes) {
    // if already inside a formatted chunk, skip
    if (textNode.parentElement && textNode.parentElement.closest('.formatted-chunk')) continue;

    const span = document.createElement('span');
    span.className = 'formatted-chunk';
    span.textContent = textNode.nodeValue; // safe, preserves text as-is
    textNode.parentNode.replaceChild(span, textNode);
  }

  return container.innerHTML;
}

function getDisplayOptions() {
  if (debugModeExtra) console.log("getDisplayOptions()"); // Basic simplifier.
  return {
    showGreek: elements.showGreek.checked,
    showEnglish: elements.showEnglish.checked,
    showPcode: elements.showPcode.checked,
    showStrongs: elements.showStrongs.checked,
    showRoots: elements.showRoots.checked
  };
}

function insertFwdBack(container) {
  if (debugMode) console.log("insertFwdBack()");
  const backBtn = document.createElement("button");
  if (searchState[currentPanelId].page === 0) {
    backBtn.id = "greyFwdBackBtn";
  } else {
    backBtn.id = "pageBackBtn";
  }
  backBtn.title = "Previous Search Results Page";
  backBtn.textContent = "← Page";
  backBtn.onclick = prevPage;

  const forwardBtn = document.createElement("button");
  if (searchState[currentPanelId].page + 1 >= searchState[currentPanelId].boundaries.length) {
    forwardBtn.id = "greyFwdBackBtn";
  } else {
    forwardBtn.id = "pageForwardBtn";
  }
  forwardBtn.title = "Next Search Results Page";
  forwardBtn.textContent = "Page →";
  forwardBtn.onclick = nextPage;

  const btnWrapper = document.createElement("div");
  btnWrapper.style.width = "100%";           // Full width of the container
  btnWrapper.style.display = "flex";         // Keep buttons side by side
  btnWrapper.appendChild(backBtn);
  btnWrapper.appendChild(forwardBtn);
  container.appendChild(btnWrapper);
}

let centerFromSearch = false;
let currentRender = "reference"; // used to track current rendering mode, changed in render()
function render(customVerses = null, inDouble = false, isRef = false) {
  if (debugMode) console.log("render()");
  if ((customVerses && Array.isArray(customVerses)) && !isRef) {
    currentRender = "search";
  } else {
    currentRender = "reference";
  }
  if (elements.linkPanels.checked && (elements.horizPanel.checked || elements.vertPanel.checked) && currentRender === "reference" && !inDouble) { 
    let activePanel = getActivePanelId();
    let inactivePanel = activePanel === 1 ? 0 : 1;
    render(customVerses, true, true);
    activate(outputContainer.querySelector(`[data-panel-i-d="${inactivePanel}"]`), elements.gapInput.value);
    render(customVerses, true, true);
    activate(outputContainer.querySelector(`[data-panel-i-d="${activePanel}"]`), elements.gapInput.value);
    if (debugMode) console.log("end render()");
    return
  }
  if (!otherPanel) immediateHidePopup();
  saveState()
  const container = document.getElementById("output");
  container.innerHTML = "";
  container.scrollTop = 0; // reset scroll to top
  //storePanelState(container.dataset.panelID);

  const { showGreek, showEnglish, showPcode, showStrongs, showRoots } = getDisplayOptions();
  let showVerses = elements.showVerses.checked;
  const reverseInterlinear = elements.reverseInterlinear.checked;
  const altSearch = elements.altSearch.checked;
  const isFirstPanel = getActivePanelId() === 0;

  let passUnderscore = null;
  let countContext = 0;
  let contextBool = true;
  let verseEl = null;

  // Check for custom input (either word list or verse list)
  if (customVerses && Array.isArray(customVerses)) {
    if (searchState[currentPanelId].boundaries.length > 1 && currentRender === "search") {
      insertFwdBack(container)
    }

    const isWordList = Array.isArray(customVerses[0]) && (customVerses[0].length === 3 || customVerses[0].length === 4);
    const uniqueWords = document.getElementById('uniqueWords').checked;

    if (isWordList) {
      const wrapper = document.createElement("div");
      wrapper.className = "word-list-grid";

      // Build header row
      const header = document.createElement("div");
      header.className = "word-row word-header";

      let headerHTML = '';
      if (!uniqueWords)  headerHTML += `<span class="col reference">Reference</span>`;
      if (showGreek)   headerHTML += `<span class="col reference">Greek</span>`;
      if (showEnglish) headerHTML += `<span class="col reference">English</span>`;
      if (showPcode)   headerHTML += `<span class="col reference">Morph</span>`;
      if (showStrongs) headerHTML += `<span class="col reference">Strong's</span>`;
      if (showRoots)   headerHTML += `<span class="col reference">Roots</span>`;
      if (uniqueWords) headerHTML += `<span class="col reference">Count</span>`;

      header.innerHTML = headerHTML;
      wrapper.appendChild(header);

      // Add data rows
      customVerses.forEach(([ident, eng, ref, berean]) => {
        const row = document.createElement("div");
        row.className = "word-row";

        let grk = "", pcode = "", strongs = "", roots = "", cEng = "", rEng = "", count = 0;

        if ((typeof ident === "string" && /^[A-Za-z]+$/.test(ident)) || (altSearch)) {
          if (typeof ident === "string" && /^[A-Za-z]+$/.test(ident)) {
            grk = ident; // ident is actually the greek word from LXX auto-fill.
          } else {
            grk = lookupdb[ident][0];
          }
          // ident is blank → collect ALL entries for this grk
          const matches = Object.entries(lookupdb)
          .filter(([, val]) => val[0] === grk) // compare against Greek in val[0]
          .map(([, val]) => val);

          if (matches.length > 0) {
            const pcodeSet = new Set();
            const strongsSet = new Set();
            const rootsSet = new Set();
            const rEngSet = new Set();
            let totalCount = 0;

            for (const [_, pc, st, rt, re, ct] of matches) {
              const normalize = v =>
                String(v)
                  .trim()
                  .replace(/\u200B/g, "") // remove zero-width spaces
                  .replace(/\s+/g, " "); // collapse multiple spaces

              if (pc) pcodeSet.add(normalize(pc));
              if (st) strongsSet.add(normalize(st));
              if (rt) rootsSet.add(normalize(rt));
              if (re) rEngSet.add(normalize(re));
              if (ct) totalCount += Number(ct) || 0;
            }

            // Normalize rEng entries by removing leading "he-" or "she-"
            const normalizedREngSet = new Set(
              [...rEngSet].map(e => e.replace(/^(he|she|they|we|you|i|it|it\/he)-/i, ""))
            );

            // Reconstruct joined strings
            pcode  = [...new Set(pcodeSet)].join(", ");
            strongs = [...new Set(strongsSet)].join(", ");
            roots  = [...new Set(rootsSet)].join(", ");
            rEng   = [...normalizedREngSet].join(", ");
            count  = totalCount; // END LXX Helper
          }
        } else {
          // ident is numeric, get data from lookupdb
          const lookupData = lookupdb[ident] || [];   
          [grk, pcode, strongs, roots, cEng, count] = lookupData;
        }

        if (ref !== "" && !uniqueWords) {
          // Reference column (no popup)
          const refEl = document.createElement("span");
          refEl.className = "col ref";
          refEl.textContent = ref;

          // Make clickable
          refEl.style.cursor = "pointer";
          refEl.addEventListener("click", () => {
            //elements.searchInput.value = ref;
            //searchVerses();
            refSearch(ref);
          });

          row.appendChild(refEl);
        } else if (ref !== "" && uniqueWords) {
          count = ref;
        }

        // Helper for popup-enabled columns
        const makePopupCell = (className, content, isRoot = false, berean = null) => {
          const span = document.createElement("span");
          if (berean === 0) {
            className = "MSB";
          } else if (berean === 1) {
            className = "BSB";
          }
          span.className = `col ${className}`;
          span.innerHTML = content;

          span.dataset.grk = grk || "";
          span.dataset.pEng = eng || "";
          span.dataset.pcode = pcode || "";
          span.dataset.strongs = strongs || "";
          span.dataset.roots = roots || "";
          span.dataset.count = count || "";
          span.dataset.rEng = rEng || "";

          span.addEventListener("mouseenter", showPopupDelay);
          span.addEventListener("mouseleave", hidePopup);
          span.addEventListener("touchstart", showPopupTouchStart, { passive: true });
          span.addEventListener("touchend", showPopupTouchEnd);

          if (!isRoot) {
            // Default click-to-search (whole cell)
            span.addEventListener("click", (e) => {
              const isPopupActive = span.closest(".col") === currentPopup;
              const timeSincePopup = Date.now() - popupActivatedAt;
              if (isPopupActive && timeSincePopup > 200) {
                const cleanText = span.textContent.trim();
                elements.searchInput.value = cleanText;
                searchVerses();
              }
            });
          } else {
            // Add click listener to each individual root span
            span.querySelectorAll(".popup-clickable").forEach(inner => {
              inner.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent parent click
                const term = e.currentTarget.dataset.search;
                elements.searchInput.value = toGreek(term);
                searchVerses();
              });
            });
          }
          return span;
        };

        const engV = (select.value === "none" || isFirstPanel) ? "english" : "englishAlt";

        // Conditionally add selected columns
        if (showGreek)   row.appendChild(makePopupCell("greek", toGreek(grk)));
        if (showEnglish) row.appendChild(makePopupCell(engV, eng || "", false, berean));
        if (showPcode)   row.appendChild(makePopupCell("pcode", pcode || ""));
        if (showStrongs) row.appendChild(makePopupCell("strongs", strongs || ""));
        if (showRoots) {
          const rootParts = (roots || "").split(',').map(r => r.trim());
          const rootSpans = rootParts.map((r, i) => {
            let separator = '';

            if (rootParts.length > 1) {
              // Multiple elements:
              if (i === 0) {
                separator = ':';  // semicolon after first element
              } else if (i < rootParts.length - 1) {
                separator = ',';  // comma after others except last
              }
            }

            return `<span class="popup-clickable" data-search=".${r}">${toGreek(r)}${separator}</span>`;
          }).join('');

          row.appendChild(makePopupCell("roots", rootSpans, true));
        }
        if (uniqueWords) row.appendChild(makePopupCell("count", count ? count.toString() : ""));

        wrapper.appendChild(row);
      });

      container.appendChild(wrapper);
      if (searchState[currentPanelId].boundaries.length > 1) {
        insertFwdBack(container)
      }
    } else {
      // Default verse-style rendering
      if (elements.highlightSearch.checked) {
        customVerses = highlightCustomVerses(
          customVerses,
          elements.searchInput.value.trim().split(/\s+/)
        );
      }
      if (currentRender === "search") showVerses = true;
      customVerses.forEach(({ book, chapter, verse, verseData }) => {
        ({ passUnderscore, countContext, verseEl } = renderSingleVerse(
          container,
          book,
          chapter,
          verse,
          verseData,
          {
            showVerses,
            reverseInterlinear,
            passUnderscore,
            countContext,
            contextBool
          },
          verseEl,
          isFirstPanel
        ));
      });
      if (verseEl) container.appendChild(verseEl);
      if (searchState[currentPanelId].boundaries.length > 1 && currentRender === "search") {
        insertFwdBack(container)
      }
    }
  } else {
    let { results: refVerses, count: gap } = getRefResults();
    if (refVerses) {
      render(refVerses, inDouble, true);
    }
    elements.gapInput.value = gap;
    autoGapInputWidth(elements.gapInput);
    return
  }

  if (centerFromSearch) {
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    centerFromSearch = false;
  }

  requestAnimationFrame(() => fixOverwideEng(container));
  
  if (debugMode) console.log("end render()");
  return;
}

function highlightCustomVerses(customVerses, searchTerms) {
  if (debugMode) console.log("highlightCustomVerses()");

  let window = [];

  function processWindow(win) {
    if (!win.length) return;

    // flatten tokens with verse refs
    const flat = [];
    win.forEach(v=>{
      if (v.book === -1) return; // separator
      v.verseData.forEach(w=>{
        flat.push({ wordData:w });
      });
    });

    const marked = markWordSequence(flat, searchTerms);

    // write results back into verses
    let i=0;
    win.forEach(v=>{
      if (v.book === -1) return; // separator
      v.verseData = v.verseData.map(tok=>{
        const out = [...tok];
        out[4] = marked[i++][4];
        return out;
      });
    });
  }

  for (const verse of customVerses) {

    // separator = process accumulated window
    if (verse.verseData === "bar") {
      processWindow(window);
      window = [];
      continue;
    }

    window.push(verse);
  }

  // last window
  processWindow(window);

  return customVerses;
}

function markWordSequence(allWords, latinWords) {
  if (debugMode) console.log("markWordSequence()");
  const ordered = elements.ordered.checked;
  const adjacent = elements.adjacent.checked;
  let exact = elements.exactMatch.checked;

  if (!latinWords || latinWords.length === 0) return allWords;

  const tokens = allWords.map(({ wordData }) => wordData);
  const len = tokens.length;
  const n = latinWords.length;

  const mark = new Set();

  // ---------- CASE 1 ----------
  if (!ordered && !adjacent) {
    for (let wi = 0; wi < n; wi++) {
      const sw = latinWords[wi];
      if (/[α-ω]/i.test(sw) || lookInLookups(sw)) {
        tokens.forEach((t,i)=>{
          if (matchesLookup(sw, lookupdb[t[0]]))
            mark.add(i);
        });
      } else {
        tokens.forEach((t,i)=>{
          if (tokenMatchesWord(t, sw, exact))
            mark.add(i);
        });
      }
    }
  }

  // ---------- CASE 2 ----------
  else if (ordered && adjacent) {
    for (let start = 0; start <= len - n; start++) {
      let match = true;

      for (let k = 0; k < n; k++) {
        const sw = latinWords[k];
        const token = tokens[start + k];

        const ok = /[α-ω]/i.test(sw) || lookInLookups(sw)
          ? matchesLookup(sw, lookupdb[token[0]])
          : tokenMatchesWord(token, sw, exact);

        if (!ok) {
          match = false;
          break;
        }
      }

      if (match)
        for (let k = 0; k < n; k++)
          mark.add(start + k);
    }
  }

  // ---------- CASE 3 ----------
  else if (ordered && !adjacent) {
    for (let start = 0; start < len; start++) {
      let idx = start;
      const found = [];

      for (let w = 0; w < n; w++) {
        const sw = latinWords[w];
        let ok = false;

        for (; idx < len; idx++) {
          const token = tokens[idx];

          const match = /[α-ω]/i.test(sw) || lookInLookups(sw)
            ? matchesLookup(sw, lookupdb[token[0]])
            : tokenMatchesWord(token, sw, exact);

          if (match) {
            found.push(idx++);
            ok = true;
            break;
          }
        }

        if (!ok) break;
      }

      if (found.length === n)
        found.forEach(i => mark.add(i));
    }
  }

  // ---------- CASE 4 ----------
  else {
    for (let start = 0; start <= len - n; start++) {
      const window = tokens.slice(start, start + n);
      const used = new Set();
      const temp = [];
      let count = 0;

      for (let wi = 0; wi < n; wi++) {
        const sw = latinWords[wi];

        for (let ti = 0; ti < n; ti++) {
          if (used.has(ti)) continue;

          const token = window[ti];

          const match = /[α-ω]/i.test(sw) || lookInLookups(sw)
            ? matchesLookup(sw, lookupdb[token[0]])
            : tokenMatchesWord(token, sw, exact);

          if (match) {
            used.add(ti);
            temp.push(start + ti);
            count++;
            break;
          }
        }
      }

      if (count === n)
        temp.forEach(i => mark.add(i));
    }
  }

  // ---------- APPLY MARKS ----------
  return tokens.map((tok,i)=>{
    const out=[...tok];
    out[4]=mark.has(i);
    return out;
  });
}

function getRefResults(refData = null) {
  if (debugMode) console.log("getRefResults()");

  let bookStart, chapterStart, verseStart;
  let bookEnd, chapterEnd, verseEnd;

  // CASE 1 — reference provided programmatically
  if (refData && !Array.isArray(refData)) {

    // single verse
    if (!refData.start) {
      bookStart = bookEnd = refData.b;
      chapterStart = chapterEnd = refData.c;
      verseStart = verseEnd = refData.v;
    }

    // range
    else {
      bookStart = refData.start.b;
      chapterStart = refData.start.c;
      verseStart = refData.start.v;

      bookEnd = refData.end.b;
      chapterEnd = refData.end.c;
      verseEnd = refData.end.v;
    }
  }

  // CASE 2 — fallback to UI values
  else {
    bookStart = parseInt(elements.bookStart.value);
    chapterStart = parseInt(elements.chapterStart.value);
    verseStart = parseInt(elements.verseStart.value);
    bookEnd = parseInt(elements.bookEnd.value);
    chapterEnd = parseInt(elements.chapterEnd.value);
    verseEnd = parseInt(elements.verseEnd.value);
  }

  contextBool = false;

  let lastBook = null;
  let lastChapter = null;
  let count = 0;

  const isFirstPanel = getActivePanelId() === 0;
  const useBaseData = (select.value === "none" || isFirstPanel) ? true : false;
  let currData = useBaseData ? baseData : compData;

  const results = [];

  for (let b = bookStart; b <= bookEnd; b++) {
    if (!currData[b]) continue;
    const cStart = (b === bookStart) ? chapterStart : 0;
    const cEnd = (b === bookEnd) ? chapterEnd : currData[b].length;

    if (b > bookStart) results.push({ book: -1, chapter: -1, verse: -1, verseData: "bar"});

    for (let c = cStart; c <= cEnd; c++) {
      if (!currData[b][c]) continue;
      const vStart = (b === bookStart && c === chapterStart) ? verseStart : 0;
      const vEnd = (b === bookEnd && c === chapterEnd) ? verseEnd : currData[b][c].length;

      for (let v = vStart; v <= vEnd; v++) {
        const verseData = currData[b][c][v];
        if (!verseData) continue;

        results.push({ book: b, chapter: c, verse: v, verseData: currData[b][c][v] }) 

        count++
        if (count >= parseInt(elements.searchSize.value, 10)) {
          elements.gapInput.value = count;
          autoGapInputWidth(elements.gapInput);
          elements.bookEnd.value = b;
          populateChapters(b, elements.chapterEnd);
          elements.chapterEnd.value = c;
          populateVerses(b, c, elements.verseEnd);
          elements.verseEnd.value = v;
          results.push({ book: -1, chapter: -1, verse: -1, verseData: "too many" })
          return { results, count }
        }
      }
    }
  }
  return { results, count };
}

function fixOverwideEng(container) {
  const containerWidth = container.clientWidth;
  const engSpans = container.querySelectorAll(".eng");

  for (const eng of engSpans) {

    // reset previous manual breaks
    if (eng.dataset.fixed) {
      eng.textContent = eng.textContent;
      delete eng.dataset.fixed;
    }

    if (eng.scrollWidth <= containerWidth) continue;

    const text = eng.textContent;
    const parts = text.match(/[^\/]+\/?|\/+/g) || []; // keep slashes
    if (parts.length === 1) continue;

    const measurer = document.createElement("span");
    measurer.style.visibility = "hidden";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.position = "absolute";
    measurer.style.font = getComputedStyle(eng).font;
    document.body.appendChild(measurer);

    let lines = [];
    let current = "";

    for (const part of parts) {
      measurer.textContent = current + part;

      if (measurer.offsetWidth > containerWidth && current) {
        lines.push(current);
        current = part;
      } else {
        current += part;
      }
    }

    if (current) lines.push(current);

    measurer.remove();

    eng.innerHTML = lines.join("<br>");
    eng.dataset.fixed = "1";
  }
}


let otherPanel = false;

function createClickableSpan(className, text, wordEl, altsearch=null, berean=null) {
  if (debugModeExtra) console.log("createClickableSpan()"); // Excessive calls
  const span = document.createElement("span");
  if (berean === 0) {
    className = "MSB";
  } else if (berean === 1) {
    className = "BSB";
  }
  span.className = className;
  if (elements.customFormat.checked && className === "eng") {
    span.innerHTML = text;
  } else {
    span.textContent = text;
  }

  if (altsearch) span.dataset.search = altsearch;

  span.addEventListener("click", (e) => {
    const isPopupActive = wordEl === currentPopup;
    const timeSincePopup = Date.now() - popupActivatedAt;
    if (isPopupActive && timeSincePopup > 200) {
      const term =
        span.dataset.search ||
        span.textContent.trim().split(/\s+/)[0];

      const panel = span.closest(".panel");
      const panelId = panel?.id || null;
      if (panelId === "notput") otherPanel = true;
      else otherPanel = false;
      
      elements.searchInput.value = term;
      searchVerses();
    }
  });

  return span;
}

function renderSingleVerse(container, book, chapter, verse, verseData, options, verseElin = null, isFirstPanel) {
  if (debugMode) console.log("renderSingleVerse()");
  const { showGreek, showEnglish, showPcode, showStrongs, showRoots } = getDisplayOptions();
  const newlineAfterVerse = elements.newlineAfterVerse.checked;
  const {
    showVerses,
    reverseInterlinear,
    passUnderscore = null,
    countContext = 0,
    contextBool = false
  } = options;

  let localPassUnderscore = passUnderscore;
  let localCountContext = countContext;

  if (book === -1 && verseData === "bar") {
    container.appendChild(verseElin);
    verseElin = null;

    const separator = document.createElement('hr');
    separator.classList.add('search-separator');
    container.appendChild(separator);
    localCountContext = 0;
    return {
      passUnderscore: localPassUnderscore, countContext: localCountContext, verseElin
    };
  } else if (book === -1 && verseData === "too many") {
    container.appendChild(verseElin);
    verseElin = null;

    container.innerHTML += `<p><b>${elements.searchSize.value} verses displayed. Limit reached. Increase this limit in 'Display Settings' if you want to render more.</b></p>`;
    localCountContext = 0;
    return {
      passUnderscore: localPassUnderscore, countContext: localCountContext, verseElin
    };
  }

  let verseEl = null;
  if (verseElin) {
    verseEl = verseElin;
  } else {
    verseEl = document.createElement("div");
    verseEl.className = "verse";
  } 

  if (showVerses && verse !== -1) {
    let fullLabel = `${bookAbb[book]} ${chapter + 1}:${verse + 1}`;
    let displayLabel = "";

    if (newlineAfterVerse || (contextBool && localCountContext === 0)) {
      // Full label every time
      displayLabel = fullLabel;
    } else {
      if (verse === 0 || localCountContext === 0) {
        // Only show book+chapter at the start of a chapter
        displayLabel = fullLabel;
      } else {
        // Just show verse number
        displayLabel = `${verse + 1}`;
      }
    }

    const labelEl = document.createElement("span");
    labelEl.className = "verse-label";
    labelEl.textContent = displayLabel + ":";

    // Make it clickable: on click, put fullLabel in search and trigger search
    labelEl.addEventListener("click", () => {
      //elements.searchInput.value = fullLabel;
      //searchVerses();
      refSearch(fullLabel);
    });

    verseEl.appendChild(labelEl);
  }

  // Prepare words array (apply sorting etc.)
  let verseWords = verseData.slice();

  if (!reverseInterlinear) {
    verseWords.sort((a, b) => a[2] - b[2]);
  }

  // word rendering logic here, same as before...

  for (let i = 0; i < verseWords.length; i++) {
    const [ident, eng, num, berean, highlight] = verseWords[i]; 
    const wordEl = document.createElement("span");
    wordEl.className = "word";
    const altSearch = elements.altSearch.checked;

    let grk, pcode, strongs, roots, rEng, count;
    let lookupData = [];

    if (Number.isInteger(ident) && ident !== -1 && !altSearch) { //Refactor moved this block earlier.
      // Normal case: lookup by ident
      lookupData = lookupdb[ident] || [];
      [grk, pcode, strongs, roots, rEng, count] = lookupData; //Refactor added grk to beginning.
    } else if (ident != -1) { // BEGIN LXX Helper
      if (typeof ident === "string" && /^[A-Za-z]+$/.test(ident)) {
        grk = ident; // ident is actually the greek word from LXX auto-fill.
      } else {
        grk = lookupdb[ident][0];
      }
      // ident is blank → collect ALL entries for this grk
      const matches = Object.entries(lookupdb)
      .filter(([, val]) => val[0] === grk) // compare against Greek in val[0]
      .map(([, val]) => val);

      if (matches.length > 0) {
        const pcodeSet = new Set();
        const strongsSet = new Set();
        const rootsSet = new Set();
        const rEngSet = new Set();
        let totalCount = 0;

        for (const [_, pc, st, rt, re, ct] of matches) {
          const normalize = v =>
            String(v)
              .trim()
              .replace(/\u200B/g, "") // remove zero-width spaces
              .replace(/\s+/g, " "); // collapse multiple spaces

          if (pc) pcodeSet.add(normalize(pc));
          if (st) strongsSet.add(normalize(st));
          if (rt) rootsSet.add(normalize(rt));
          if (re) rEngSet.add(normalize(re));
          if (ct) totalCount += Number(ct) || 0;
        }

        // Normalize rEng entries by removing leading "he-" or "she-"
        const normalizedREngSet = new Set(
          [...rEngSet].map(e => e.replace(/^(he|she|they|we|you|i|it|it\/he)-/i, ""))
        );

        // Reconstruct joined strings
        pcode  = [...new Set(pcodeSet)].join(", ");
        strongs = [...new Set(strongsSet)].join(", ");
        roots  = [...new Set(rootsSet)].join(", ");
        rEng   = [...normalizedREngSet].join(", ");
        count  = totalCount; // END LXX Helper
      } else {
        // Nothing found → default empty values
        pcode = strongs = roots = rEng = "";
        count = 0;
      }
    }

    let pEng = null;
    let cEng = null;

    if (!reverseInterlinear) {
      pEng = processUnderscoreWord(eng, grk, lookupUnderscore); //Refactor got greek sooner.
    } else if (eng.includes("_")) {
      const underscoreCount = (eng.match(/_/g) || []).length;

      if (localPassUnderscore === underscoreCount - 1) {
        pEng = eng;
        localPassUnderscore = 0; // reset
      } else {
        cEng = processUnderscoreWord(eng, grk, lookupUnderscore); // used to display in popup
        localPassUnderscore += 1;
      }
    } else {
      pEng = eng;
      localPassUnderscore = 0; // safe reset
    }
    
/*     if (elements.highlightSearch.checked && elements.searchInput.value.trim() !== "") {
      const searchTerms = elements.searchInput.value.trim().split(/\s+/);
      let hEng = pEng || "";
      if (normalized) {
        hEng = hEng.replace(/,|\.|\(|\)|:|"|’|‘|`|”|“|'|;|–|—|\?|\[\?\]|!/g, '');
      }

      for (let term of searchTerms) {
        let exact = elements.exactMatch.checked;
        if (matchesLookup(term, lookupData)) {
          wordEl.classList.add("highlightSearch");
          break; // no need to keep checking once we found a match
        }

        if (term.startsWith('=')) {
          exact = true;
          term = term.slice(1);
        }
        // check each variable against this term
        if (
          (
            pEng &&
            (exact 
              ? hEng.toLowerCase() === term.toLowerCase()
              : hEng.toLowerCase().includes(term.toLowerCase())) 
          ) || ( // BEGIN LXX Helper
            grk &&
            (exact 
              ? toGreek(grk) === term.toLowerCase()
              : toGreek(grk).includes(term.toLowerCase())) // END LXX Helper
          )
        ) {
          wordEl.classList.add("highlightSearch");
          break; // no need to keep checking once we found a match
        }
      } 
    } */
    if (elements.highlightSearch.checked && highlight) {
      wordEl.classList.add("highlightSearch");
    }

    wordEl.dataset.grk = grk || "";
    wordEl.dataset.pEng = pEng || "";
    wordEl.dataset.cEng = cEng || "";
    wordEl.dataset.rEng = rEng || "";
    wordEl.dataset.pcode = pcode || "";
    wordEl.dataset.strongs = strongs || "";
    wordEl.dataset.roots = roots || "";
    wordEl.dataset.count = count || "";

    wordEl.addEventListener("mouseenter", showPopupDelay);
    wordEl.addEventListener("mouseleave", hidePopup);
    wordEl.addEventListener("touchstart", showPopupTouchStart, { passive: true });
    wordEl.addEventListener("touchend", showPopupTouchEnd);

    let hasContent = false;

    function appendPcode(wordEl, value) {
      wordEl.appendChild(createClickableSpan("pcode", value, wordEl));
    }

    function appendEng(wordEl, pEng, rEng) {
      let engV = (select.value === "none" || isFirstPanel) ? "eng" : "compEng";
      if (engV === "compEng" && pEng.startsWith("—") && (i > 0 || !showVerses)) engV = "compEngL"; 
      if (engV === "compEng" && pEng.endsWith("—") && (i < verseWords.length - 1  || !showVerses)) engV = "compEngR"; 
      if (!elements.normalized.checked || pEng === rEng) {
        if (elements.customFormat.checked) {
          wordEl.appendChild(createClickableSpan(engV, processFormatting(pEng), wordEl, pEng, berean));
        } else {
          wordEl.appendChild(createClickableSpan(engV, pEng, wordEl, null, berean));
        }
      } else {
        if (elements.customFormat.checked) {
          wordEl.appendChild(createClickableSpan(engV, processFormatting(pEng), wordEl, rEng, berean));
        } else {
          wordEl.appendChild(createClickableSpan(engV, pEng, wordEl, rEng, berean));
        }
      }
    }

    function appendSpacer(wordEl, className = null) {
      const span = document.createElement('span');
      if (className) span.className = className;
      span.textContent = '\u00A0';
      wordEl.appendChild(span);
    }


    if (!reverseInterlinear) {
      if (showStrongs) {
        if (strongs) {
          appendPcode(wordEl, strongs);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "pcode");
        }
      }

      if (showPcode) {
        if (pcode) {
          appendPcode(wordEl, pcode);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "pcode");
        }
      }
    }

    // English first if reverseInterlinear
    if (reverseInterlinear) {
      if (showEnglish) {
        if (pEng) {
          appendEng(wordEl, pEng, rEng);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "eng");
        }
      }
    }

    function appendGreek(wordEl, grk) {
      if (elements.uncialGreek.checked) {
        grk = toGreek(grk).toUpperCase();
      }
      if (grk) {
        wordEl.appendChild(createClickableSpan("grk", toGreek(grk), wordEl));
      } else {
        appendSpacer(wordEl, "grk")
      }
    }

    // Greek always in middle
    if (showGreek) {
      if (grk) {
        appendGreek(wordEl, grk);
        hasContent = true;
      } else {
        appendSpacer(wordEl, "grk");
      }
    }

    // English last if not reverseInterlinear
    if (!reverseInterlinear) {
      if (showEnglish) {
        if (pEng) {
          appendEng(wordEl, pEng, rEng);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "eng");
        }
      }
    }

    if (reverseInterlinear) {
      if (showPcode) {
        if (pcode) {
          appendPcode(wordEl, pcode);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "pcode");
        }
      }

      if (showStrongs) {
        if (strongs) {
          appendPcode(wordEl, strongs);
          hasContent = true;
        } else {
          appendSpacer(wordEl, "pcode");
        }
      }
    }

    function createRootsContainer() {
      const c = document.createElement('span');
      c.className = 'roots';
      c.style.whiteSpace = 'nowrap';
      return c;
    }

    function createRootSpan(root, suffix, wordEl) {
      const text = toGreek(root) + suffix;
      const span = createClickableSpan("roots", text, wordEl);
      span.dataset.search = '.' + toGreek(root);
      return span;
    }

    function appendRootsSpacer(container) {
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'roots';
      spaceSpan.textContent = '\u00A0';
      container.appendChild(spaceSpan);
    }

    const rootParts = roots ? roots.split(',').map(r => r.trim()) : [];

    if (showRoots) {
      if (rootParts.length > 0) {

        const firstContainer = createRootsContainer();
        const secondContainer = createRootsContainer();

        // First root
        const firstRoot = rootParts[0];
        const hasMore = rootParts.length > 1;
        firstContainer.appendChild(
          createRootSpan(firstRoot, hasMore ? ':' : '', wordEl)
        );

        // Remaining roots
        if (hasMore) {
          const remaining = rootParts.slice(1);
          remaining.forEach((r, i) => {
            const suffix = i < remaining.length - 1 ? ',' : '';
            secondContainer.appendChild(
              createRootSpan(r, suffix, wordEl)
            );
          });
        } else {
          appendRootsSpacer(secondContainer);
        }

        wordEl.appendChild(firstContainer);
        wordEl.appendChild(secondContainer);
        hasContent = true;

      } else {
        // two spacers to preserve layout
        const c1 = createRootsContainer();
        const c2 = createRootsContainer();
        appendRootsSpacer(c1);
        appendRootsSpacer(c2);
        wordEl.appendChild(c1);
        wordEl.appendChild(c2);
      }
    }

    if (hasContent) {
      verseEl.appendChild(wordEl);
    }
  }

  localCountContext += 1;

  if (newlineAfterVerse) {
    container.appendChild(verseEl);
    verseEl = null;
    localCountContext = 0;
  } 

  return {
    passUnderscore: localPassUnderscore, countContext: localCountContext, verseEl
  };
}

function positionPopupRelativeToElement(popup, targetEl) {
  if (debugMode) console.log("positionPopupRelativeToElement()");
  popup.style.display = "block"; // make it visible to measure

  const elRect = targetEl.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const popupWidth = popupRect.width || 250;
  const popupHeight = popupRect.height || 100;

  const viewportLeft = window.scrollX;
  const viewportRight = window.scrollX + window.innerWidth;
  const viewportBottom = window.scrollY + window.innerHeight;

  // Default position: below and left-aligned to target
  let left = elRect.left + window.scrollX;
  let top = elRect.bottom + window.scrollY;

  // Adjust if overflowing right
  if (left + popupWidth > viewportRight) {
    left = elRect.right + window.scrollX - popupWidth;
  }

  // Adjust if overflowing bottom
  if (top + popupHeight > viewportBottom - 45) {
    top = elRect.top + window.scrollY - popupHeight;
  }

  // Final fallback: don't go off top edge
  if (top < window.scrollY) {
    top = window.scrollY;
  }

  // handle left overflow and too-wide popup
  if (left < viewportLeft || popupWidth > window.innerWidth) {
    left = window.scrollX + (window.innerWidth - popupWidth) / 2;
    // Optional: keep within left/right viewport
    if (left < 0) left = 0;
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

let popupTimeout = null;
let currentPopup = null; // Track the currently active popup element
let popupActivatedAt = 0;
let popupDelayTimer = null;

function showPopup(e) {
  clearTimeout(popupDelayTimer);
  clearTimeout(popupTimeout);
  //currentPopup = e.target;
  //popupActivatedAt = Date.now();  // Track when it was shown
  const { showGreek, showEnglish, showPcode, showStrongs, showRoots } = getDisplayOptions();

  const target = e.currentTarget || e.target;
  const popup = document.getElementById("wordPopup");
  const wordEl = e.currentTarget || e.target;
  const altSearch = elements.altSearch.checked;

  const grk = target.dataset.grk || "";
  const pEng = target.dataset.pEng || "";
  const cEng = target.dataset.cEng || "";
  const pcode = target.dataset.pcode || "";
  const strongs = target.dataset.strongs || "";
  const rootsRaw = target.dataset.roots || "";
  const count = target.dataset.count || "";

  const grkDisplay = toGreek(grk);
  const interlinDisp = toInterlin(grk);
  const rootsDisplay = toGreek(rootsRaw);

  const panel = target.closest(".panel");
  const panelId = panel?.id || null;
  if (panelId === "notput") otherPanel = true;
  else otherPanel = false;

  // Helper to wrap values with clickable spans and add data attribute for searching
  function clickableLine(label, value) {
    if (!value) return '';
    return `<strong>${label}:</strong> <span class="popup-clickable" data-search="${value}">${value}</span><br>`;
  }

  let popupContent = '';

  if (!showGreek && grkDisplay !== "&nbsp;") {
    popupContent += clickableLine('Greek', grkDisplay);
  }

  if (!showEnglish) {
    popupContent += clickableLine('English', pEng);
  }

  if (showEnglish && pEng === '\u00A0') {
    popupContent += clickableLine('English', cEng);
  }

  if (!showPcode) {
    popupContent += clickableLine('MorphCode', pcode);
  }

  if (pcode) {
    popupContent += '<strong>Morphology:</strong> ' + parseMorphTag(pcode) + '<br>';
  }

  if (!showStrongs) {
    let label = strongs.includes(".") ? "AP-Strongs" : "Strong's";
    popupContent += clickableLine(label, strongs);
  }

  if (!showRoots && rootsDisplay ) {
    const rootParts = rootsDisplay.split(',').map(r => r.trim());

    if (rootParts.length === 1 && rootParts[0] !== "&nbsp;") {
      // Single root – just make it clickable with no colon
      popupContent += `<strong>Roots:</strong> <span class="popup-clickable" data-search=".${rootParts[0]}">${rootParts[0]}</span><br>`;
    } else if (rootParts.length > 1) {
      // First root: add colon
      const first = `<span class="popup-clickable" data-search=".${rootParts[0]}">${rootParts[0]}:</span>`;
      const rest = rootParts.slice(1).map(r =>
        `<span class="popup-clickable" data-search=".${r}">${r}</span>`
      ).join(', ');

      popupContent += `<strong>Roots:</strong> ${first} ${rest}<br>`;
    }
  }

  if ((!pEng || altSearch) && target.dataset.rEng) {
    popupContent += '<strong>Translations:</strong> ' + target.dataset.rEng + '<br>';
  }

  if (document.getElementById("translitGreek").checked) {
    popupContent += '<strong>Translit:</strong> ' + interlinDisp;
  }

  if (popupContent.endsWith('<br>')) {
    popupContent = popupContent.slice(0, -4);
  }

  if (popupContent.length === 0) {
    //popupContent = "[No info]"
    return
  }

  popup.innerHTML = popupContent;

  // Add click listener to the popup for only clickable spans
  popup.querySelectorAll('.popup-clickable').forEach(span => {
    // Desktop
    span.addEventListener('click', (event) => {
      event.stopPropagation();
      const text = event.target.dataset.search.trim();
      if (text) {
        elements.searchInput.value = text;
        if (!otherPanel) popup.style.display = 'none';
        searchVerses();
      }
    });

    // Mobile
    span.addEventListener('touchend', (event) => {
      event.stopPropagation();
      event.preventDefault();
      const text = event.target.dataset.search.trim();
      if (text) {
        elements.searchInput.value = text;
        if (!otherPanel) popup.style.display = 'none';
        searchVerses();
      }
    });
  });

  positionPopupRelativeToElement(popup, wordEl);
  popup.style.display = "block";

  function handlePopupClose(event) {
    if (debugMode) console.log("handlePopupClose()");
    event.stopPropagation(); // 👈 Stop bubbling
    event.preventDefault();  // 👈 Prevent click emulation
    if (!event.target.closest('.popup-clickable')) {
      popup.style.display = 'none';
    }
  }

  // Remove any existing listeners first (avoids stacking duplicates)
  popup.removeEventListener('click', handlePopupClose);
  popup.removeEventListener('touchend', handlePopupClose);

  // Add fresh listeners for both desktop and mobile
  popup.addEventListener('click', handlePopupClose);
  popup.addEventListener('touchend', handlePopupClose);
}

function showPopupDelay(event) {
  if (debugModeExtra) console.log("showPopupDelay()"); // Excessive calls
  currentPopup = event.target;
  popupActivatedAt = Date.now();  // Track when it was shown
  // Clear any previous timer (if user quickly moves between elements)
  clearTimeout(popupTimeout);
  clearTimeout(popupDelayTimer);
  
  // Wait 300 ms before calling your original showPopup()
  popupDelayTimer = setTimeout(() => {
    showPopup(event); // your existing popup function
  }, 400);
}

function hidePopup() {
  if (debugModeExtra) console.log("hidePopup()"); // Excessive calls
  clearTimeout(popupDelayTimer);
  popupTimeout = setTimeout(() => {
    document.getElementById("wordPopup").style.display = "none";
  }, 300); // small delay to allow hovering over popup
  currentPopup = null;
  popupActivatedAt = 0; // Reset activation time
}

function immediateHidePopup() {
  if (debugMode) console.log("immediateHidePopup()");
  clearTimeout(popupDelayTimer);
  document.getElementById("wordPopup").style.display = "none";
  currentPopup = null;
  popupActivatedAt = 0;
}

function cancelHidePopup() {
  if (debugModeExtra) console.log("cancelHidePopup()"); // Excessive calls
  clearTimeout(popupTimeout);
}

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
const TAP_MAX_TIME = 300;  // Max ms for tap
const TAP_MAX_DIST = 10;   // Max px for movement
function showPopupTouchStart(e) {
  if (debugMode) console.log("showPopupTouchStart()");
  const touch = e.touches[0];
  touchStartTime = Date.now();
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}
function showPopupTouchEnd(e) {
  if (debugMode) console.log("showPopupTouchEnd()");
  const touch = e.changedTouches[0];
  const elapsed = Date.now() - touchStartTime;
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (elapsed < TAP_MAX_TIME && distance < TAP_MAX_DIST) {
    //e.stopPropagation(); // 👈 Stop bubbling
    //e.preventDefault();  // 👈 Prevent click emulation
    const popup = document.getElementById("wordPopup");
    const isVisible = window.getComputedStyle(popup).display !== "none";

    if (isVisible) {
      popup.style.display = "none";
    } else {
      if (currentPopup && currentPopup === e.target.closest("span.word")) return; // Already active on this element, visible or not.
      currentPopup = e.target.closest("span.word") || null;
      popupActivatedAt = Date.now();  // Track when it was shown
      showPopup(e);  // You must make sure showPopup sets style.display = "block"
    }
  }
}

// Start Settings Code

const SETTINGS_KEY = "userSettingsV4";

function getActivePanelId() {
  if (debugModeExtra) console.log("getActivePanelId()");
  return Number(document.getElementById("output")?.dataset.panelID || 0);
}

function loadAllSettings() {
  if (debugMode) console.log("loadAllSettings()");
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"global":{}, "panels":[]}');
  //return JSON.parse('{"global":{}, "panels":[]}'); // Use this line to turn off settings.
}

function saveAllSettings(data) {
  if (debugMode) console.log("saveAllSettings()");
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
}

function dumpAllSettings() {
  if (debugMode) console.log("dumpAllSettings()");
  localStorage.clear();
  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}`;
  window.history.replaceState(null, "", newUrl);
  location.reload();
}

function saveSettings(targetAttr = null, firstLoad = false) {
  if (debugMode) console.log("saveSettings()");
  // Load existing settings so we only update parts
  let panelId = getActivePanelId();
  const data = loadAllSettings();
  if (panelId === 1 && select.value !== "none" && (data.panels[2] || firstLoad)) {
    panelId = 2;
  }

  const globalSettings = data.global || {};
  const panelSettings = data.panels[panelId] || {};

  for (const [key, el] of Object.entries(elements)) {
    if (!el) continue;

    // Case 1: saving only a specific group
    if (targetAttr && !el.hasAttribute(targetAttr)) continue;
    // Case 2: default save (exclude special groups)
    if (!targetAttr && (el.hasAttribute("ref-id") || el.hasAttribute("search-id"))) continue;

    const isGlobal = el.hasAttribute("global-setting");
    const target = isGlobal ? globalSettings : panelSettings;

    // Save checkbox/radio as boolean, others as value
    if (el.type === "checkbox" || el.type === "radio") {
      target[key] = el.checked;
    } else if ("value" in el) {
      target[key] = el.value;
    }
  }

  // Save header collapse state
  globalSettings.headerCollapsed = document.getElementById('header')?.classList.contains('collapsed') || false;

  // Save collapsed headgroups
  globalSettings.headGroupsCollapsed = getCollapsedHeadGroups();

  data.global = globalSettings;
  data.panels[panelId] = panelSettings;

  saveAllSettings(data);
}

function resetSettings(targetAttr = null, panelOnly = null) {
  if (debugMode) console.log("resetSettings()");
  const panelId = getActivePanelId();
  const data = loadAllSettings();

  const panelSettings = data.panels[panelId] || {};
  const globalSettings = data.global || {};

  for (const [key, el] of Object.entries(elements)) {
    if (!el) continue;

    // Case 1: reset only a specific group
    if (targetAttr && !el.hasAttribute(targetAttr)) continue;
    // Case 2: default reset (exclude ref-id and search-id)
    if (!targetAttr && (el.hasAttribute("ref-id") || el.hasAttribute("search-id"))) continue;

    // Delete from settings
    if (el.hasAttribute("global-setting")) {
      if (!panelOnly) delete globalSettings[key];
    } else {
      delete panelSettings[key];
    }
  }

  if (!panelOnly) {
    delete globalSettings.headerCollapsed;
    delete globalSettings.headGroupsCollapsed;
  }

  // Save updated settings back
  if (Object.keys(panelSettings).length === 0) delete data.panels[panelId];
  if (Object.keys(globalSettings).length === 0 && !panelOnly) delete data.global;

  saveAllSettings(data);
  if (targetAttr === "ref-id") {
    showToast(`Reference Reset!`)
  } else {
    location.reload();
  }
}

function loadSettings(pageload=false, global=true) {
  if (debugMode) console.log("loadSettings()");
  let panelId = getActivePanelId();
  if (panelId === 1 && select.value !== "none") {
    panelId = 2;
  }
  const data = loadAllSettings();

  const panelSettings = data.panels[panelId] || {};
  const globalSettings = data.global || {};

  // Apply globals first, then panel overrides
  let merged = { ...panelSettings };
  if (global) {
    merged = { ...globalSettings, ...panelSettings };
  }

  for (const [key, value] of Object.entries(merged)) {
    const el = elements[key] || document.getElementById(key);
    if (!el) continue;

    if ((key.includes("Start") || key.includes("End")) && !pageload) {
      continue;
    }

    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = value;
    } else if ("value" in el) {
      el.value = value;
    }

    if (key === "bookStart") populateChapters(value,  elements.chapterStart);
    if (key === "bookEnd") populateChapters(value, elements.chapterEnd);
    if (key === "chapterStart") populateVerses(elements.bookStart.value, value, elements.verseStart);
    if (key === "chapterEnd") populateVerses(elements.bookEnd.value, value, elements.verseEnd)
  }

  if (pageload) {
    // Apply header collapse state
    if (typeof globalSettings.headerCollapsed === 'boolean') {
      document.getElementById('header')?.classList.toggle('collapsed', globalSettings.headerCollapsed);
    }

    // Apply headgroup collapse states
    setCollapsedHeadGroups(panelSettings.headGroupsCollapsed || []);
  }
}

function parseMorphTag(tag) {
  if (debugMode) console.log("parseMorphTag()");
  const tenseMap = {
    'P': 'present', 'I': 'imperfect', 'F': 'future', 'A': 'aorist',
    'R': 'perfect', 'L': 'pluperfect'
  };

  const moodMap = {
    'I': 'indicative', 'S': 'subjunctive', 'O': 'optative',
    'M': 'imperative', 'N': 'infinitive', 'P': 'participle'
  };

  const voiceMap = {
    'A': 'active', 'M': 'middle', 'P': 'passive', 'E': 'middle/passive'
  };

  const comparisonMap = {
    'C': 'comparative', 'S': 'superlative', 'I': 'interrogative'
  };

  // --- Handle double slash first ---
  if (tag.includes('//')) {
    return tag.split('//')
      .map(part => parseMorphTag(part))
      .join('; or ');
  }

  const parts = tag.split('-');
  const posPart = parts[0];
  const posKey = Object.keys(posMap).find(key => key.toLowerCase() === posPart.toLowerCase());

  let tmv = "", cgpn = "", comp = "";

  // Check if it's a verb to determine structure
  if (posKey === 'V') {
    tmv = parts[1] || "";
    cgpn = parts[2] || "";
    comp = parts[3] || "";
  } else if (posKey === "Prtcl") {
    comp = parts[1] || "";
  } else {
    cgpn = parts[1] || "";
    comp = parts[2] || "";
  }

  const attributes = [];

  // Part of speech (match full string, case-insensitive)
  if (posKey) {
    attributes.push(posMap[posKey]);
  }

  // --- Handle tense/mood/voice, possibly with slash alternates ---
  function expandAlternates(code, map) {
    if (!code) return [];
    if (code.includes('/')) {
      return code.split('/').map(c => map[c.toUpperCase()] || c)
                  .map(x => `(${x})`).join(' or ');
    }
    return [map[code.toUpperCase()]].filter(Boolean);
  }

  // Tense
  if (tmv.length >= 1) attributes.push(...expandAlternates(tmv[0], tenseMap));
  // Mood
  if (tmv.length >= 2) attributes.push(...expandAlternates(tmv[1], moodMap));
  // Voice
  if (tmv.length >= 3) attributes.push(...expandAlternates(tmv[2], voiceMap));

  // --- CGPN ---
  if (cgpn) {
    attributes.push(parseCGPN(cgpn));
  }

  // Comparison
  if (comp) {
    const compAttr = comparisonMap[comp];
    if (compAttr) attributes.push(compAttr);
  }

  return attributes.join(', ');
}

function parseCGPN(cgpn) {
  if (debugMode) console.log("parseCGPN()");
  const caseMap = {
    'N': 'nominative', 'G': 'genitive', 'D': 'dative',
    'A': 'accusative', 'V': 'vocative', 'B': 'accusative/nominative',
    'C': 'accusative/nominative/vocative', 'Q': 'nominative/vocative'
  };

  const genderMap = {
    'M': 'masculine', 'F': 'feminine', 'N': 'neuter', 'X': 'any gender', 
    'H': 'masculine/feminine', 'W': 'masculine/neuter'
  };

  const personMap = {
    '1': 'first person', '2': 'second person', '3': 'third person',
    '4': 'first/third person'
  };

  const numberMap = {
    'S': 'singular', 'P': 'plural', 'T': 'singular/plural'
  };

  const options = cgpn.split('/').map(option => {
    let index = 0;
    const attrs = [];

    if (option.length > index && caseMap[option[index].toUpperCase()]) {
      attrs.push(caseMap[option[index].toUpperCase()]);
      index++;
    }

    if (option.length > index && genderMap[option[index].toUpperCase()]) {
      attrs.push(genderMap[option[index].toUpperCase()]);
      index++;
    }

    if (option.length > index && /\d/.test(option[index]) && personMap[option[index]]) {
      attrs.push(personMap[option[index]]);
      index++;
    }

    if (option.length > index && numberMap[option[index].toUpperCase()]) {
      attrs.push(numberMap[option[index].toUpperCase()]);
    }

    return attrs.join(', ');
  });

  // Only wrap with parentheses if multiple options
  return options.length > 1
    ? options.map(o => `(${o})`).join(" or ")
    : options[0];
}

// CONFIG: asymmetric expansion for pattern letters
// PATTERN_EXPAND[patternLetter] = array of allowed tag letters (including itself)
// Example: to make a pattern "A" match tags "A" or "B", set "A": ["A","B"]
// This is asymmetric: a tag letter "B" will NOT match pattern "A" unless "A" maps to include "B".
const PATTERN_EXPAND = {
  // Case
  "A": ["A","B","C"],
  "N": ["N","B","C","Q","W","~"],
  "V": ["V","C","Q"],
  // Gender
  "M": ["M","H","W","~"],
  "F": ["F","H","~"],
  //"N": ["N","W","~"], combined into case
  // Person
  "1": ["1","4"],
  "3": ["3","4"],
  // Number
  "S": ["S","T"],
  "P": ["P","T"],
  // Voice
  "M": ["M","E"],
  "P": ["P","E"]
};

function matchMorphTag(pattern, tag) {
  if (debugModeExtra) console.log("matchMorphTag()");
  pattern = pattern || "";
  tag = tag || "";

  // Handle double-slash alternates
  if (pattern.includes('//')) {
    return pattern.split('//').some(p => matchMorphTag(p, tag));
  }
  if (tag.includes('//')) {
    return tag.split('//').some(t => matchMorphTag(pattern, t));
  }

  const patParts = pattern.split('-');
  const tagParts = tag.split('-');

  // Always compare part of speech
  if (patParts[0] !== tagParts[0] && patParts[0] != '_') return false;

  // Helper to match a segment character-by-character
  function matchSegment(patSeg, tagSeg) {
    expand = elements.expandMorph.checked;
    patSeg = patSeg || "";
    tagSeg = tagSeg || "";

    // If either side has '/', split into options
    if (patSeg.includes('/') || tagSeg.includes('/')) {
      const patOptions = patSeg.split('/');
      const tagOptions = tagSeg.split('/');
      return patOptions.some(p => tagOptions.some(t => matchSegment(p, t)));
    }

    // Segment-level wildcard
    if (patSeg === "_" || patSeg === "-_") return true;

    let p = 0, t = 0;
    while (p < patSeg.length) {
      const pch = patSeg[p];

      if (pch === "_") {
        // underscore in pattern matches a single character if available,
        // otherwise can match zero (your original semantics)
        if (t < tagSeg.length) t++;
        p++;
        continue;
      }

      // If tag has run out of characters, fail
      if (t >= tagSeg.length) return false;

      // Compare characters with asymmetric expansion:
      //  - exact match passes
      //  - otherwise, see if pattern char expands to include tag char
      const pc = pch.toUpperCase();
      const tc = tagSeg[t].toUpperCase();

      if (pc === tc) {
        p++; t++;
        continue;
      }

      // PATTERN_EXPAND: only expand based on the pattern character
      if (PATTERN_EXPAND[pc] && PATTERN_EXPAND[pc].includes(tc) && expand) {
        p++; t++;
        continue;
      }

      // No match
      return false;
    }

    // All pattern consumed; extra characters in tag are allowed only if last pat char was _
    if (t < tagSeg.length && patSeg[patSeg.length - 1] !== "_") {
      return false;
    }

    return true;
  }

  // Compare all segments
  const maxLen = Math.max(patParts.length, tagParts.length);
  for (let i = 1; i < maxLen; i++) {
    const patSeg = patParts[i] || "";
    const tagSeg = tagParts[i] || "";
    if (!matchSegment(patSeg, tagSeg)) return false;
  }

  return true;
}

// Helper: parse reference strings into book/chapter/verse indices
function tryParseReference(refString) {
  if (debugMode) console.log("tryParseReference()");
  if (!refString?.trim()) return null;

  const refs = refString.split(",").map(r => r.trim()).filter(Boolean);
  const results = [];

  for (const ref of refs) {
    const match = ref.match(/^(\S+)\s+(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/);
    if (!match) return null;

    const [, bookName, c1, v1, c2, v2] = match;

    const b = bookAbb.findIndex(bk => bk.toLowerCase() === bookName.toLowerCase());
    if (b === -1) return null;

    const start = {
      b,
      c: parseInt(c1, 10) - 1,
      v: parseInt(v1, 10) - 1
    };

    // no range
    if (!v2) {
      results.push(start);
      continue;
    }

    const end = {
      b,
      c: (c2 ? parseInt(c2, 10) : parseInt(c1, 10)) - 1,
      v: parseInt(v2, 10) - 1
    };

    results.push({ start, end });
  }

  // preserve original behavior if single simple ref
  if (results.length === 1 && !results[0].start) {
    return results[0];
  }

  return results;
}

// Function to check if term is a possible match
function lookInLookups(term) {
  if (debugModeExtra) console.log("lookInLookups()");
  if (!term) return false;

  if (term.startsWith('~')) {
    term = term.slice(1);
  } 

  if (term.startsWith('=')) {
    term = term.slice(1);
  }

  // Check if contains + or |
  if (term.includes('+') || term.includes('|')) return true;

  // Check if term is a number
  if (!isNaN(term)) return true;

  // Check if term starts with a period
  if (term.startsWith('.')) return true;

  // Check if term starts with any of the prefixes
  if (Object.keys(posMap).some(posKey => term === posKey || term.startsWith(posKey + '-'))) {
    return true
  }

  return false
}

function collectVerseMatches(b, c, v) {
  if (debugModeExtra) console.log("collectVerseMatches()");
  let verseRange = parseInt(elements.gapInput.value, 10) || 1;
  const centerRange = elements.centerRange.checked;
  const results = [];

  const useBaseData = (select.value === "none" || getActivePanelId() === 0) ? true : false;
  let currData = useBaseData ? baseData : compData;

  let startOffset, endOffset;

  if (verseRange > 1) {
    if (centerRange) {
      const half = Math.floor(verseRange / 2);
      startOffset = -half;
      endOffset = verseRange - half - 1;
    } else {
      startOffset = 0;
      endOffset = verseRange - 1;
    }

    for (let offset = startOffset; offset <= endOffset; offset++) {
      const [nb, nc, nv, er] = addVerses(b, c, v, offset, 1);

      // Check if verse is valid
      if (currData[nb]?.[nc]?.[nv] && !er) {
        results.push({
          book: nb,
          chapter: nc,
          verse: nv,
          verseData: currData[nb][nc][nv]
        });
      } else {
        results.push({
          book: -1,
          chapter: -1,
          verse: -1,
          verseData: []
        });
      }
    }
  } else {
    if (currData[b]?.[c]?.[v]) {
      results.push({ book: b, chapter: c, verse: v, verseData: currData[b][c][v] });
    } else {
      results.push({ book: -1, chapter: -1, verse: -1, verseData: [] });
    }
  }

  return results;
}

function forEachVerse(callback) {
  const useBaseData = (select.value === "none" || getActivePanelId() === 0) ? true : false;
  let currData = useBaseData ? baseData : compData;

  if (debugMode) console.log("forEachVerse()");
  for (let b = 0; b < currData.length; b++) {
    if (!currData[b]) continue;
    for (let c = 0; c < currData[b].length; c++) {
      if (!currData[b][c]) continue;
      for (let v = 0; v < currData[b][c].length; v++) {
        const verseData = currData[b][c][v];
        if (!verseData) continue;
        callback(b, c, v, verseData);
      }
    }
  }
}

function newSearchState() {
  return {
    term: null,         // current search term
    contextCount: 0,     // Current gapInput
    page: 0,            // current page index
    pageSize: 10,      // max results per page
    boundaries: [0]      // array of indexes where each page starts (0, x, y, …)
  };
}

let searchState = [
  newSearchState(),
  newSearchState(),
  newSearchState()
]; // separate state for each panel (0, 1, 2)

function searchChange() {
  if (debugMode) console.log("searchChange()");
  currentPanelId = (getActivePanelId() === 1 && select.value !== "none") ? 2 : getActivePanelId();
  searchState[currentPanelId] = {
    term: searchState[currentPanelId].term,
    contextCount: parseInt(elements.gapInput.value),
    page: 0,
    pageSize: parseInt(elements.searchSize.value),
    boundaries: [0]
  };
  searchVerses();
}

function refSearch(searchTerm) {
  if (debugMode) console.log("refSearch()");

  const ref = tryParseReference(searchTerm);
  if (!ref) return false;

  // MULTI reference or range
  if (Array.isArray(ref)) {
    const limit = Number(elements.searchSize.value);
    const allResults = [];
    let count = 0;
    let truncated = false;

    for (const r of ref) {
      const { results: result, count: gap } = getRefResults(r);
      if (!result) continue;

      for (const obj of result) {
        if (count >= limit) {
          truncated = true;
          break;
        }
        allResults.push(obj);
        count++;
      }

      if (truncated) break;

      // separator between ranges
      allResults.push({ book: -1, chapter: -1, verse: -1, verseData: "bar" });
    }

    if (truncated) {
      allResults.push({ book: -1, chapter: -1, verse: -1, verseData: "too many" });
    } 

    if (allResults.at(-1)?.verseData === "bar") allResults.pop();
    if (allResults.at(0)?.verseData === "bar") allResults.shift();

    render(allResults);
    return true;
  }

  // SINGLE verse (original behavior unchanged)
  if (elements.centerRange.checked) centerFromSearch = true;
  setReferenceRange(ref);
  updateDisplay();
  render();
  return true;
}

function searchVerses() {
  if (debugMode) console.log("searchVerses()");
  const altVersion = (currentPanelId === 2) ? true : false;
  let searchTerm = elements.searchInput.value.trim();
  const showContext = elements.showContext.checked;
  const uniqueWords = elements.uniqueWords.checked;
  const normalized = elements.normalized.checked;
  const container = document.getElementById('output');
  container.innerHTML = ''; // clear existing output

  if (!searchTerm) {
    container.innerHTML = '<p>Please enter a search term.</p>';
    saveState(true);
    if (debugMode) console.log("end searchVerses()");
    return;
  }

  if (normalized) {
    searchTerm = searchTerm.replace(/,|\.|\(|\)|:|"|’|‘|`|”|“|'|;|–|—|\?|\[\?\]|!/g, '');
    elements.searchInput.value = searchTerm
  }

  saveSettings('save-id');

  // Reset state if new term or new search size, or new context size.
  if (searchTerm !== searchState[currentPanelId].term || parseInt(elements.searchSize.value) !== searchState[currentPanelId].pageSize || parseInt(elements.gapInput.value) !== searchState[currentPanelId].contextCount) {
    searchState[currentPanelId] = {
      term: searchTerm,
      contextCount: parseInt(elements.gapInput.value),
      page: 0,
      pageSize: parseInt(elements.searchSize.value),
      boundaries: [0]
    };
  }

  // Reference search
  if (refSearch(searchTerm)) return

  if (searchTerm.includes(" ") || showContext) {
    const matches = multiWordSearch(searchTerm);
    
    if (matches.length === 0) {
      container.innerHTML = `<p>No verses found containing "${searchTerm}".</p>`;
      saveState(true);
      if (debugMode) console.log("end searchVerses()");
      return;
    }
    render(matches);
    if (debugMode) console.log("end searchVerses()");
    return;
  }

  // All below should now only return the word list. 

  const matches = [];
  let inLookups = lookInLookups(searchTerm);

  // Case: Latin, not in lookups, and not normalized → raw term search
  if (!/[α-ω]/i.test(searchTerm) && !inLookups && (!normalized || altVersion) && (!uniqueWords || altVersion)) {
    handleWordMatches(searchTerm, matches);
  } else {
    handleLookupMatches(searchTerm, matches);
  }

  if (matches.length === 0) {
    container.innerHTML = `<p>No verses found containing "${searchTerm}".</p>`;
    saveState(true);
    if (debugMode) console.log("end searchVerses()");
    return;
  }
  render(matches);
}

function setReferenceRange({ b, c, v }) {
  if (debugMode) console.log("setReferenceRange()");
  const verseRange = parseInt(elements.gapInput.value, 10);
  const centerRange = elements.centerRange.checked;

  let startBCV, endBCV;
  if (verseRange > 1) {
    if (centerRange) {
      const half = Math.floor(verseRange / 2);
      startBCV = addVerses(b, c, v, -half);
      endBCV = addVerses(b, c, v, verseRange - half - 1);
    } else {
      startBCV = [b, c, v];
      endBCV = addVerses(b, c, v, verseRange - 1);
    }
  } else {
    startBCV = [b, c, v];
    endBCV = [b, c, v];
  }

  // Update UI selects:
  bookStart.value = startBCV[0];
  populateChapters(startBCV[0], chapterStart);
  chapterStart.value = startBCV[1];
  populateVerses(startBCV[0], startBCV[1], verseStart);
  verseStart.value = startBCV[2];

  bookEnd.value = endBCV[0];
  populateChapters(endBCV[0], chapterEnd);
  chapterEnd.value = endBCV[1];
  populateVerses(endBCV[0], endBCV[1], verseEnd);
  verseEnd.value = endBCV[2];
}

function handleLookupMatches(searchTerm, matches) {
  if (debugMode) console.log("handleLookupMatches()");
  const uniqueWords = elements.uniqueWords.checked;

  // figure out paging bounds
  const startIndex = searchState[currentPanelId].boundaries[searchState[currentPanelId].page];
  const endIndex = startIndex + parseInt(elements.searchSize.value);

  let count = 0; // how many matches total so far

  const morphMatches = [];

  for (let i = 0; i < lookupdb.length; i++) {
    const value = lookupdb[i];
    if (!value || value.length === 0) continue;

    if (matchesLookup(searchTerm, value)) {
      const rEng = value[4] || "";
      if (uniqueWords) {
        // unique words = just render dictionary hits
        if (count >= startIndex && count < endIndex) {
          matches.push([i, rEng, ""]);
        }
        count++;
      } else {
        morphMatches.push(i); // just store ident directly (the index)
      }
    }
  }

  // if we're in uniqueWords mode we’re done
  if (uniqueWords) {
    // add boundary marker if we have more than one page
    if (searchState[currentPanelId].boundaries.length <= searchState[currentPanelId].page + 1 && count > endIndex) {
      searchState[currentPanelId].boundaries.push(endIndex);
    } 
    // At some point I need to add sorting for unique words. In order to do that, I need to move the pagination down here.
    return;
  }

  if (morphMatches.length === 0) return;

  let exact = elements.exactMatch.checked; // BEGIN LXX Helper
  if (searchTerm.startsWith('=')) {
    exact = true;
    searchTerm = searchTerm.slice(1);
  } // END LXX Helper

  forEachVerse((b, c, v, verseData) => {
    verseData.forEach(([ident, eng]) => {
      if (morphMatches.includes(ident)) {
        if (count >= startIndex && count < endIndex) {
          matches.push([ident, eng, `${bookAbb[b]} ${c + 1}:${v + 1}`]);
        }
        count++;
      } else if (!Number.isInteger(ident)) { // If ident is stored as a greek word. BEGIN LXX Helper
        const word = toGreek(ident);
        const isMatch = exact ? word === searchTerm : word.includes(searchTerm);

        if (isMatch) {
          if (count >= startIndex && count < endIndex) {
            matches.push([ident, eng, `${bookAbb[b]} ${c + 1}:${v + 1}`]);
          }
          count++;
        }
      } // END LXX Helper
    });
  });

  // add boundary marker if needed
  if (searchState[currentPanelId].boundaries.length <= searchState[currentPanelId].page + 1 && count > endIndex) {
    searchState[currentPanelId].boundaries.push(endIndex);
  }
}

function handleWordMatches(term, matches) {
  if (debugMode) console.log("handleWordMatches()");
  let exact = elements.exactMatch.checked;
  let not = false;
  const normalized = elements.normalized.checked;
  const uniqueWords = elements.uniqueWords.checked;
  let found = [];

  if (term.startsWith('~')) {
    not = true;
    term = term.slice(1);
  }
  if (term.startsWith('=')) {
    exact = true;
    term = term.slice(1);
  }
  let searchTerm = term.toLowerCase();

  const startIndex = searchState[currentPanelId].boundaries[searchState[currentPanelId].page];
  const endIndex = startIndex + parseInt(elements.searchSize.value, 10);

  let count = 0;
  const uniqueFound = new Map();

  forEachVerse((b, c, v, verseData) => {
    verseData.forEach(([ident, eng, _, berean]) => {
      let word = (eng || "").toLowerCase();
      if (normalized) {
        word = word.replace(/,|\.|\(|\)|:|"|’|‘|`|”|“|'|;|–|—|\?|\[\?\]|!/g, '');
      }
      let isMatch = exact ? word === searchTerm : word.includes(searchTerm);
      if (!isMatch) return;

      // ---------- UNIQUE WORD MODE ----------
      if (uniqueWords) {

        if (!uniqueFound.has(word)) {
          uniqueFound.set(word, {
            ident,
            word,
            count: 1
          });
        } else {
          uniqueFound.get(word).count++;
        }

        return;
      }

      // ---------- NORMAL MODE ----------
      if (count >= startIndex && count < endIndex) {
        matches.push([ident, eng, `${bookAbb[b]} ${c + 1}:${v + 1}`, berean]);
      }

      count++;
    });
  });

  if (uniqueWords) {

    // convert map → array
    let all = [...uniqueFound.values()];

    // sort by frequency desc
    all.sort((a, b) => b.count - a.count);

    // pagination AFTER sort
    const pageSlice = all.slice(startIndex, endIndex);

    // push to matches in expected format
    pageSlice.forEach(obj => {
      matches.push([obj.ident, obj.word, obj.count]);
    });

    count = all.length;
  }

  // update boundaries if we need a new page marker
  if (searchState[currentPanelId].boundaries.length <= searchState[currentPanelId].page + 1 && count > endIndex) {
    searchState[currentPanelId].boundaries.push(endIndex);
  }

}

function nextPage() {
  if (debugMode) console.log("nextPage()");
  if (searchState[currentPanelId].page + 1 < searchState[currentPanelId].boundaries.length) {
    searchState[currentPanelId].page++;
    searchVerses();
  }
}

function prevPage() {
  if (debugMode) console.log("nextPage()");
  if (searchState[currentPanelId].page > 0) {
    searchState[currentPanelId].page--;
    searchVerses();
  }
}

// Helper to test if a verse word matches a search word index
function tokenMatchesWord(tokenVal, searchWord, exact = false) {
  if (!tokenVal || !searchWord) return false;

  if (Array.isArray(searchWord) && searchWord.length === 0) return false;

  if (!Number.isInteger(tokenVal[0])) { // BEGIN LXX Helper
    const grkToken = toGreek(tokenVal[0])

    let target = Array.isArray(searchWord) ? searchWord[0] : searchWord;
    if (!Number.isInteger(target) && target.startsWith('=')) {
      exact = true;
      target = target.slice(1);
    }

    return exact ? (grkToken === target) : grkToken.includes(target);
  } // END LXX Helper

  // searchWord is now either an array of idents or a single latin word.
  if (Array.isArray(searchWord)) {
    return searchWord.includes(tokenVal[0]);
  } else {
    let lowerToken = tokenVal[1].toLowerCase();
    return termMatch(searchWord, lowerToken)
  }
}

function checkWordSequence(allWords, latinWords, isGreek, matchIdent = false) {
  if (debugModeExtra) console.log("checkWordSequence()");
  const normalized = elements.normalized.checked;
  const ordered = elements.ordered.checked;       // new checkbox for ordered matching
  const adjacent = elements.adjacent.checked;     // new checkbox for adjacent matching
  let exact = elements.exactMatch.checked;
  if (!latinWords || latinWords.length === 0) return false;

  const normalizedWords = allWords.map(({ wordData }) => {
    return wordData; // Extract wordData from allWords tokens
  });

  // Case 1: unordered, non-adjacent (just presence)
  if (!ordered && !adjacent) {
    // Check that every search word appears somewhere in any order
    const matchedIndices = [];
    for (let wi = 0; wi < latinWords.length; wi++) {
      const sw = latinWords[wi];
      const idx = normalizedWords.findIndex((nw, i) => tokenMatchesWord(nw, sw, exact) && !matchedIndices.includes(i));
      if (idx === -1) return false; // missing a word
      matchedIndices.push(idx);
    }
    // Return matched token indices in order found (could sort but presence-only so order irrelevant)
    return matchedIndices.sort((a, b) => a - b);
  }

  // For ordered or adjacent, we look for sequences:

  const n = latinWords.length;
  const len = normalizedWords.length;

  // Case 2: ordered + adjacent (strict sequence)
  if (ordered && adjacent) {
    for (let start = 0; start <= len - n; start++) {
      let match = true;
      for (let offset = 0; offset < n; offset++) {
        if (!tokenMatchesWord(normalizedWords[start + offset], latinWords[offset], exact)) {
          match = false;
          break;
        }
      }
      if (match) {
        // Return consecutive indices
        return Array.from({ length: n }, (_, i) => start + i);
      }
    }
    return false;
  }

  // Case 3: ordered + non-adjacent (in order, but possibly gaps)
  if (ordered && !adjacent) {
    let resultIndices = [];
    let lastMatchIndex = -1;
    for (let wi = 0; wi < n; wi++) {
      const sw = latinWords[wi];
      let foundIndex = -1;
      for (let i = lastMatchIndex + 1; i < len; i++) {
        if (tokenMatchesWord(normalizedWords[i], sw, exact)) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex === -1) return false;
      resultIndices.push(foundIndex);
      lastMatchIndex = foundIndex;
    }
    return resultIndices;
  }

  // Case 4: non-ordered + adjacent (any order but consecutive window containing all words)
  if (!ordered && adjacent) {
    // Sliding window of length n
    for (let start = 0; start <= len - n; start++) {
      const windowWords = normalizedWords.slice(start, start + n);
      // Check if this window contains all search words (any order). Avoiding double-counting tokens by tracking used indices.
      const usedTokens = new Set();
      let matchedCount = 0;

      for (let wi = 0; wi < n; wi++) {
        for (let ti = 0; ti < n; ti++) {
          if (usedTokens.has(ti)) continue;

          if (tokenMatchesWord(windowWords[ti], latinWords[wi], exact)) {
            usedTokens.add(ti);
            matchedCount++;
            break;
          }
        }
      }

      if (matchedCount === n) {
        return Array.from({ length: n }, (_, i) => start + i);
      }
    }
    return false;
  }

  return false; // no match
}

function termMatch(term, word) {
  const normalized = elements.normalized.checked;
  let exact = elements.exactMatch.checked;
  let not = false;
  if (term.startsWith('~')) {
    not = true;
    term = term.slice(1);
  }
  if (term.startsWith('=')) {
    exact = true;
    term = term.slice(1);
  }
  if (normalized) {
    word = word.replace(/,|\.|\(|\)|:|"|’|‘|`|”|“|'|;|–|—|\?|\[\?\]|!/g, '');
  }

  let result = exact ? word === term : word.includes(term);
  return not ? !result : result
}

function multiWordSearch(searchStr, lookupInd) {
  if (debugMode) console.log("multiWordSearch()");
  const isFirstPanel = getActivePanelId() === 0;
  const reverseInterlinear = elements.reverseInterlinear.checked;
  const ordered = elements.ordered.checked;       // new checkbox for ordered matching
  const adjacent = elements.adjacent.checked;     // new checkbox for adjacent matching
  const normalized = elements.normalized.checked;
  const terms = searchStr.trim().split(/\s+/);

  // figure out paging bounds
  const startIndex = searchState[currentPanelId].boundaries[searchState[currentPanelId].page];
  const pageSize = parseInt(elements.searchSize.value, 10) || 0;
  const gap      = parseInt(elements.gapInput.value, 10) || 1;

  // If not a multiple of gap, use the next smaller multiple
  const effectiveSize = (gap > 0 && pageSize % gap !== 0)
    ? Math.floor(pageSize / gap) * gap
    : pageSize;

  const endIndex = startIndex + effectiveSize; // use this instead of startIndex + pageSize
  let count = 0; // how many matches total so far

  // Build possible matches for each input word
  const lookupTerms = [];
  const lookupStrength = [];

  for (const term of terms) {
    let normTerm = term;
    const inLookups = lookInLookups(term);

    // Start with an array to collect all matches
    let matches = []; // LXX Hhelper only
    let strength = 0;
    let hadLookupHit = false;

    // Case: Latin, not in lookups, and not normalized → raw term search
    if (!/[α-ω]/i.test(term) && ((!inLookups && !normalized) || (select.value !== "none" && !isFirstPanel))) {
      const lowerTerm = typeof normTerm === "string" ? normTerm.toLowerCase() : normTerm;
      lookupTerms.push(lowerTerm);
      lookupStrength.push(-lowerTerm.length);
      continue;
    }
   
    if (/[α-ω]/i.test(term) && !inLookups && term[0] !== '.') { // BEGIN LXX Helper
      matches.push(term);
    } 
    
    // Always add matches from lookupdb
    for (let i = 0; i < lookupdb.length; i++) {
      const value = lookupdb[i];
      if (!value) continue;
      if (matchesLookup(term, value)) {
        matches.push(i);
        strength += Number(value[5]) || 0;
        hadLookupHit = true;
      }
    }

    // No lookup hits → penalty
    if (!hadLookupHit) {
      const penaltyBase = matches[0] ?? term;
      strength = -String(penaltyBase).length;
    }

    lookupTerms.push(matches);
    lookupStrength.push(strength);
  };

  const combined = lookupTerms.map((val, i) => ({
    val,
    strength: lookupStrength[i]
  }));

  combined.sort((a, b) => a.strength - b.strength);

  const sortedLookupTerms = combined.map(x => x.val);
  const sortedStrength = combined.map(x => x.strength);

  const shortestLookup = sortedLookupTerms[0];

  //console.log(lookupTerms, lookupStrength, shortestLookup);

  let results = []; 
  const claimedVerses = new Set();

  // Scan through verses
  forEachVerse((b, c, v, verseWords) => {
    // Pre-check: does verse contain any of the words in the shortest array?
    const containsWord = verseWords.some(([ident, wordEnglish]) => {
      if (Array.isArray(shortestLookup)) {
        // Standard: match by ident index
        if (!Number.isInteger(ident) && !Number.isInteger(shortestLookup[0])) { // If ident is stored as a greek word. BEGIN LXX Helper
          const wordG = toGreek(ident);
          let target = shortestLookup[0];
          return termMatch(target, wordG);
        } // END LXX Helper
        return shortestLookup.includes(ident);
      } else if (typeof shortestLookup === "string" && !/[α-ω]/i.test(shortestLookup)) {
        // Fallback: match by English text
        const wordEng = (wordEnglish || "").toLowerCase();
        let target = shortestLookup;
        return termMatch(target, wordEng);
      } 
      return false;
    });

    if (!containsWord) return;

    // Pull full context verses
    const contextVerses = collectVerseMatches(b, c, v);

    // Skip if any verse in the context is already claimed
    if (contextVerses.some(cv => claimedVerses.has(`${cv.book}-${cv.chapter}-${cv.verse}`))) {
      return;
    }
    
    // Merge all words in the context into a single array, tagging with verse coordinates
    let allWords = [];
    contextVerses.forEach(cv => {
      let verseWords = cv.verseData;
      if (!reverseInterlinear) {
        verseWords = [...verseWords].sort((a, b) => a[2] - b[2]);
      }
      verseWords.forEach(w => {
        allWords.push({
          wordData: w,
          book: cv.book,
          chapter: cv.chapter,
          verse: cv.verse
        });
      });
    });
    
    if (terms.length === 1) {
      // Single term search – no need for sequence checking
      contextVerses.forEach(cv => {
        claimedVerses.add(`${cv.book}-${cv.chapter}-${cv.verse}`);
        if (count >= startIndex && count < endIndex) {
          results.push({
            book: cv.book,
            chapter: cv.chapter,
            verse: cv.verse,
            verseData: cv.verseData
          });
        }
        count++
      });
      if (count >= startIndex && count < endIndex) {
        results.push({ book: -1, chapter: -1, verse: -1, verseData: "bar"});
      }
    } else {
      // Multi-term search – use sequence logic
      const matchResult = checkWordSequence(allWords, lookupTerms, true, true);
      if (matchResult) {
        const hasOriginalVerseWord = matchResult.some(idx => {
          const token = allWords[idx];
          return token.book === b && token.chapter === c && token.verse === v;
        });
        if (hasOriginalVerseWord) {
          contextVerses.forEach(cv => {
            claimedVerses.add(`${cv.book}-${cv.chapter}-${cv.verse}`);
            if (count >= startIndex && count < endIndex) {
              results.push({
                book: cv.book,
                chapter: cv.chapter,
                verse: cv.verse,
                verseData: cv.verseData
              });
            }
            count++
          });
          if (count >= startIndex && count < endIndex) {
            results.push({ book: -1, chapter: -1, verse: -1, verseData: "bar"});
          }
        }
      }
    }
  });

  // add boundary marker if needed
  if (searchState[currentPanelId].boundaries.length <= searchState[currentPanelId].page + 1 && count > endIndex) {
    searchState[currentPanelId].boundaries.push(endIndex);
  }

  if (results.at(-1)?.verseData === "bar") results.pop();
  if (results.at(0)?.verseData === "bar") results.shift();

  return results;
}

function matchesLookup(term, value) {
  if (debugModeExtra) console.log("matchesLookup()"); // Excessive Calls
  let exact = elements.exactMatch.checked;
  let result = true;

  // Handle OR '|' first (lowest precedence)
  if (term.includes('|')) {
    return term.split('|').some(subTerm => matchesLookup(subTerm, value));
  }

  // Handle AND '+' next (higher precedence)
  if (term.includes('+')) {
    return term.split('+').every(subTerm => matchesLookup(subTerm, value));
  }

  if (term.startsWith('~')) {
    result = false;
    term = term.slice(1);
  }

  if (term.startsWith('=')) {
    exact = true;
    term = term.slice(1);
  }

  const lowerTerm = typeof term === "string" ? term.toLowerCase() : term;

  // Check if term starts with any of the prefixes
  if (Object.keys(posMap).some(posKey => term === posKey || term.startsWith(posKey + '-'))) {
    if (matchMorphTag(term, value[1])) return result;
  }

  // Check if term is a number
  if (!isNaN(term)) {
    if (value[2] === Number(term)) return result;
  }
  if (term.startsWith('.')) {
    const cleanTerm = toLatin(term.slice(1))
    const rootParts = (value[3] || "")
      .split(",")
      .map(r => r.trim().toLowerCase());
    return (exact ? rootParts[0] === cleanTerm : rootParts.some(r => cleanTerm === r));
  }

  const grk = value?.[0] || "";
  const rEng = value?.[4] || "";

  if (/[α-ω]/i.test(term)) {
    const grkNorm = toLatin(term);
    if (exact ? grkNorm === grk : grk.includes(grkNorm)) return result;
  } else {
    const val = rEng ? rEng.toLowerCase() : "";
    if (exact ? val === lowerTerm : val.includes(lowerTerm)) return result;
  }

  return !result;
}

function updateBCV(delta, renderFlag = true) {
  if (debugMode) console.log("updateBCV()");
  let bSel = elements.bookStart, cSel = elements.chapterStart, vSel = elements.verseStart;

  let b = +bSel.value;
  let c = +cSel.value;
  let v = +vSel.value;

  let bIndex = bSel.selectedIndex;
  let cIndex = cSel.selectedIndex;
  let vIndex = vSel.selectedIndex;

  let chapterCross = false;

  // Book-level change
  if (Math.abs(delta) === 3) {
    chapterCross = true;
    let newIndex = bIndex + Math.sign(delta);
    if (newIndex >= 0 && newIndex < bSel.options.length) {
      bSel.selectedIndex = newIndex;
      populateChapters(+bSel.value, cSel);
      cSel.selectedIndex = 0;
      populateVerses(+bSel.value, +cSel.value, vSel);
      vSel.selectedIndex = 0;
    }
  }

  // Chapter-level change
  else if (Math.abs(delta) === 2) {
    chapterCross = true;
    let newIndex = cIndex + Math.sign(delta);
    if (newIndex >= 0 && newIndex < cSel.options.length) {
      cSel.selectedIndex = newIndex;
    } else {
      let newBookIndex = bIndex + Math.sign(delta);
      if (newBookIndex >= 0 && newBookIndex < bSel.options.length) {
        bSel.selectedIndex = newBookIndex;
        populateChapters(+bSel.value, cSel);
        cSel.selectedIndex = (delta > 0 ? 0 : cSel.options.length - 1);
      }
    }
    populateVerses(+bSel.value, +cSel.value, vSel);
    vSel.selectedIndex = 0;
  }

  // Verse-level change
  else if (Math.abs(delta) === 1) {
    let newIndex = vIndex + Math.sign(delta);
    if (newIndex >= 0 && newIndex < vSel.options.length) {
      vSel.selectedIndex = newIndex;
    } else {
      chapterCross = true;
      let newChapIndex = cIndex + Math.sign(delta);
      if (newChapIndex >= 0 && newChapIndex < cSel.options.length) {
        cSel.selectedIndex = newChapIndex;
        populateVerses(+bSel.value, +cSel.value, vSel);
        vSel.selectedIndex = (delta > 0 ? 0 : vSel.options.length - 1);
      } else {
        let newBookIndex = bIndex + Math.sign(delta);
        if (newBookIndex >= 0 && newBookIndex < bSel.options.length) {
          bSel.selectedIndex = newBookIndex;
          populateChapters(+bSel.value, cSel);
          cSel.selectedIndex = (delta > 0 ? 0 : cSel.options.length - 1);
          populateVerses(+bSel.value, +cSel.value, vSel);
          vSel.selectedIndex = (delta > 0 ? 0 : vSel.options.length - 1);
        }
      }
    }
  }

  else if (Math.abs(delta) === 4) {
    const step = Math.sign(delta);            // +1 or -1
    const count = Number(elements.gapInput.value); // how many times

    for (let i = 0; i < count; i++) {
      updateBCV(step, false);
    }
  }

  const enforce = elements.enforceGap.checked;

  if (!enforce && chapterCross) {
    const bS = +elements.bookStart.value;
    const cS = +elements.chapterStart.value;

    elements.bookEnd.value = bS;
    populateChapters(bS, elements.chapterEnd);
    elements.chapterEnd.value = cS;
    populateVerses(bS, cS, elements.verseEnd);
    elements.verseEnd.value = vSel.options.length - 1;
  }

  lastChanged = "start";
  adjustSelections();
  if (renderFlag) render();
}

function copyText(mode) {
  if (debugMode) console.log("copyText()");
  const output = document.getElementById("output");
  const cleanText = mode === "grk" ? "Greek" : "English";
  if (!output) return;

  togglePopup('sharePopup')

  // Tably copy if table exists
  const grid = output.querySelector(".word-list-grid");
  if (mode === "table" &&grid) {
    const rows = [];

    grid.querySelectorAll(".word-row").forEach(row => {
      const cols = [...row.querySelectorAll(".col")]
        .map(c => c.textContent.trim());
      rows.push(cols.join("\t")); // tab-delimited
    });

    const result = rows.join("\n");

    navigator.clipboard.writeText(result)
      .then(() => showToast("Table copied!"))
      .catch(err => showToast("Copy failed: ", err));

    return;
  } else if (mode !== "table" && grid) {
    showToast("No verse text to copy, use Table copy.");
    return;
  } else if (mode === "table" && !grid) {
    showToast("No table to copy, use Greek/English copy for verse text.");
    return;
  }

  let texts = [];

  // include <hr> in traversal
  output.querySelectorAll(".verse-label, .word .grk, .word .eng, hr.search-separator, .word .compEng, .word .BSB, .word .MSB")
    .forEach(node => {

      if (node.tagName === "HR") {
        texts.push("\n\n"); // separator break
        return;
      }

      if (node.classList.contains("verse-label")) {
        texts.push('[' + node.textContent.trim() + ']');
      }
      else if (mode === "grk" && node.classList.contains("grk")) {
        texts.push(node.textContent.trim());
      }
      else if (mode === "eng" && (node.classList.contains("eng") || node.classList.contains("compEng"))) {
        texts.push(node.textContent.trim());
      }
      else if (mode === "eng" && node.classList.contains("MSB")) {
        texts.push("~" + node.textContent.trim() + "~");
      }
      else if (mode === "eng" && node.classList.contains("BSB")) {
        texts.push("*" + node.textContent.trim() + "*");
      }
    });

  let result = texts.join(" ")
    .replace(/~\s+~/g, " ")
    .replace(/\*\s+\*/g, " ");

  // clean spacing around line breaks + collapse spaces
  result = result
    .replace(/\s*\n\n\s*/g, "\n\n")
    .replace(/[^\S\n]+/g, " ")
    .trim();

  if (result) {
    navigator.clipboard.writeText(result)
      .then(() => showToast(`${cleanText} text copied!`))
      .catch(err => showToast("Copy failed: ", err));
  }
}

// === Query Builder 3.0 ===

const buildQueryBtn = document.getElementById("buildQueryBtn");
const modal = document.getElementById("queryBuilderModal");
const container = document.getElementById("queryBuilderContainer");
const addTermBtn = document.getElementById("addTermBtn");
const generateQueryBtn = document.getElementById("generateQueryBtn");
const cancelQueryBtn = document.getElementById("cancelQueryBtn");
const searchInput = document.getElementById("searchInput");

const termOperators = {
  "contains": "",           // no operator
  "is exactly": "=",
  "without": "~",
  "without exactly": "~="  // optional
};

const connectorOperators = {
  "": "",
  "and": "+",
  "or": "|",
  "[next word]": " "  // space creates new term-set
};

function openQueryBuilder() {
  if (debugMode) console.log("openQueryBuilder()");
  container.innerHTML = "";

  const currentQuery = searchInput.value.trim();

  if (currentQuery) {
    // Split into tokens: space creates new sets
    // Each "term set" may contain + or | operators
    const termSets = currentQuery.split(" "); // note: spaces = NEW SETS

    termSets.forEach((set, setIndex) => {
      // Split within each set by AND/OR connectors
      const parts = set.split(/([+|])/); // keep the operators

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;

        if (part === "+" || part === "|") continue; // handled after term

        // Identify any term-level operators (=, ~, ~=)
        let termOp = "";
        let termValue = part;
        if (part.startsWith("~=")) {
          termOp = "without exactly";
          termValue = part.slice(2);
        } else if (part.startsWith("~")) {
          termOp = "without";
          termValue = part.slice(1);
        } else if (part.startsWith("=")) {
          termOp = "is exactly";
          termValue = part.slice(1);
        }

        // Determine the following connector
        let connector = "";
        const next = parts[i + 1];
        if (next === "+") connector = "and";
        else if (next === "|") connector = "or";
        else if (setIndex < termSets.length - 1 && i === parts.length - 1)
          connector = "[next word]"; // end of set → new set follows

        addTermRow(termOp, termValue, connector);
      }
    });
  } else {
    // no current query: start with empty row
    addTermRow();
  }

  modal.style.display = "block";
}

function closeQueryBuilder() {
  if (debugMode) console.log("closeQueryBuilder()");
  modal.style.display = "none";
}

function addTermRow(termOp = "", termValue = "", connector = "") {
  if (debugMode) console.log("addTermRow()");
  const row = document.createElement("div");
  row.className = "term-row";

  // --- Term operator dropdown (=, ~, ~=)
  const termOpSelect = document.createElement("select");
  Object.keys(termOperators).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name || "(none)";
    termOpSelect.appendChild(option);
  });
  termOpSelect.value = termOp;

  // --- Term input
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter term";
  input.value = termValue;

  // --- HERE: attach Greek input handling
  input.addEventListener("beforeinput", function(e) {
    const convertToGreek2 = document.getElementById("convertToGreek2");
    handleGreekBeforeInput(e, elements.convertToGreek)
  });

  input.addEventListener("input", function (e) {
    const el = e.target;
    const cleaned = el.value.replace(/\s+/g, "");

    if (cleaned !== el.value) {
      const pos = el.selectionStart;
      el.value = cleaned;
      el.setSelectionRange(pos, pos);
    }
  });

  input.addEventListener("input", handleGreekInput);

  // --- Connector dropdown (+, |, space)
  const connectorSelect = document.createElement("select");
  Object.keys(connectorOperators).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name || "(none)";
    connectorSelect.appendChild(option);
  });
  connectorSelect.value = connector;

  // When connector changes to something non-empty, auto-add next row
  connectorSelect.addEventListener("change", () => {
    const val = connectorSelect.value;
    if (val && !row.nextElementSibling) {
      addTermRow(); // create new row automatically
    }
  });

  // --- Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "×";
  removeBtn.onclick = () => row.remove();

  row.append(termOpSelect, input, connectorSelect, removeBtn);
  container.appendChild(row);
}

function generateQuery() {
  if (debugMode) console.log("generateQuery()");
  let searchStr = "";

  document.querySelectorAll(".term-row").forEach((row, index) => {
    const termOpName = row.querySelector("select").value;
    const termInput = row.querySelector("input").value.trim();
    const connectorName = row.querySelectorAll("select")[1].value;

    if (!termInput) return;

    const opSymbol = termOperators[termOpName] || "";
    const connectorSymbol = connectorOperators[connectorName] || "";

    searchStr += opSymbol + termInput + connectorSymbol;
  });

  searchInput.value = searchStr;
  closeQueryBuilder();
  searchVerses();
}

buildQueryBtn.addEventListener("click", openQueryBuilder);
addTermBtn.addEventListener("click", () => addTermRow());
generateQueryBtn.addEventListener("click", generateQuery);
cancelQueryBtn.addEventListener("click", closeQueryBuilder);

window.addEventListener("click", e => {
  if (e.target === modal) closeQueryBuilder();
});

function keyboardswitch() {
  if (debugMode) console.log("keyboardswitch()");
  const greekMain = document.getElementById("convertToGreek");
  const greekPopup = document.getElementById("convertToGreek2");

  // Sync both checkboxes
  if (greekMain && greekPopup) {
    const newState = greekPopup.checked;
    greekMain.checked = newState;
  }

  // If you have other logic for keyboard switching, include it here
  // Example: enableGreekKeyboard(newState);
}

const toggleBtn = document.getElementById("toggleGreekImageBtn");
const greekImg = document.getElementById("greekKeyboardImage");

toggleBtn.addEventListener("click", () => {
  if (greekImg.style.display === "none") {
    greekImg.style.display = "block";
  } else {
    greekImg.style.display = "none";
  }
});

function toggleHeader(e) {
  if (debugMode) console.log("toggleHeader()");
  e.stopPropagation();
  const header = document.getElementById('header');
  const extras = document.getElementById('headerExtras');

  if (!header.classList.contains('collapsed')) {
    // before collapsing: lock current width
    extras.style.width = extras.offsetWidth + 'px';
  }

  header.classList.toggle('collapsed');

  if (!header.classList.contains('collapsed')) {
    // when expanding: allow it to auto-size again
    extras.style.width = '';
  }
  updatePanelHeight()
  saveSettings();
}

function toggleHeadGroups(inel) {
  if (debugMode) console.log("toggleHeadGroups()");
  document.getElementById(inel).classList.toggle('collapsed');
  updatePanelHeight()
  saveSettings();
}

function getCollapsedHeadGroups() {
  if (debugMode) console.log("getCollapsedHeadGroups()");
  return [...document.querySelectorAll('.head-group-wrapper.collapsed')].map(el => el.id);
}

function setCollapsedHeadGroups(ids = []) {
  if (debugMode) console.log("setCollapsedHeadGroups()");
  document.querySelectorAll('.head-group-wrapper').forEach(el => {
    el.classList.toggle('collapsed', ids.includes(el.id));
  });
}

document.addEventListener("keydown", function (e) {
  const active = document.activeElement;

  // Skip if the user is typing in the search input
  if (active && active.id === "searchInput") return;

  let delta = null;

  // Special case for search view
  if (currentRender === "search") {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      prevPage();
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextPage();
      e.preventDefault();
      return;
    }
  }

  // Horizontal arrows
  if (e.key === "ArrowRight") delta = 1;
  if (e.key === "ArrowLeft")  delta = -1;

  // Vertical arrows
  if (e.key === "ArrowUp") delta = -4;
  if (e.key === "ArrowDown") delta = 4;

  // Modifiers
  if (delta !== null) {
    if (e.shiftKey) delta = delta > 0 ? 2 : -2;
    if (e.ctrlKey)  delta = delta > 0 ? 3 : -3;

    updateBCV(delta);
    e.preventDefault(); // stop page scrolling
  }
});

const slider = document.getElementById('paddingSlider');

function updatePadding(val) {
  if (debugMode) console.log("updatePadding()");
  document.documentElement.style.setProperty('--word-padding', val + 'em');
  document.documentElement.style.setProperty('--word-padding-neg', Math.max(-2 * val, -0.3) + 'em');
}

slider.addEventListener('input', e => {
  saveSettings();
  updatePadding(e.target.value);
});

const borderToggle = document.getElementById('borderToggle');

function updateBorder(show) {
  if (debugMode) console.log("updateBorder()");
  document.documentElement.style.setProperty(
    '--word-border',
    show ? '1px solid var(--even-darker-tan)' : 'none'
  );
}

borderToggle.addEventListener('change', e => {
  saveSettings();
  updateBorder(e.target.checked);
});

const fontToggle = document.getElementById('fontToggle');

const serifFont = '"Times New Roman", serif';
const sansFont = '"Noto Sans", "Segoe UI", "Arial", sans-serif';

function updateFont(useSans) {
  if (debugMode) console.log("updateFont()");
  document.documentElement.style.setProperty(
    '--font-family',
    useSans ? sansFont : serifFont
  );
}

fontToggle.addEventListener('change', e => {
  saveSettings();
  updateFont(e.target.checked);
});

function autoGapInputWidth(el) {
  if (debugMode) console.log("autoGapInputWidth()");
  const len = el.value.length || 1;
  el.style.width = (len + 3) + 'ch';
}

// Start multi-panel code.
const outputContainer = document.getElementById("output-container");

const panelState = {};
const maxPanels = 1; // Zero-based max panels. Change this if going from 2 panels.

// Removed due to being redundant to historyStacks
function storePanelState(panelID) {
  if (debugMode) console.log("storePanelState()");
  panelState[panelID] = {
    bookStart: parseInt(elements.bookStart.value),
    chapterStart: parseInt(elements.chapterStart.value),
    verseStart: parseInt(elements.verseStart.value),
    bookEnd: parseInt(elements.bookEnd.value),
    chapterEnd: parseInt(elements.chapterEnd.value),
    verseEnd: parseInt(elements.verseEnd.value),
    search: elements.searchInput.value.trim(),
    gap: parseInt(elements.gapInput.value, 10) || 1,
    currentRender: currentRender
  };
}
// End removed.

function loadPanelState(panelID) {
  if (debugMode) console.log("loadPanelState()");
  const stack = historyStacks[panelID];
  if (!stack) return;
  const index = historyIndexes[panelID];
  if (index == null) return;
  const state = stack[index];
  if (!state) return;

  elements.bookStart.value = state.bookStart;
  elements.chapterStart.value = state.chapterStart;
  elements.verseStart.value = state.verseStart;
  elements.bookEnd.value = state.bookEnd;
  elements.chapterEnd.value = state.chapterEnd;
  elements.verseEnd.value = state.verseEnd;
  //elements.searchInput.value = state.searchInput;
  elements.gapInput.value = state.gapInput;
  autoGapInputWidth(elements.gapInput);
  currentRender = state.currentRender;
  updateDisplay();
}

function attachResize(divider) {
  if (debugMode) console.log("attachResize()");
  let startPos = 0;
  let startSizes = null;
  let isHorizontal = true;

  function onMove(pos) {
    if (isHorizontal) {
      const total = startSizes.left + startSizes.right;
      let newLeft = startSizes.left + pos - startPos;
      newLeft = Math.max(80, Math.min(newLeft, total - 80));
      const newRight = total - newLeft;
      const newLeftPercent = (newLeft / (total + 6)) * 100;
      //outputContainer.style.gridTemplateColumns = `${newLeft}px 6px ${newRight}px`;
      outputContainer.style.gridTemplateColumns = `${newLeftPercent}% 6px 1fr`;
    } else {
      const total = startSizes.top + startSizes.bottom;
      let newTop = startSizes.top + pos - startPos;
      newTop = Math.max(80, Math.min(newTop, total - 80));
      const newBottom = total - newTop;
      const newTopPercent = (newTop / (total + 6)) * 100;
      //outputContainer.style.gridTemplateRows = `${newTop}px 6px ${newBottom}px`;
      outputContainer.style.gridTemplateRows = `${newTopPercent}% 6px 1fr`;
    }
    let raf;
    function scheduleFix() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        outputContainer.querySelectorAll(".panel")
          .forEach(fixOverwideEng);
      });
    }
    scheduleFix();
  }

  function onMouseMove(e) {
    onMove(isHorizontal ? e.clientX : e.clientY);
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      onMove(isHorizontal ? e.touches[0].clientX : e.touches[0].clientY);
    }
  }

  function onUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onUp);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onUp);

    // Re-enable text selection
    document.body.style.userSelect = "";
    document.body.style.pointerEvents = "";
  }

  function startDrag(posEvent) {
    isHorizontal = outputContainer.classList.contains("horizontal");
    startPos = isHorizontal
      ? posEvent.clientX || posEvent.touches[0].clientX
      : posEvent.clientY || posEvent.touches[0].clientY;

    const panels = outputContainer.querySelectorAll(".panel");
    if (isHorizontal) {
      startSizes = {
        left: panels[0].offsetWidth,
        right: panels[1].offsetWidth
      };
    } else {
      startSizes = {
        top: panels[0].offsetHeight,
        bottom: panels[1].offsetHeight
      };
    }

    // Disable text selection while dragging
    document.body.style.userSelect = "none";
    // Optional: disable pointer events for iframes or other overlays
    document.body.style.pointerEvents = "none";

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
  }

  divider.addEventListener("mousedown", startDrag);
  divider.addEventListener("touchstart", e => {
    e.preventDefault(); // Prevent scrolling
    startDrag(e);
  }, { passive: false });
}


function resetPanelLayout() {
  if (debugMode) console.log("resetPanelLayout()");
  outputContainer.style.gridTemplateColumns = "";
  outputContainer.style.gridTemplateRows = "";

  if (outputContainer.classList.contains("horizontal")) {
    outputContainer.style.gridTemplateColumns = "1fr 6px 1fr";
    outputContainer.style.gridTemplateRows = "1fr";
  }

  if (outputContainer.classList.contains("vertical")) {
    outputContainer.style.gridTemplateRows = "1fr 6px 1fr";
    outputContainer.style.gridTemplateColumns = "1fr";
  }
}

function buildPanels(count) {
  if (debugMode) console.log("buildPanels()");
  if (count === 1) {
    document.getElementById("historyButtonsRight").style.visibility = "hidden";
  } else {
    document.getElementById("historyButtonsRight").style.visibility = "visible";
  }
  const oldOutput = document.getElementById("output");

  resetPanelLayout();
  initHistoryForPanels(count);

  outputContainer.innerHTML = "";

  // Global scroll ownership state
  let scrollOwner = null;
  let rAFScheduled = false;

  function handleScroll(panel) {
    // Only the active panel drives sync
    if (scrollOwner && scrollOwner !== panel) return;

    scrollOwner = panel;

    if (!rAFScheduled) {
      rAFScheduled = true;
      requestAnimationFrame(() => {
        syncScroll(scrollOwner);
        rAFScheduled = false;

        // Release ownership after momentum ends
        clearTimeout(panel._releaseTimer);
        panel._releaseTimer = setTimeout(() => {
          scrollOwner = null;
        }, 120); // 120ms after last scroll
      });
    }
  }

  function syncScroll(source) {
    if (!elements.linkPanels.checked || !elements.linkScroll.checked) return;

    if (historyStacks[0][historyIndexes[0]].currentRender !== "reference") return;
    let secondPanel = select.value !== "none" ? 2 : 1;
    if (historyStacks[secondPanel][historyIndexes[secondPanel]].currentRender !== "reference") return;

    const panels = outputContainer.querySelectorAll(".panel");

    const proportion =
      source.scrollTop / (source.scrollHeight - source.clientHeight || 1);

    panels.forEach(panel => {
      if (panel === source) return;

      // Calculate target scrollTop for proportional sync
      const targetScroll = Math.round(proportion * (panel.scrollHeight - panel.clientHeight));

      if (panel.scrollTop !== targetScroll) {
        panel.scrollTop = targetScroll;
      }
    });
  }

  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "panel";
    div.dataset.panelID = i;

    if (i === 0 && oldOutput) {
      div.innerHTML = oldOutput.innerHTML;
    }

    div.addEventListener("mousedown", (event) => {
      const target = event.target;

      // Check if the clicked element is a <span class="verse-label">  or a <span> within <span class="word">. These are click-to-search and so the user may desire to send the result to the active panel.
      if (target.matches("span.verse-label") || target.closest("span.word") || target.closest("div.word-row span[class^='col']")) {
        if (!target.closest("div.word-row.word-header")) {
          return; // Skip chaning the active panel unless in a header row.
        }
      }

      // Otherwise, activate the panel
      activate(div);
    });

    div.addEventListener("scroll", () => handleScroll(div));

    outputContainer.appendChild(div);

    if (i < count - 1) {
      const divider = document.createElement("div");
      divider.className = "divider";
      outputContainer.appendChild(divider);
      attachResize(divider);
    }
  }
  updatePanelHeight();
  for (let i = 0; i < count; i++) { // Start at 1 because first panel is already loaded properly on init.
    const panel = outputContainer.querySelector(`[data-panel-i-d="${i}"]`);
    if (panel) {
      activate(panel);
      if (historyIndexes[i] === -1) onOptionsChange();
      else loadState(i, historyIndexes[i])
      saveSettings();
    }
  }
  activate(outputContainer.firstElementChild);
}

let currentPanelId = getActivePanelId();
currentPanelId = (currentPanelId === 1 && select.value !== "none") ? 2 : currentPanelId;

function activate(panel, fromRender = false) {
  if (debugMode) console.log("activate()");
  const current = document.getElementById("output");
  if (current) current.id = "notput";

  panel.id = "output";

  currentPanelId = getActivePanelId();
  currentPanelId = (currentPanelId === 1 && select.value !== "none") ? 2 : currentPanelId;

  loadSettings(false, false);
  if (!fromRender) loadPanelState(currentPanelId);
  else {
    elements.gapInput.value = fromRender; // gapInput is saved in settings and thus overridden when render() activates panels for linking purposes.
    autoGapInputWidth(elements.gapInput);
  }
}

function setMode(changed = null) {
  if (debugMode) console.log("setMode()");
  if (changed !== "init") {
    togglePopup("panelPopup") 
  }
  if (changed === "vert" && elements.vertPanel.checked) {
    elements.horizPanel.checked = false;
  } else if (changed === "horiz" && elements.horizPanel.checked) {
    elements.vertPanel.checked = false;
  }

  if (elements.horizPanel.checked) {
    outputContainer.className = "horizontal";
    buildPanels(2);
  } else if (elements.vertPanel.checked) {
    outputContainer.className = "vertical";
    buildPanels(2);
  } else {
    outputContainer.className = "one";
    if (changed !== "init") activate(outputContainer.querySelector(`[data-panel-i-d="${0}"]`), true); // This line ensures the first panel is active when switching back to single panel mode to avoid any data conflicts.
    buildPanels(1);
  }

  onOptionsChange();
}

function updatePanelHeight() {
  if (debugMode) console.log("updatePanelHeight()");
  const isMobile = elements.smallScreen.checked;
  let height;

  if (isMobile) {
    // On mobile: ~90% of viewport
    height = Math.round(window.innerHeight * 0.9);
  } else {
    const bottomEl = document.getElementById("headWrapper2");
    const topEl = document.getElementById("navHeader");

    if (bottomEl && topEl) {
      const bottomOfBottomEl = bottomEl.getBoundingClientRect().bottom;
      const topOfTopEl = topEl.getBoundingClientRect().top;
      
      height = Math.max(150, topOfTopEl - bottomOfBottomEl - 10);
    } else {
      // Fallback if either element is missing
      height = window.innerHeight;
    }
  }

  // Apply height via CSS variable
  document.documentElement.style.setProperty("--panel-height", `${height}px`);
}

window.addEventListener("resize", updatePanelHeight);
window.addEventListener("orientationchange", updatePanelHeight);
document.addEventListener("DOMContentLoaded", updatePanelHeight);

// Alternate Translation mode

const translations = {
  kjv: "alt/KJV1769.json" ,
  gen: "alt/Gen1599.json",
  tyn: "alt/Tyn1534.json",
  wyc: "alt/Wycliffe.json",
  web: "alt/WEB.json",
  bsb: "alt/BSB.json",
  msb: "alt/MSB.json",
  wycsp: "alt/WycSP.json",
  tynsp: "alt/Tyn1526SP.json",
  kjv1611: "alt/KJV1611.json",
  mbsb: "alt/MBSB.json",
  kjvna: "alt/KJVNA.json",
};

const translationsx = {
  kjv: "alt/KJV1769x.json" ,
  gen: "alt/Gen1599x.json",
  tyn: "alt/Tyn1534x.json",
  wyc: "alt/Wycliffex.json",
  web: "alt/WEBx.json",
  bsb: "alt/BSBx.json",
  msb: "alt/MSBx.json",
  wycsp: "alt/WycSPx.json",
  tynsp: "alt/Tyn1526SP.json",
  kjv1611: "alt/KJV1611x.json",
  mbsb: "alt/MBSB.json",
  kjvna: "alt/KJVNA.json",
};

// Mapping of translation values to their abbreviations
const translationAbbrevs = {
  "bsb": "BSB",
  "msb": "MSB", 
  "web": "WEB",
  "kjv": "KJV (1769)",
  "kjv1611": "KJV (1611)",
  "gen": "Geneva",
  "tyn": "Tyndale",
  "tynsp": "TYN (sp)",
  "wyc": "Wycliffe",
  "wycsp": "Wycliffe (sp)",
  "mbsb": "M/BSB",
  "kjvna": "KJV/NA28"
};

const select = document.getElementById("translationSelect");
const translationModal = document.getElementById("translationModal");
const modalText = document.getElementById("modalText");
const ackButton = document.getElementById("ackButton");
const nackButton = document.getElementById("nackButton");
let modalShown = false;

function changeAltTranslation() {
  if (debugMode) console.log("changeAltTranslation()");
  let data = loadAllSettings();
  if ((!data.panels[2] || !historyStacks[2]) && select.value !== "none") {
    let activePanel = getActivePanelId();
    if (activePanel === 0) { 
      activate(outputContainer.querySelector(`[data-panel-i-d="1"]`));
    }

    elements.showGreek.checked = false;
    elements.showPcode.checked = false;
    elements.showStrongs.checked = false;
    elements.showRoots.checked = false;
    saveSettings(null, true);
    
    render();
    if (activePanel === 0) {
      activate(outputContainer.querySelector(`[data-panel-i-d="0"]`));
    }
  } else {
    loadState(1, 0, true);
  }
}

function showDisclaimer() {
  togglePopup("panelPopup");
  // Show modal with warning
  modalText.innerHTML = 
    "The GHT team is not responsible for the content of other translations, and their inclusion in this tool should not be considered endorsement. Any errors, omissions, additions, or interpretations remain the responsibility of the translation source organization.<br><br>See <a href='jsonsource.html' target='_blank' rel='noopener noreferrer'>here</a> for a list of sources.";
  translationModal.style.display = "block";

  // Wait for user acknowledgment
  ackButton.onclick = async function() {
    loadSettings(false, false);
    saveSettings();
    translationModal.style.display = "none";

    // Mark modal as shown for this session
    modalShown = true;
    //document.getElementById("swapPanelsBtn").disabled = true;
    const abbrevElement = document.getElementById("translationAbbrev");
    abbrevElement.style.display = "block";
    await loadTranslation(select.value);
  };

  nackButton.onclick = async function() {
    select.value = "none";
    translationModal.style.display = "none";
  };
}

select.addEventListener("change", async function() {
  const selected = select.value;
  
  const abbrevElement = document.getElementById("translationAbbrev");
  abbrevElement.textContent = translationAbbrevs[selected] || selected.toUpperCase();

  if(selected === "none") {
    togglePopup("panelPopup");
    compData = null;
    changeAltTranslation();
    //document.getElementById("swapPanelsBtn").disabled = false;
    abbrevElement.style.display = "none";
    return;
  }

  if(!modalShown) {
    showDisclaimer();
  } else {
    togglePopup("panelPopup");
    // Modal already shown, just load the translation
    //document.getElementById("swapPanelsBtn").disabled = true;
    abbrevElement.style.display = "block";
    await loadTranslation(selected);
  }
});

// Extract translation loading logic for reuse
async function loadTranslation(selected) {
  if (debugMode) console.log("loadTranslation()");
  const params = new URLSearchParams(window.location.search);
  const path = params.get("db") === "basex" ? translationsx[selected] : translations[selected];

  searchState[currentPanelId] = {
    term: null,         
    exactMatch: null,
    contextCount: 0,    
    page: 0,          
    pageSize: 10,    
    boundaries: [0]     
  };

  const cacheKey = `translation_${selected}${params.get("db")==="basex" ? "_x" : ""}`;
  const versionKey = `${cacheKey}_version`;

  let cached = await idbGet(cacheKey);
  let localVersion = await idbGet(versionKey);
  let serverVersion = null;

  // --- try getting server version (only if online) ---
  if (navigator.onLine) {
    try {
      const vRes = await fetch("alt/datadates.json", { cache: "no-store" });
      if (vRes.ok) {
        const versions = await vRes.json();
        serverVersion = versions[selected] ?? null;
        console.log(`${selected} server version:`, serverVersion);
      }
    } catch {
      console.log(`${selected} version check failed — assuming offline or blocked.`);
    }
  }

  // --- CASE 1: offline or version unknown ---
  if (!serverVersion) {
    if (cached) {
      compData = cached;
      console.log(`Loaded ${selected} from cache (offline or no manifest)`);
    } else {
      console.warn(`No cached ${selected} available and cannot check version (offline or no manifest)`);
      showToast("Failed to load translation. Falling back to GHT.");
      select.value = "none";
      document.getElementById("translationAbbrev").style.display = "none";
      changeAltTranslation();
      return;
    }
  } else if (cached && localVersion === serverVersion) { // --- CASE 2: cached + up to date ---
    compData = cached;
    console.log(`Loaded ${selected} from cache (version ${localVersion})`);

  } else {
    try { // --- CASE 3: fetch from server ---
      const response = await fetch(path);
      compData = await response.json();

      console.log(`Fetched ${selected} from server`);

      await idbSet(cacheKey, compData);
      if (serverVersion)
        await idbSet(versionKey, serverVersion);

      console.log(`Cached ${selected} locally (version ${serverVersion ?? "unknown"})`);

    } catch (err) {
      console.warn(`Fetch failed for ${selected}`);

      if (cached) {
        compData = cached;
        console.log(`Fallback to cached ${selected}`);
      } else {
        console.error(`No cached ${selected} available`);
        compData = null;
      }
    }
  }
  
  if (!elements.horizPanel.checked && !elements.vertPanel.checked) {
    elements.horizPanel.checked = true;
    setMode("init");
  }

  changeAltTranslation();
}

// Indexed DB helpers

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("TranslationDB", 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore("translations");
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDB();
  const tx = db.transaction("translations", "readwrite");
  tx.objectStore("translations").put(value, key);
  return tx.complete;
}

async function idbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("translations", "readonly");
    const req = tx.objectStore("translations").get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Load initial data from server.
loadBaseJson();
