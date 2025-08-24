const greekToUnicode = {
  a: 'α', b: 'β', g: 'γ', d: 'δ',
  e: 'ε', z: 'ζ', h: 'η', u: 'θ',
  i: 'ι', k: 'κ', l: 'λ', m: 'μ',
  n: 'ν', j: 'ξ', o: 'ο', p: 'π',
  r: 'ρ', s: 'σ', w: 'ς', t: 'τ',
  y: 'υ', f: 'φ', x: 'χ', c: 'ψ',
  v: 'ω'
};

const posMap = {
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
  'PPro': 'personal/possessive pronoun',
  'RecPro': 'reciprocal pronoun',
  'RelPro': 'relative pronoun',
  'RefPro': 'reflexive pronoun',
  'Heb': 'Hebrew word',
  'Aram': 'Aramaic word'
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
  "Tit", "Phlm", "Heb", "James", "1Pet",
  "2Pet", "1Jon", "2Jon", "3Jon", "Jude", "Rev"
];

function toGreek(str) {
  if (!str || str.trim() === "") return "&nbsp;";
  return str.replace(/[a-z]/g, c => greekToUnicode[c] || c);
}

function toLatin(str) {
  return str.toLowerCase().split('').map(ch => greekToLatin[ch] || ch).join('');
}

// Options popups.
function togglePopup(id) {
  // Close any open popups first
  document.querySelectorAll('.popup').forEach(p => {
    if (p.id !== id) p.style.display = 'none';
  });

  const popup = document.getElementById(id);
  popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';

  // Optional: reposition near the button that triggered it
  const button = document.querySelector(`button[onclick="togglePopup('${id}')"]`);
  if (popup.style.display === 'block' && button) {
    const rect = button.getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  }
}

function toggleHelpPopup(pop, but) {
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
  const files = ["ght-i.html", "styles.css", "script.js"];
  const dates = await Promise.all(files.map(f => getLastModified(f)));
  const latest = dates.filter(d => d).sort((a,b) => b - a)[0]; // newest first

  if (latest) {
    const formatted = latest.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    const time = latest.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit'
    });
    document.getElementById("tool_last_updated").textContent = `${formatted} ${time}`;
  } else {
    document.getElementById("tool_last_updated").textContent = "unknown";
  }
}

// Run it
updateToolLastUpdated();

let baseData; // This will hold the base JSON data loaded from base.json
let lookupdb; // This will hold the lookup data loaded from lookups.json
// Main initialization function
function loadBaseJson() {
  const params = new URLSearchParams(window.location.search);
  const dbName = params.get("db") === "basex" ? "basex.json" : "base.json";

  const baseUrl = dbName + '?t=' + Date.now();
  const lookupUrl = 'lookups.json?t=' + Date.now();

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
    setupEventListeners();
    if (currentRender === "search") {
      searchVerses();
    } else {
      render();
    }
    getCount();
  })
  .catch(err => {
    console.error("Error loading JSON files:", err);
  });
}

function getCount() {
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
          if (word.ident !== -1) countWithIdent++;
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
  if (currentRender === "search") {
    // We are showing search results, so re-run search to apply filters
    searchVerses();
  } else {
    // Default render mode
    render();
  }
};

let restoring = false;
const historyStack = [];
let historyIndex = -1;

function saveState() {
  if (restoring) return;
  const state = {};
  Object.keys(elements).forEach(id => {
    const el = elements[id];
    if (!el) return;

    if (el.type === "checkbox") state[id] = el.checked;
    else state[id] = el.value;
  });

  // Remove “future” states if not at the end
  if (historyIndex < historyStack.length - 1) {
    historyStack.splice(historyIndex + 1);
  }

  // Push new state
  historyStack.push({ state, currentRender });
  historyIndex++;

  // Limit to 100
  if (historyStack.length > 100) {
    historyStack.shift();
    historyIndex--;
  }
}

function getSizeBytes(obj) {
  return new TextEncoder().encode(JSON.stringify(obj)).length;
}

// Example
// console.log("historyStack size (bytes):", getSizeBytes(historyStack));

function loadState(index) {
  if (index < 0 || index >= historyStack.length) return;
  restoring = true;
  const { state, currentRender: renderMode } = historyStack[index];

  Object.keys(state).forEach(id => {
    const el = elements[id];
    if (!el) return;

    if (el.type === "checkbox") el.checked = state[id];
    else el.value = state[id];
  });

  historyIndex = index;

  // Trigger appropriate re-run
  if (renderMode === "search") searchVerses();
  else render();
  restoring = false;
}

function historyBack() { loadState(historyIndex - 1); }
function historyForward() { loadState(historyIndex + 1); }

