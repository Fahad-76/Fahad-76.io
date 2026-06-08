/* ── DRIVER LOOKUP ────────────────────────────────────────────────────── */
const DRIVERS = {
  RUS: { name: 'George Russell',    team: 'Mercedes' },
  ANT: { name: 'Kimi Antonelli',    team: 'Mercedes' },
  NOR: { name: 'Lando Norris',      team: 'McLaren' },
  HAM: { name: 'Lewis Hamilton',    team: 'Ferrari' },
  VER: { name: 'Max Verstappen',    team: 'Red Bull Racing' },
  PIA: { name: 'Oscar Piastri',     team: 'McLaren' },
  LEC: { name: 'Charles Leclerc',   team: 'Ferrari' },
  HAD: { name: 'Isack Hadjar',      team: 'Red Bull Racing' },
  OCO: { name: 'Esteban Ocon',      team: 'Haas F1 Team' },
  LIN: { name: 'Arvid Lindblad',    team: 'Racing Bulls' },
  STR: { name: 'Lance Stroll',      team: 'Aston Martin' },
  SAI: { name: 'Carlos Sainz',      team: 'Williams' },
  PER: { name: 'Sergio Perez',      team: 'Cadillac' },
  ALB: { name: 'Alexander Albon',   team: 'Williams' },
  ALO: { name: 'Fernando Alonso',   team: 'Aston Martin' },
  HUL: { name: 'Nico Hulkenberg',   team: 'Audi' },
  GAS: { name: 'Pierre Gasly',      team: 'Alpine' },
  COL: { name: 'Franco Colapinto',  team: 'Alpine' },
  BOT: { name: 'Valtteri Bottas',   team: 'Cadillac' },
  BOR: { name: 'Gabriel Bortoleto', team: 'Audi' },
  BEA: { name: 'Oliver Bearman',    team: 'Haas F1 Team' },
  LAW: { name: 'Liam Lawson',       team: 'Racing Bulls' },
};

/* ── TEAM COLOURS ─────────────────────────────────────────────────────── */
const TEAM_COLORS = {
  'McLaren':         '#ef8733',
  'Mercedes':        '#75F1D3',
  'Red Bull Racing': '#4570C0',
  'Ferrari':         '#D52E37',
  'Williams':        '#3267D4',
  'Racing Bulls':    '#7091f8',
  'Aston Martin':    '#4B9774',
  'Haas F1 Team':    '#DFE1E2',
  'Audi':            '#EB4526',
  'Alpine':          '#479FE2',
  'Cadillac':        '#AAAADD',
};

/* ── ROUNDS CONFIG ────────────────────────────────────────────────────── */
const ROUNDS = [
  { id: 'round01', label: 'Australia' },
  { id: 'round02', label: 'China' },
  { id: 'round03', label: 'Japan' },
  { id: 'round04', label: 'Miami' },
  { id: 'round05', label: 'Canada' },
  { id: 'round06', label: 'Monaco' },
];

/* ── CSV PARSER ───────────────────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    // Handle quoted fields (e.g. "1:23:06.801")
    const fields = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (fields[i] || '').trim(); });
    return obj;
  });
}

/* ── FETCH ROUND DATA ─────────────────────────────────────────────────── */
async function fetchRound(roundId) {
  const [predRes, resRes] = await Promise.all([
    fetch(`predictions/2026_${roundId}.csv`),
    fetch(`results/2026_${roundId}.csv`),
  ]);
  if (!predRes.ok || !resRes.ok) throw new Error('CSV not found');
  const [predText, resText] = await Promise.all([predRes.text(), resRes.text()]);
  return {
    predictions: parseCSV(predText),
    results: parseCSV(resText),
  };
}

/* ── DRIVER ABBR FROM FULL NAME (for results matching) ────────────────── */
function abbrFromName(fullName) {
  return Object.entries(DRIVERS).find(([, v]) => v.name === fullName)?.[0] ?? null;
}

/* ── TEAM COLOR CSS VAR ───────────────────────────────────────────────── */
function teamColor(abbr) {
  const team = DRIVERS[abbr]?.team;
  return TEAM_COLORS[team] ?? '#555566';
}