// Called only after baseData is loaded
function setupEventListeners() {
  // Helper for start/end selectors
  const rangeSelectors = [
    { book: "bookStart", chapter: "chapterStart", verse: "verseStart", type: "start" },
    { book: "bookEnd", chapter: "chapterEnd", verse: "verseEnd", type: "end" }
  ];

  rangeSelectors.forEach(({ book, chapter, verse, type }) => {
    elements[book].addEventListener("change", () => {
      lastChanged = type;
      const b = +elements[book].value;
      populateChapters(b, elements[chapter]);
      elements[chapter].value = 0;
      populateVerses(b, 0, elements[verse]);
      elements[verse].value = 0;
      adjustSelections();
      render();
    });

    elements[chapter].addEventListener("change", () => {
      lastChanged = type;
      const b = +elements[book].value;
      const c = +elements[chapter].value;
      populateVerses(b, c, elements[verse]);
      elements[verse].value = 0;
      adjustSelections();
      render();
    });

    elements[verse].addEventListener("change", () => {
      lastChanged = type;
      adjustSelections();
      render();
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
    } else render();
  });

  elements.enforceGap.addEventListener("change", () => {
    lastChanged = "start";
    adjustSelections();
    render();
  });

  // For checkboxes that trigger onOptionsChange
  [
    "showGreek", "showEnglish", "showPcode", "showVerses",
    "showStrongs", "showRoots", "newlineAfterVerse", "reverseInterlinear", "highlightSearch", "searchSize"
  ].forEach(id => {
    elements[id].addEventListener("change", onOptionsChange);
  });

  // For checkboxes or inputs that trigger searchVerses
  [
    "searchBtn", "centerRange", "showContext", "exactMatch",
    "uniqueWords", "ordered", "adjacent", "normalized"
  ].forEach(id => {
    const el = elements[id];
    const event = id === "searchBtn" ? "click" : "change";
    el.addEventListener(event, searchVerses);
  });

  elements.searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      searchVerses();
    }
  });

  elements.searchInput.addEventListener("input", function (e) {
    if (!elements.convertToGreek.checked) return;

    const input = e.target;
    const originalValue = input.value;

    // Convert using latinToGreek
    let converted = "";
    for (const char of originalValue.toLowerCase()) {
      converted += latinToGreek[char] || char;  // fall back to original if no match
    }

    // Avoid cursor jumping by replacing only if different
    if (converted !== originalValue) {
      input.value = converted;
    }
  });

  window.addEventListener('click', function (e) {
    const isMenuPopup = e.target.closest('.menu-popup');
    const isMenuToggleButton = e.target.matches('button[data-toggle-popup]');

    if (!isMenuPopup && !isMenuToggleButton) {
      document.querySelectorAll('.menu-popup').forEach(p => {
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

  document.getElementById("historyBackBtn").addEventListener("click", historyBack);
  document.getElementById("historyForwardBtn").addEventListener("click", historyForward);
}

// Dropdown setup
function populateBookDropdowns() {
  elements.bookStart.innerHTML = "";
  elements.bookEnd.innerHTML = "";
  bookNames.forEach((name, i) => {
    if (!baseData[i] || baseData[i].length === 0) return; // Skip books with no chapters
    elements.bookStart.add(new Option(name, i));
    elements.bookEnd.add(new Option(name, i));
  });
}
function populateChapters(bookIndex, chapterSelect) {
  chapterSelect.innerHTML = "";
  const numChapters = baseData[bookIndex]?.length || 0;
  for (let i = 0; i < numChapters; i++) {
    chapterSelect.add(new Option(i + 1, i));
  }
}
function populateVerses(bookIndex, chapterIndex, verseSelect) {
  verseSelect.innerHTML = "";
  const numVerses = baseData[bookIndex]?.[chapterIndex]?.length || 0;
  for (let i = 0; i < numVerses; i++) {
    verseSelect.add(new Option(i + 1, i));
  }
}

function initializeSelections() {
  populateBookDropdowns();

  const range = getUrlRange();

  const settings = JSON.parse(localStorage.getItem("userSettings"));

  if (settings) {
    for (const [key, value] of Object.entries(settings)) {
      const el = elements[key] || document.getElementById(key);
      if (!el) continue;

      if ("checked" in el) {
        el.checked = value;
      } else if ("value" in el) {
        el.value = value;
      }
    }
  }

  if (range?.gapInput > 0) {
    elements.gapInput.value = range.gapInput;
  } else if (settings?.gapInput > 0) {
    elements.gapInput.value = settings.gapInput;
  } else {
    elements.gapInput.value = Math.floor(Math.random() * (20 - 2 + 1)) + 2; // random 2–20
  }

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
}

// Helper function to pad numbers for url encoding
function pad (n, len = 3) {
  return (n+1).toString().padStart(len, '0');
}
function getUrlRange() {
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
}

// URL Search Save
function saveUrlSearch() {
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
}

function resetUrl() {
  const baseUrl = window.location.origin + window.location.pathname;
  const newUrl = `${baseUrl}`;
  // Copy to clipboard
  navigator.clipboard.writeText(newUrl)
    .then(() => showToast("URL copied to clipboard!"))
    .catch(err => alert("Failed to copy URL: " + err));
  window.history.replaceState(null, "", newUrl);
}

function applyUrlSearch() {
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

  currentRender = "search";
}

function showToast(message, duration = 2000) {
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

function addVerses(b, c, v, delta) {
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
          if (b >= baseData.length) {
            b = baseData.length - 1;
            c = baseData[b].length - 1;
            v = baseData[b][c].length - 1;
            break;
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
            b = 0;
            c = 0;
            v = 0;
            break;
          } else {
            c = baseData[b].length - 1;
          }
        }
        v = baseData[b][c].length - 1;
      }
      delta++;
    }
  }
  return [b, c, v];
}

function adjustSelections() {
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
  "same": ["oyton"],
  "time": ["xronon"],
  "us": ["hmaw"],
  "you": ["ymas"],
  "[not]": [""]
};
function processUnderscoreWord(eng, grk, lookupUnderscore) {
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

function getDisplayOptions() {
  return {
    showGreek: elements.showGreek.checked,
    showEnglish: elements.showEnglish.checked,
    showPcode: elements.showPcode.checked,
    showStrongs: elements.showStrongs.checked,
    showRoots: elements.showRoots.checked
  };
}

let currentRender = "reference"; // used to track current rendering mode, changed in render()
function render(customVerses = null) {
  if (customVerses && Array.isArray(customVerses)) {
    currentRender = "search";
  } else {
    currentRender = "reference";
  }
  saveState()
  const container = document.getElementById("output");
  container.innerHTML = "";

  const { showGreek, showEnglish, showPcode, showStrongs, showRoots } = getDisplayOptions();
  let showVerses = elements.showVerses.checked;
  const reverseInterlinear = elements.reverseInterlinear.checked;
  const newlineAfterVerse = elements.newlineAfterVerse.checked;

  let passUnderscore = null;
  let countContext = 0;
  let contextBool = true;
  let verseEl = null;

  // Check for custom input (either word list or verse list)
  if (customVerses && Array.isArray(customVerses)) {
    if (searchState.boundaries.length > 1) {
      const backBtn = document.createElement("button");
      backBtn.id = "pageBackBtn";
      backBtn.title = "Previous Search Results Page";
      backBtn.textContent = "← Page";
      backBtn.onclick = prevPage;

      const forwardBtn = document.createElement("button");
      forwardBtn.id = "pageForwardBtn";
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

    const isWordList = Array.isArray(customVerses[0]) && customVerses[0].length === 3;
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
      if (showStrongs) headerHTML += `<span class="col reference">Strongs</span>`;
      if (showRoots)   headerHTML += `<span class="col reference">Roots</span>`;

      header.innerHTML = headerHTML;
      wrapper.appendChild(header);

      // Add data rows
      customVerses.forEach(([ident, eng, ref]) => {
        const row = document.createElement("div");
        row.className = "word-row";

        let grk = "", pcode = "", strongs = "", roots = "", cEng = "", count = 0;

        if (typeof ident === "string" && /^[A-Za-z]+$/.test(ident)) {
          // ident is actually the greek word from LXX auto-fill.
          grk = ident;
        } else {
          // ident is numeric, get data from lookupdb
          const lookupData = lookupdb[ident] || [];   
          [grk, pcode, strongs, roots, cEng, count] = lookupData;
        }

        if (ref !== "") {
          // Reference column (no popup)
          const refEl = document.createElement("span");
          refEl.className = "col ref";
          refEl.textContent = ref;

          // Make clickable
          refEl.style.cursor = "pointer";
          refEl.addEventListener("click", () => {
            elements.searchInput.value = ref;
            searchVerses();
          });

          row.appendChild(refEl);
        }

        // Helper for popup-enabled columns
        const makePopupCell = (className, content, isRoot = false) => {
          const span = document.createElement("span");
          span.className = `col ${className}`;
          span.innerHTML = content;

          span.dataset.grk = grk || "";
          span.dataset.pEng = eng || "";
          span.dataset.pcode = pcode || "";
          span.dataset.strongs = strongs || "";
          span.dataset.roots = roots || "";
          span.dataset.count = count || "";

          span.addEventListener("mouseenter", showPopup);
          span.addEventListener("mouseleave", hidePopup);
          span.addEventListener("touchstart", showPopupTouchStart);
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

        // Conditionally add selected columns
        if (showGreek)   row.appendChild(makePopupCell("greek", toGreek(grk)));
        if (showEnglish) row.appendChild(makePopupCell("english", eng || ""));
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

        wrapper.appendChild(row);
      });

      container.appendChild(wrapper);
      return;
    }

    // Default verse-style rendering
    showVerses = true;
    customVerses.forEach(({ book, chapter, verse, verseData }) => {
      if (book !== -1) {
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
          verseEl
        ));
      } else {
        // Skip rendering but still increment context counter
        countContext++;
      }
    });
    return;
  }

  // Otherwise, existing logic with user-selected start/end refs
  const bookStart = parseInt(elements.bookStart.value);
  const chapterStart = parseInt(elements.chapterStart.value);
  const verseStart = parseInt(elements.verseStart.value);
  const bookEnd = parseInt(elements.bookEnd.value);
  const chapterEnd = parseInt(elements.chapterEnd.value);
  const verseEnd = parseInt(elements.verseEnd.value);
  
  contextBool = false;

  let lastBook = null;
  let lastChapter = null;

  for (let b = bookStart; b <= bookEnd; b++) {
    if (!baseData[b]) continue;
    const cStart = (b === bookStart) ? chapterStart : 0;
    const cEnd = (b === bookEnd) ? chapterEnd : baseData[b].length;

    for (let c = cStart; c <= cEnd; c++) {
      if (!baseData[b][c]) continue;
      const vStart = (b === bookStart && c === chapterStart) ? verseStart : 0;
      const vEnd = (b === bookEnd && c === chapterEnd) ? verseEnd : baseData[b][c].length;

      for (let v = vStart; v <= vEnd; v++) {
        const verseData = baseData[b][c][v];
        if (!verseData) continue;

        ({ passUnderscore, countContext } = renderSingleVerse(container, b, c, v, verseData, {
          showVerses,
          reverseInterlinear,
          passUnderscore,
          countContext,
          contextBool
        }));
      }
    }
  }
}

function createClickableSpan(className, text, wordEl) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;

  span.addEventListener("click", (e) => {
    const isPopupActive = wordEl === currentPopup;
    const timeSincePopup = Date.now() - popupActivatedAt;

    if (isPopupActive && timeSincePopup > 200) {
      const term = span.dataset.search || span.textContent.trim();
      elements.searchInput.value = term;
      searchVerses();
    }
  });

  return span;
}

function renderSingleVerse(container, book, chapter, verse, verseData, options, verseElin = null) {
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
  let verseEl = null;
  if (verseElin) {
    verseEl = verseElin;
  } else if (newlineAfterVerse || contextBool) {
    verseEl = document.createElement("div");
    verseEl.className = "verse";
  } else {
    verseEl = container;
  }
  let verseRange = parseInt(elements.gapInput.value, 10);

  if (showVerses) {
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
    labelEl.style.cursor = "pointer";
    labelEl.addEventListener("click", () => {
      elements.searchInput.value = fullLabel;
      searchVerses();
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
    const [ident, eng, num] = verseWords[i]; //Refactor dropped grk
    const wordEl = document.createElement("span");
    wordEl.className = "word";

    let grk, pcode, strongs, roots, rEng, count;
    let lookupData = [];

    if (Number.isInteger(ident) && ident !== -1) { //Refactor moved this block earlier.
      // Normal case: lookup by ident
      lookupData = lookupdb[ident] || [];
      [grk, pcode, strongs, roots, rEng, count] = lookupData; //Refactor added grk to beginning.
    } else if (ident != -1) {
      grk = ident;
      // ident is blank → collect ALL entries for this grk
      const matches = Object.entries(lookupdb)
      .filter(([, val]) => val[0] === ident) // compare against Greek in val[0]
      .map(([, val]) => val);

      if (matches.length > 0) {
        const pcodeSet = new Set();
        const strongsSet = new Set();
        const rootsSet = new Set();
        const rEngSet = new Set();
        let totalCount = 0;

        for (const [_, pc, st, rt, re, ct] of matches) {
          if (pc) pcodeSet.add(pc);
          if (st) strongsSet.add(st);
          if (rt) rootsSet.add(rt);
          if (re) rEngSet.add(re);
          if (ct) totalCount += ct || 0;
        }

        pcode = [...pcodeSet].join(", ");
        strongs = [...strongsSet].join(", ");
        roots = [...rootsSet].join(", ");
        rEng = [...rEngSet].join(", ");
        count = totalCount;
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

    if (elements.highlightSearch.checked && elements.searchInput.value.trim() !== "") {
      const searchTerms = elements.searchInput.value.trim().split(/\s+/);
      let matched = false;

      for (const term of searchTerms) {
        // check each variable against this term
        if (
          matchesLookup(term, lookupData) || 
          (
            pEng &&
            (elements.exactMatch.checked 
              ? pEng.toLowerCase() === term.toLowerCase()
              : pEng.toLowerCase().includes(term.toLowerCase())) 
          )
        ) {
          matched = true;
          wordEl.classList.add("highlightSearch");
          break; // no need to keep checking once we found a match
        }
      } 
    }

    wordEl.dataset.grk = grk || "";
    wordEl.dataset.pEng = pEng || "";
    wordEl.dataset.cEng = cEng || "";
    wordEl.dataset.rEng = rEng || "";
    wordEl.dataset.pcode = pcode || "";
    wordEl.dataset.strongs = strongs || "";
    wordEl.dataset.roots = roots || "";
    wordEl.dataset.count = count || "";

    wordEl.addEventListener("mouseenter", showPopup);
    wordEl.addEventListener("mouseleave", hidePopup);
    wordEl.addEventListener("touchstart", showPopupTouchStart);
    wordEl.addEventListener("touchend", showPopupTouchEnd);

    let hasContent = false;

    if (showStrongs && strongs) {
      wordEl.appendChild(createClickableSpan("pcode", strongs, wordEl));
      hasContent = true;
    } else if (showStrongs) {
      // Add a non-clickable space span for layout consistency
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan);
    }

    if (showPcode && pcode) {
      wordEl.appendChild(createClickableSpan("pcode", pcode, wordEl));
      hasContent = true;
    } else if (showPcode) {
      // Add a non-clickable space span for layout consistency
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan);
    }

    if (showGreek && grk) {
      wordEl.appendChild(createClickableSpan("grk", toGreek(grk), wordEl));
      hasContent = true;
    } else if (showGreek) {
      // Add a non-clickable space span for layout consistency
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan);
    }

    if (showEnglish && pEng) {
      wordEl.appendChild(createClickableSpan("eng", pEng, wordEl));
      hasContent = true;
    } else if (showEnglish) {
      // Add a non-clickable space span for layout consistency
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan);
    }

    if (showRoots && roots) {
      const rootParts = roots.split(',').map(r => r.trim());

      // Container for the first root
      const firstContainer = document.createElement('span');
      firstContainer.className = 'roots';
      firstContainer.style.whiteSpace = 'nowrap';

      const firstSpan = createClickableSpan("roots", toGreek(rootParts[0]) + (rootParts.length > 1 ? ':' : ''), wordEl);
      firstSpan.dataset.search = '.' + toGreek(rootParts[0]);
      firstContainer.appendChild(firstSpan);
      wordEl.appendChild(firstContainer);

      // Container for remaining roots
      const secondContainer = document.createElement('span');
      secondContainer.className = 'roots';
      secondContainer.style.whiteSpace = 'nowrap';

      if (rootParts.length > 1) {
        const remainingRoots = rootParts.slice(1);
        remainingRoots.forEach((r, i) => {
          const text = toGreek(r) + (i < remainingRoots.length - 1 ? ',' : '');
          const span = createClickableSpan("roots", text, wordEl);
          span.dataset.search = '.' + toGreek(r);
          secondContainer.appendChild(span);
        });
      } else {
        // Add blank space for layout consistency
        const spaceSpan = document.createElement('span');
        spaceSpan.textContent = '\u00A0';
        secondContainer.appendChild(spaceSpan);
      }

      wordEl.appendChild(secondContainer);
      hasContent = true;
    } else if (showRoots) {
      // Add a non-clickable space span for layout consistency
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan);
      const spaceSpan2 = document.createElement('span');
      spaceSpan2.textContent = '\u00A0';
      wordEl.appendChild(spaceSpan2);
    }

    if (hasContent) {
      verseEl.appendChild(wordEl);
    }
  }

  localCountContext += 1;

  if (newlineAfterVerse) {
    container.appendChild(verseEl);
    verseEl = null;

    if (contextBool) {
      if (localCountContext === verseRange) {
        const separator = document.createElement('hr');
        separator.classList.add('search-separator');
        container.appendChild(separator);

        localCountContext = 0;
      }
    } else {
      localCountContext = 0;
    }

  } else if (contextBool && localCountContext === verseRange) {
    container.appendChild(verseEl);
    verseEl = null;

    const separator = document.createElement('hr');
    separator.classList.add('search-separator');
    container.appendChild(separator);

    localCountContext = 0;
  }

  return {
    passUnderscore: localPassUnderscore, countContext: localCountContext, verseEl
  };
}