/* ── SCORING LOGIC ────────────────────────────────────────────────────── */
function scoreRound(predictions, results) {
  // predicted winner = row 0 of predictions (already sorted by model)
  const predWinner = predictions[0]?.Driver;
  const predPodium = predictions.slice(0, 3).map(r => r.Driver);

  // actual finishers
  const finishers = results.filter(r => /^\d+$/.test(r.Pos)).map(r => ({
    pos: parseInt(r.Pos),
    abbr: abbrFromName(r.Driver),
    name: r.Driver,
    time: r['Time/Retired'],
  }));
  const dnfs = results.filter(r => !/^\d+$/.test(r.Pos)).map(r => ({
    pos: null,
    abbr: abbrFromName(r.Driver),
    name: r.Driver,
    time: r['Time/Retired'],
  }));

  const actualWinner = finishers.find(f => f.pos === 1)?.abbr;
  const actualPodium = finishers.filter(f => f.pos <= 3).map(f => f.abbr);

  const winnerCorrect = predWinner === actualWinner;
  const podiumHits = predPodium.filter(p => actualPodium.includes(p));

  return { predWinner, predPodium, actualWinner, actualPodium, finishers, dnfs, winnerCorrect, podiumHits };
}

/* ── BUILD PREDICTION PANEL ───────────────────────────────────────────── */
function buildPredPanel(predictions) {
  const list = document.createElement('div');
  list.className = 'driver-list';

  predictions.forEach((row, i) => {
    const abbr = row.Driver;
    const info = DRIVERS[abbr] ?? { name: abbr, team: '' };
    const winPct = parseFloat(row['Win%'] ?? 0);
    const podPct = parseFloat(row['Podium%'] ?? 0);
    const grid = row.GridPosition === '?' ? '?' : `P${parseInt(row.GridPosition)}`;
    const color = teamColor(abbr);

    const el = document.createElement('div');
    el.className = 'driver-row pred-row';
    el.style.setProperty('--team-color', color);

    const posClass = i === 0 ? 'p1' : i <= 2 ? (i === 1 ? 'p2' : 'p3') : '';

    el.innerHTML = `
      <span class="pos-num ${posClass}">${i + 1}</span>
      <div class="driver-info">
        <div class="driver-name">${info.name}</div>
        <div class="driver-abbr">${abbr} · ${info.team}</div>
      </div>
      <div class="pred-stat">
        <div class="pred-stat-val">${winPct.toFixed(1)}%</div>
        <div class="pred-stat-lbl">Win</div>
      </div>
      <div class="pred-stat">
        <div class="pred-stat-val">${podPct.toFixed(1)}%</div>
        <div class="pred-stat-lbl">Podium</div>
      </div>

    `;
    list.appendChild(el);
  });
  return list;
}

/* ── BUILD RESULTS PANEL ──────────────────────────────────────────────── */
function buildResultPanel(finishers, dnfs, predPodium) {
  const list = document.createElement('div');
  list.className = 'driver-list';

  const allEntries = [...finishers.sort((a, b) => a.pos - b.pos), ...dnfs];

  allEntries.forEach(entry => {
    const abbr = entry.abbr;
    const info = abbr ? (DRIVERS[abbr] ?? { name: entry.name, team: '' }) : { name: entry.name, team: '' };
    const color = abbr ? teamColor(abbr) : '#555566';
    const isDNF = entry.pos === null;
    const inPredPodium = abbr && predPodium.includes(abbr);

    let hitClass = '';
    if (!isDNF && entry.pos === 1 && predPodium[0] === abbr) hitClass = 'hit-win';
    else if (!isDNF && entry.pos <= 3 && inPredPodium) hitClass = 'hit-podium';

    const posClass = entry.pos === 1 ? 'p1' : entry.pos === 2 ? 'p2' : entry.pos === 3 ? 'p3' : '';

    const el = document.createElement('div');
    el.className = `driver-row result-row ${hitClass}`;
    el.style.setProperty('--team-color', color);

    const timeHTML = isDNF
      ? `<span class="dnf-badge">DNF</span>`
      : `<div class="finish-time">${entry.time}</div>`;

    el.innerHTML = `
      <span class="pos-num ${posClass}">${isDNF ? 'DNF' : entry.pos}</span>
      <div class="driver-info">
        <div class="driver-name">${info.name}</div>
        <div class="driver-abbr">${abbr ?? '—'} · ${info.team}</div>
      </div>
      <div class="finish-info">${timeHTML}</div>
    `;
    list.appendChild(el);
  });
  return list;
}