function positionPopupRelativeToElement(popup, targetEl) {
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
function showPopup(e) {
  currentPopup = e.currentTarget;
  popupActivatedAt = Date.now();  // Track when it was shown
  clearTimeout(popupTimeout);
  const { showGreek, showEnglish, showPcode, showStrongs, showRoots } = getDisplayOptions();

  const target = e.currentTarget || e.target;
  const popup = document.getElementById("wordPopup");
  const wordEl = e.currentTarget || e.target;

  const grk = target.dataset.grk || "";
  const pEng = target.dataset.pEng || "";
  const cEng = target.dataset.cEng || "";
  const pcode = target.dataset.pcode || "";
  const strongs = target.dataset.strongs || "";
  const rootsRaw = target.dataset.roots || "";
  const count = target.dataset.count || "";

  const grkDisplay = toGreek(grk);
  const rootsDisplay = toGreek(rootsRaw);

  // Helper to wrap values with clickable spans and add data attribute for searching
  function clickableLine(label, value) {
    if (!value) return '';
    return `<strong>${label}:</strong> <span class="popup-clickable" data-search="${value}">${value}</span><br>`;
  }

  let popupContent = '';

  if (!showGreek) {
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
    popupContent += clickableLine("Strong's", strongs);
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

  if (!pEng && target.dataset.rEng) {
    popupContent += '<strong>Translations:</strong> ' + target.dataset.rEng + '<br>';
  }

  if (popupContent.endsWith('<br>')) {
    popupContent = popupContent.slice(0, -4);
  }

  if (popupContent.length === 0) {
    popupContent = "[No info]"
  }

  popup.innerHTML = popupContent;

  // Add click listener to the popup for only clickable spans
  popup.querySelectorAll('.popup-clickable').forEach(span => {
    span.addEventListener('click', (event) => {
      event.stopPropagation(); // prevent other click handlers
      const text = event.target.dataset.search.trim();
      if (text) {
        elements.searchInput.value = text;
        searchVerses();
      }
    });
  });

  positionPopupRelativeToElement(popup, wordEl);
  popup.style.display = "block";
}
function hidePopup() {
  popupTimeout = setTimeout(() => {
    document.getElementById("wordPopup").style.display = "none";
  }, 300); // small delay to allow hovering over popup
  currentPopup = null;
  popupActivatedAt = 0; // Reset activation time
}
function cancelHidePopup() {
  clearTimeout(popupTimeout);
}

let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
const TAP_MAX_TIME = 300;  // Max ms for tap
const TAP_MAX_DIST = 10;   // Max px for movement
function showPopupTouchStart(e) {
  const touch = e.touches[0];
  touchStartTime = Date.now();
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}
function showPopupTouchEnd(e) {
  const touch = e.changedTouches[0];
  const elapsed = Date.now() - touchStartTime;
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (elapsed < TAP_MAX_TIME && distance < TAP_MAX_DIST) {
    const popup = document.getElementById("wordPopup");
    const isVisible = window.getComputedStyle(popup).display !== "none";

    if (isVisible) {
      popup.style.display = "none";
    } else {
      showPopup(e);  // You must make sure showPopup sets style.display = "block"
    }
  }
}

function saveSettings() {
  const settings = {};

  for (const [key, el] of Object.entries(elements)) {
    if (!el) continue;

    if ("checked" in el) {
      settings[key] = el.checked;
    } else if ("value" in el) {
      settings[key] = el.value;
    }
  }

  localStorage.setItem("userSettings", JSON.stringify(settings));
}

function resetSettings() {
  localStorage.removeItem("userSettings");
  location.reload();
}

function parseMorphTag(tag) {
  const tenseMap = {
    'P': 'present', 'I': 'imperfect', 'F': 'future', 'A': 'aorist',
    'R': 'perfect', 'L': 'pluperfect'
  };

  const moodMap = {
    'I': 'indicative', 'S': 'subjunctive', 'O': 'optative',
    'M': 'imperative', 'N': 'infinitive', 'P': 'participle'
  };

  const voiceMap = {
    'A': 'active', 'M': 'middle', 'P': 'passive', 'E': 'middle/passive',
    'D': 'middle or passive'
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
  const caseMap = {
    'N': 'nominative', 'G': 'genitive', 'D': 'dative',
    'A': 'accusative', 'V': 'vocative', 'B': 'accusative/nominative',
    'C': 'accusative/nominative/vocative', 'Q': 'nominative/vocative'
  };

  const genderMap = {
    'M': 'masculine', 'F': 'feminine', 'N': 'neuter', '~': 'any gender', 
    'H': 'masculine/feminine', 'W': 'masculine/neuter'
  };

  const personMap = {
    '1': 'first person', '2': 'second person', '3': 'third person',
    '4': 'first/third person'
  };

  const numberMap = {
    'S': 'singular', 'P': 'plural'
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

function matchMorphTag(pattern, tag) {
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
  if (patParts[0] !== tagParts[0]) return false;

  // Helper to match a segment character-by-character
  function matchSegment(patSeg, tagSeg) {
    patSeg = patSeg || "";
    tagSeg = tagSeg || "";

    // Segment-level wildcard
    if (patSeg === "*" || patSeg === "-*") return true;

    let p = 0, t = 0;
    while (p < patSeg.length) {
      if (patSeg[p] === "*") {
        // Match one character if available, otherwise zero
        if (t < tagSeg.length) t++;
        p++;
        continue;
      }

      // Regular character match
      if (tagSeg[t] === undefined || patSeg[p].toUpperCase() !== tagSeg[t].toUpperCase()) {
        return false;
      }

      p++; t++;
    }

    // All pattern consumed; extra characters in tag are allowed only if last pat char was *
    if (t < tagSeg.length) return false;

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

// Helper: parse a reference string into book/chapter/verse indices
function tryParseReference(refString) {
  const parts = refString.trim().split(/\s+/);
  if (parts.length === 0) return null;

  const bookName = parts[0];
  const b = bookAbb.findIndex(bk => bk.toLowerCase() === bookName.toLowerCase());
  if (b === -1) return null;

  let c = 0, v = 0;
  if (parts.length > 1) {
    const chapterVerse = parts[1].split(':');
    c = parseInt(chapterVerse[0], 10) - 1 || 0;
    v = parseInt(chapterVerse[1], 10) - 1 || 0;
  }
  return { b, c, v };
}

// Function to check if term is a possible match
function lookInLookups(term) {
  if (!term) return false;

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
  let verseRange = parseInt(elements.gapInput.value, 10) || 1;
  const centerRange = elements.centerRange.checked;
  const results = [];

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
      const [nb, nc, nv] = addVerses(b, c, v, offset);

      // Check if verse is valid
      if (baseData[nb]?.[nc]?.[nv]) {
        results.push({
          book: nb,
          chapter: nc,
          verse: nv,
          verseData: baseData[nb][nc][nv]
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
    if (baseData[b]?.[c]?.[v]) {
      results.push({ book: b, chapter: c, verse: v, verseData: baseData[b][c][v] });
    } else {
      results.push({ book: -1, chapter: -1, verse: -1, verseData: [] });
    }
  }

  return results;
}

function forEachVerse(callback) {
  for (let b = 0; b < baseData.length; b++) {
    if (!baseData[b]) continue;
    for (let c = 0; c < baseData[b].length; c++) {
      if (!baseData[b][c]) continue;
      for (let v = 0; v < baseData[b][c].length; v++) {
        const verseData = baseData[b][c][v];
        if (!verseData) continue;
        callback(b, c, v, verseData);
      }
    }
  }
}

let searchState = {
  term: null,         // current search term
  page: 0,            // current page index
  pageSize: 10,      // max results per page
  boundaries: [0]      // array of indexes where each page starts (0, x, y, …)
};

function searchVerses() {
  const searchTerm = elements.searchInput.value.trim();
  const exact = elements.exactMatch.checked;
  const showContext = elements.showContext.checked;
  const uniqueWords = elements.uniqueWords.checked;
  const normalized = elements.normalized.checked;
  const container = document.getElementById('output');
  container.innerHTML = ''; // clear existing output

  if (!searchTerm) {
    container.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  // Reset state if new term
  if (searchTerm !== searchState.term || parseInt(elements.searchSize.value) !== searchState.pageSize) {
    searchState = {
      term: searchTerm,
      page: 0,
      pageSize: parseInt(elements.searchSize.value),
      boundaries: [0]
    };
  }

  // Reference search
  const ref = tryParseReference(searchTerm);
  if (ref) {
    setReferenceRange(ref);
    render();
    return;
  }

  if (searchTerm.includes(" ") || showContext) {
    const matches = multiWordSearch(searchTerm);
    
    if (matches.length === 0) {
      container.innerHTML = `<p>No verses found containing "${searchTerm}".</p>`;
      return;
    }
    
    render(matches);
    return;
  }

  // All below should now only return the word list. 

  const matches = [];
  let inLookups = lookInLookups(searchTerm);

  // Case: Latin, not in lookups, and not normalized → raw term search
  if (!/[α-ω]/i.test(searchTerm) && !inLookups && !normalized && !uniqueWords) {
    handleWordMatches(searchTerm, matches);
  } else {
    handleLookupMatches(searchTerm, matches);
  }

  if (matches.length === 0) {
    container.innerHTML = `<p>No verses found containing "${searchTerm}".</p>`;
    return;
  }

  render(matches);
}

function setReferenceRange({ b, c, v }) {
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
  const uniqueWords = elements.uniqueWords.checked;

  // figure out paging bounds
  const startIndex = searchState.boundaries[searchState.page];
  const endIndex = startIndex + elements.searchSize.value * 10;

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

  if (morphMatches.length === 0) return;

  // if we're in uniqueWords mode we’re done
  if (uniqueWords) {
    // add boundary marker if we have more than one page
    if (searchState.boundaries.length <= searchState.page + 1 && count > endIndex) {
      searchState.boundaries.push(endIndex);
    }
    return;
  }

  forEachVerse((b, c, v, verseData) => {
    verseData.forEach(([ident, eng]) => {
      if (morphMatches.includes(ident)) {
        if (count >= startIndex && count < endIndex) {
          matches.push([ident, eng, `${bookAbb[b]} ${c + 1}:${v + 1}`]);
        }
        count++;
      }
    });
  });

  // add boundary marker if needed
  if (searchState.boundaries.length <= searchState.page + 1 && count > endIndex) {
    searchState.boundaries.push(endIndex);
  }
}

function handleWordMatches(term, matches) {
  const exact = elements.exactMatch.checked;
  const searchTerm = term.toLowerCase();

  const startIndex = searchState.boundaries[searchState.page];
  const endIndex = startIndex + elements.searchSize.value * 10;

  let count = 0;

  forEachVerse((b, c, v, verseData) => {
    verseData.forEach(([ident, eng]) => {
      const word = (eng || "").toLowerCase();
      const isMatch = exact ? word === searchTerm : word.includes(searchTerm);

      if (isMatch) {
        if (count >= startIndex && count < endIndex) {
          matches.push([ident, eng, `${bookAbb[b]} ${c + 1}:${v + 1}`]);
        }
        count++;
      }
    });
  });

  // update boundaries if we need a new page marker
  if (searchState.boundaries.length <= searchState.page + 1 && count > endIndex) {
    searchState.boundaries.push(endIndex);
  }

}

function nextPage() {
  if (searchState.page + 1 < searchState.boundaries.length) {
    searchState.page++;
    searchVerses();
  }
}

function prevPage() {
  if (searchState.page > 0) {
    searchState.page--;
    searchVerses();
  }
}

function checkWordSequence(allWords, latinWords, isGreek, matchIdent = false) {
  const exact = elements.exactMatch.checked;
  const normalized = elements.normalized.checked;
  const ordered = elements.ordered.checked;       // new checkbox for ordered matching
  const adjacent = elements.adjacent.checked;     // new checkbox for adjacent matching
  if (!latinWords || latinWords.length === 0) return false;

  const normalizedWords = allWords.map(({ wordData }) => {
    return wordData; // Extract wordData from allWords tokens
  });

  // Helper to test if a verse word matches a search word index
  function tokenMatchesWord(tokenVal, searchWord) {
    if (!tokenVal || !searchWord) return false;

    // searchWord is now either an array of idents or a single latin word.
    if (Array.isArray(searchWord)) {
      return searchWord.includes(tokenVal[0]);
    } else {
      let lowerToken = tokenVal[1].toLowerCase();
      return exact ? (lowerToken === searchWord) : lowerToken.includes(searchWord);
    }
  }

  // Case 1: unordered, non-adjacent (just presence)
  if (!ordered && !adjacent) {
    // Check that every search word appears somewhere in any order
    const matchedIndices = [];
    for (let wi = 0; wi < latinWords.length; wi++) {
      const sw = latinWords[wi];
      const idx = normalizedWords.findIndex((nw, i) => tokenMatchesWord(nw, sw) && !matchedIndices.includes(i));
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
        if (!tokenMatchesWord(normalizedWords[start + offset], latinWords[offset])) {
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
        if (tokenMatchesWord(normalizedWords[i], sw)) {
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
      // Check if this window contains all search words (any order)
      const wordsFound = new Set();
      windowWords.forEach(w => {
        for (let wi = 0; wi < n; wi++) {
          if (tokenMatchesWord(w, latinWords[wi])) {
            wordsFound.add(wi);
          }
        }
      });
      if (wordsFound.size === n) {
        // Return the window indices as consecutive array
        return Array.from({ length: n }, (_, i) => start + i);
      }
    }
    return false;
  }

  return false; // no match
}

function multiWordSearch(searchStr, lookupInd) {
  const exact = elements.exactMatch.checked;
  const reverseInterlinear = elements.reverseInterlinear.checked;
  const ordered = elements.ordered.checked;       // new checkbox for ordered matching
  const adjacent = elements.adjacent.checked;     // new checkbox for adjacent matching
  const normalized = elements.normalized.checked;
  const terms = searchStr.trim().split(/\s+/);

  // figure out paging bounds
  const startIndex = searchState.boundaries[searchState.page];
  const pageSize = parseInt(elements.searchSize.value, 10) || 0;
  const gap      = parseInt(elements.gapInput.value, 10) || 1;

  // If not a multiple of gap, use the next smaller multiple
  const effectiveSize = (gap > 0 && pageSize % gap !== 0)
    ? Math.floor(pageSize / gap) * gap
    : pageSize;

  const endIndex = startIndex + effectiveSize; // use this instead of startIndex + pageSize
  let count = 0; // how many matches total so far

  // Build possible matches for each input word
  const lookupTerms = terms.map(term => {
    let normTerm = term;
    const inLookups = lookInLookups(term);

    // Case: Latin, not in lookups, and not normalized → raw term search
    if (!/[α-ω]/i.test(term) && !inLookups && !normalized) {
      const lowerTerm = typeof normTerm === "string" ? normTerm.toLowerCase() : normTerm;
      return lowerTerm;
    }

    return lookupdb
      .map((value, i) => {
        if (!value) return null;

        if (matchesLookup(term, value)) return i;

        return null;
      })
      .filter(i => i !== null); // <-- explicitly filter null, keeps index 0
  });

  let results = []; 
  const claimedVerses = new Set();

    // Find the shortest array in lookupTerms
  const shortestLookup = lookupTerms.reduce((minArr, arr) => {
    return arr.length < minArr.length ? arr : minArr;
  }, lookupTerms[0]);

  // Scan through verses
  forEachVerse((b, c, v, verseWords) => {
    // Pre-check: does verse contain any of the words in the shortest array?
    const containsWord = verseWords.some(([ident, wordEnglish]) => {
      if (Array.isArray(shortestLookup)) {
        // Standard: match by ident index
        return shortestLookup.includes(ident);
      } else if (typeof shortestLookup === "string") {
        // Fallback: match by English text
        const wordEng = (wordEnglish || "").toLowerCase();
        return exact ? wordEng === shortestLookup : wordEng.includes(shortestLookup);
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
        }
      }
    }
  });

  // add boundary marker if needed
  console.log(endIndex)
  if (searchState.boundaries.length <= searchState.page + 1 && count > endIndex) {
    console.log(endIndex)
    searchState.boundaries.push(endIndex);
  }

  return results;
}

function matchesLookup(term, value) {
  const exact = elements.exactMatch.checked;

  // Handle OR '|' first (lowest precedence)
  if (term.includes('|')) {
    return term.split('|').some(subTerm => matchesLookup(subTerm, value));
  }

  // Handle AND '+' next (higher precedence)
  if (term.includes('+')) {
    return term.split('+').every(subTerm => matchesLookup(subTerm, value));
  }

  const lowerTerm = typeof term === "string" ? term.toLowerCase() : term;

  // Check if term starts with any of the prefixes
  if (Object.keys(posMap).some(posKey => term === posKey || term.startsWith(posKey + '-'))) {
    if (matchMorphTag(term, value[1])) return true;
  }

  // Check if term is a number
  if (!isNaN(term)) {
    if (value[2] === Number(term)) return true;
  }
  if (term.startsWith('.')) {
    const cleanTerm = toLatin(term.slice(1))
    const rootParts = (value[3] || "")
      .split(",")
      .map(r => r.trim().toLowerCase());
    return rootParts.some(r => cleanTerm === r);
  }

  const grk = value?.[0] || "";
  const rEng = value?.[4] || "";

  if (/[α-ω]/i.test(term)) {
    const grkNorm = toLatin(term);
    if (exact ? grkNorm === grk : grk.includes(grkNorm)) return true;
  } else {
    const val = rEng ? rEng.toLowerCase() : "";
    if (exact ? val === lowerTerm : val.includes(lowerTerm)) return true;
  }

  return false;
}

function updateBCV(delta) {
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
  render();
}

function copyText(mode) {
  const output = document.getElementById("output");
  if (!output) return;

  // Bail out if grid view is active
  if (output.querySelector(".word-list-grid")) {
    console.log("Grid display active, skipping copy.");
    return;
  }

  let texts = [];

  // Traverse in natural DOM order
  output.querySelectorAll(".verse-label, .word .grk, .word .eng").forEach(span => {
    if (span.classList.contains("verse-label")) {
      texts.push(span.textContent.trim());
    } else if (mode === "grk" && span.classList.contains("grk")) {
      texts.push(span.textContent.trim());
    } else if (mode === "eng" && span.classList.contains("eng")) {
      texts.push(span.textContent.trim());
    }
  });

  const result = texts.join(" ").replace(/\s+/g, " ").trim();

  if (result) {
    navigator.clipboard.writeText(result)
      .then(() => console.log(`${mode.toUpperCase()} text copied!`))
      .catch(err => console.error("Copy failed:", err));
  }
}

// Load initial data from server.
loadBaseJson();