/* ── BUILD VERDICT CHIPS ──────────────────────────────────────────────── */
function buildVerdictBar(winnerCorrect, podiumHits, predPodium) {
  const bar = document.createElement('div');
  bar.className = 'verdict-bar';

  if (winnerCorrect) {
    bar.innerHTML += `<div class="verdict-chip win"><span class="dot"></span>Winner correct</div>`;
  } else {
    bar.innerHTML += `<div class="verdict-chip miss"><span class="dot"></span>Winner missed</div>`;
  }

  const podHitCount = podiumHits.length;
  if (podHitCount === 3) {
    bar.innerHTML += `<div class="verdict-chip win"><span class="dot"></span>Full podium hit</div>`;
  } else if (podHitCount > 0) {
    bar.innerHTML += `<div class="verdict-chip podium"><span class="dot"></span>${podHitCount}/3 podium drivers correct</div>`;
  } else {
    bar.innerHTML += `<div class="verdict-chip miss"><span class="dot"></span>Podium missed</div>`;
  }

  return bar;
}

/* ── RENDER ROUND ─────────────────────────────────────────────────────── */
async function renderRound(roundId, panel) {
  panel.innerHTML = '<div class="state-msg">Loading…</div>';
  try {
    const { predictions, results } = await fetchRound(roundId);
    const score = scoreRound(predictions, results);

    panel.innerHTML = '';

    // Verdict
    panel.appendChild(buildVerdictBar(score.winnerCorrect, score.podiumHits, score.predPodium));

    // Grid
    const grid = document.createElement('div');
    grid.className = 'comparison-grid';

    // Left: predictions
    const leftWrap = document.createElement('div');
    const leftLabel = document.createElement('div');
    leftLabel.className = 'panel-label';
    leftLabel.textContent = 'Model Predictions';
    leftWrap.appendChild(leftLabel);
    leftWrap.appendChild(buildPredPanel(predictions));

    // Right: results
    const rightWrap = document.createElement('div');
    const rightLabel = document.createElement('div');
    rightLabel.className = 'panel-label';
    rightLabel.textContent = 'Race Results';
    rightWrap.appendChild(rightLabel);
    rightWrap.appendChild(buildResultPanel(score.finishers, score.dnfs, score.predPodium));

    grid.appendChild(leftWrap);
    grid.appendChild(rightWrap);
    panel.appendChild(grid);

  } catch (e) {
    panel.innerHTML = `<div class="state-msg error">Could not load data for this round.<br><small>${e.message}</small></div>`;
  }
}

/* ── ACCURACY SUMMARY (across all rounds) ────────────────────────────── */
async function buildAccuracySummary() {
  let winHits = 0, podHits = 0, loaded = 0;
  const results = await Promise.allSettled(ROUNDS.map(r => fetchRound(r.id)));
  results.forEach(res => {
    if (res.status !== 'fulfilled') return;
    loaded++;
    const s = scoreRound(res.value.predictions, res.value.results);
    if (s.winnerCorrect) winHits++;
    if (s.podiumHits.length > 0) podHits++;
  });
  if (loaded === 0) return;
  document.getElementById('acc-winner').textContent = `${winHits}/${loaded}`;
  document.getElementById('acc-podium').textContent = `${podHits}/${loaded}`;
  document.getElementById('acc-rounds').textContent = `${loaded}`;
}

/* ── TABS ─────────────────────────────────────────────────────────────── */
const panelCache = {};

function activateTab(idx) {
  document.querySelectorAll('.round-tab').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.round-panel').forEach((p, i) => {
    p.classList.toggle('active', i === idx);
  });
  const round = ROUNDS[idx];
  if (!panelCache[round.id]) {
    panelCache[round.id] = true;
    const panel = document.getElementById(`panel-${round.id}`);
    renderRound(round.id, panel);
  }
}

/* ── INIT ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('round-tabs');
  const panelsEl = document.getElementById('round-panels');

  ROUNDS.forEach((round, i) => {
    const tab = document.createElement('button');
    tab.className = 'round-tab';
    tab.textContent = round.label;
    tab.addEventListener('click', () => activateTab(i));
    tabsEl.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'round-panel';
    panel.id = `panel-${round.id}`;
    panelsEl.appendChild(panel);
  });

  activateTab(0);
  buildAccuracySummary();
});