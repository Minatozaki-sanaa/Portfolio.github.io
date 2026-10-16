(() => {
  const dialog = document.querySelector('#stack-dialog');
  const canvas = document.querySelector('#stack-canvas');
  const context = canvas.getContext('2d');
  const openButton = document.querySelector('#open-stack-game');
  const closeButton = document.querySelector('#stack-close');
  const startButton = document.querySelector('#stack-start');
  const dropButton = document.querySelector('#stack-drop');
  const overlay = document.querySelector('#stack-overlay');
  const overlayTitle = document.querySelector('#stack-overlay-title');
  const overlayCopy = document.querySelector('#stack-overlay-copy');
  const scoreLabel = document.querySelector('#stack-score');
  const bestLabel = document.querySelector('#stack-best');
  const bestTitle = document.querySelector('#stack-best-title');
  const stageLabel = document.querySelector('#stack-level');
  const goalLabel = document.querySelector('#stack-goal');
  const destinationLabel = document.querySelector('#stack-destination');
  const announcement = document.querySelector('#stack-announcement');
  const recordsList = document.querySelector('#stack-records-list');
  const recordsNote = document.querySelector('#stack-records-note');
  const recordsTitle = document.querySelector('#stack-records-title');
  const recordForm = document.querySelector('#stack-record-form');
  const playerName = document.querySelector('#stack-player-name');
  const recordStatus = document.querySelector('#stack-record-status');
  if (!context) {
    openButton.hidden = true;
    return;
  }

  const WIDTH = 640;
  const HEIGHT = 480;
  const PARCEL_HEIGHT = 39;
  const BEST_KEY = 'gabby-global-stack-best-v2';
  const ENDLESS_BEST_KEY = 'gabby-global-stack-endless-best-v1';
  const NAME_KEY = 'gabby-global-stack-name-v1';
  const API_BASE = 'https://gabby-stack-leaderboard-2026.orange-root-2887.chatgpt.site/api';
  const markets = {
    jpkr: { zh: '日韩', en: 'Japan & Korea', short: 'JP / KR' },
    sea: { zh: '东南亚', en: 'Southeast Asia', short: 'SEA' },
    southAsia: { zh: '南亚', en: 'South Asia', short: 'S. ASIA' },
    centralAsia: { zh: '中亚', en: 'Central Asia', short: 'C. ASIA' },
    middleEast: { zh: '中东', en: 'Middle East', short: 'M. EAST' },
    oceania: { zh: '大洋洲', en: 'Oceania', short: 'OCEANIA' },
    europe: { zh: '欧洲', en: 'Europe', short: 'EUROPE' },
    eastEurope: { zh: '东欧', en: 'Eastern Europe', short: 'E. EUROPE' },
    westEurope: { zh: '西欧', en: 'Western Europe', short: 'W. EUROPE' },
    northAfrica: { zh: '北非', en: 'North Africa', short: 'N. AFRICA' },
    southAfrica: { zh: '南部非洲', en: 'Southern Africa', short: 'S. AFRICA' },
    northAmerica: { zh: '北美', en: 'North America', short: 'N. AMERICA' },
    latinAmerica: { zh: '拉美', en: 'Latin America', short: 'LATAM' }
  };
  const stages = [
    { markets: ['jpkr', 'sea', 'europe', 'northAmerica'], baseWidth: 270, speed: 175, speedStep: 15, tolerance: 12 },
    { markets: ['jpkr', 'sea', 'southAsia', 'middleEast', 'europe', 'northAmerica'], baseWidth: 238, speed: 225, speedStep: 18, tolerance: 8 },
    { markets: ['jpkr', 'sea', 'southAsia', 'middleEast', 'oceania', 'europe', 'northAmerica', 'latinAmerica'], baseWidth: 214, speed: 270, speedStep: 20, tolerance: 5 },
    { markets: ['jpkr', 'sea', 'southAsia', 'centralAsia', 'middleEast', 'oceania', 'europe', 'northAfrica', 'northAmerica', 'latinAmerica'], baseWidth: 208, speed: 290, speedStep: 19, tolerance: 5 },
    { markets: ['jpkr', 'sea', 'southAsia', 'centralAsia', 'middleEast', 'oceania', 'eastEurope', 'westEurope', 'northAfrica', 'southAfrica', 'northAmerica', 'latinAmerica'], baseWidth: 202, speed: 310, speedStep: 19, tolerance: 4 }
  ];
  const totalGoal = stages.reduce((total, stage) => total + stage.markets.length, 0);
  const endlessStage = { markets: stages.at(-1).markets, baseWidth: 202, speed: 330, speedStep: 11, tolerance: 4 };
  const copy = {
    zh: {
      idleTitle: '准备出发？', idleCopy: '按市场路线投放包裹。看准时机，点击画面或按空格键让它落下。',
      start: '开始第 1 关 ↗', retry: '重试本关 ↗', next: stage => `挑战第 ${stage} 关 ↗`, restart: '开启无尽挑战 ↗',
      lostTitle: '差一点就送到了！', lostCopy: score => `本关叠到了 ${score} 层。调整节奏，再试试看。`,
      clearedTitle: stage => `第 ${stage} 关完成！`, clearedCopy: '路线已送达。下一关的包裹更多、移动更快，落点也要更准。',
      winTitle: '环球路线完成！', winCopy: '五关全部通关，所有市场的包裹都稳稳送达。',
      perfect: '精准投放 ✳', placed: score => `成功叠到第 ${score} 层`,
      missed: score => `本关结束，叠到 ${score} 层`, completed: stage => `第 ${stage} 关完成`,
      stage: stage => `第 ${stage} / ${stages.length} 关`, goal: goal => `本关目标 / ${goal} 层`,
      destination: name => `下一站：${name}`, routeDone: '本关路线已送达',
      endlessTitle: '无尽挑战', endlessGoal: '没有终点 · 看你能叠多高', endlessBest: '无尽关纪录',
      endlessLost: score => `无尽关叠到了 ${score} 层。留下名字，挑战排行榜！`, endlessRetry: '再来一次 ↗',
      recordsTitle: '无尽关 · 最高纪录', recordsNote: '通关五关后解锁', recordsLoading: '正在读取排行榜…',
      recordsEmpty: '还没有纪录，等你来拿第一名。', recordsUnavailable: '排行榜暂时无法读取，请稍后再试。',
      nameLabel: '留下你的名字', namePlaceholder: '昵称（最多 16 字）', submit: '保存成绩 ↗',
      saving: '正在保存…', saved: '成绩已保存！', saveFailed: '保存失败，请稍后重试。',
      recordUnit: score => `${score} 层`
    },
    en: {
      idleTitle: 'Ready to ship?', idleCopy: 'Stack parcels along the market route. Tap, click, or press Space at the right moment to drop one.',
      start: 'Start level 1 ↗', retry: 'Retry this level ↗', next: stage => `Try level ${stage} ↗`, restart: 'Unlock endless mode ↗',
      lostTitle: 'Almost delivered!', lostCopy: score => `You stacked ${score} ${score === 1 ? 'parcel' : 'parcels'} this level. Find your rhythm and try again.`,
      clearedTitle: stage => `Level ${stage} complete!`, clearedCopy: 'Route delivered. The next level has more parcels, greater speed, and less room for error.',
      winTitle: 'Global route complete!', winCopy: 'All five levels cleared. Every market received its parcels.',
      perfect: 'Perfect drop ✳', placed: score => `Stacked parcel ${score}`,
      missed: score => `Level over. You stacked ${score} ${score === 1 ? 'parcel' : 'parcels'}.`, completed: stage => `Level ${stage} complete`,
      stage: stage => `LEVEL ${stage} / ${stages.length}`, goal: goal => `THIS LEVEL / ${goal} PARCELS`,
      destination: name => `NEXT STOP: ${name}`, routeDone: 'Route delivered',
      endlessTitle: 'ENDLESS MODE', endlessGoal: 'No finish line · stack as high as you can', endlessBest: 'ENDLESS BEST',
      endlessLost: score => `You stacked ${score} parcels in endless mode. Add your name to the leaderboard!`, endlessRetry: 'Try again ↗',
      recordsTitle: 'Endless mode · Top scores', recordsNote: 'Unlock after level 5', recordsLoading: 'Loading leaderboard…',
      recordsEmpty: 'No records yet. Be the first!', recordsUnavailable: 'Leaderboard unavailable. Please try later.',
      nameLabel: 'Enter your name', namePlaceholder: 'Nickname (up to 16 characters)', submit: 'Save score ↗',
      saving: 'Saving…', saved: 'Score saved!', saveFailed: 'Could not save. Please try again.',
      recordUnit: score => `${score} ${score === 1 ? 'parcel' : 'parcels'}`
    }
  };
  const locale = () => copy[window.siteLanguage === 'en' ? 'en' : 'zh'];

  let best = 0;
  try { best = Math.min(totalGoal, Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0)); } catch {}
  let endlessBest = 0;
  try { endlessBest = Math.max(0, Number(localStorage.getItem(ENDLESS_BEST_KEY)) || 0); } catch {}
  try { playerName.value = localStorage.getItem(NAME_KEY) || ''; } catch {}
  let runToken = null;
  let recordSubmitted = false;
  let records = [];
  let stageIndex = 0;
  let state = 'idle';
  let placed = [];
  let moving = null;
  let fragments = [];
  let confetti = [];
  let feedback = null;
  let frame = 0;
  let lastTime = 0;

  const level = () => placed.length - 1;
  const isEndless = () => stageIndex === stages.length;
  const stage = () => isEndless() ? endlessStage : stages[stageIndex];
  const progress = () => stages.slice(0, stageIndex).reduce((total, item) => total + item.markets.length, 0) + level();
  const baseParcel = () => ({ x: (WIDTH - stage().baseWidth) / 2, y: 418, w: stage().baseWidth, h: PARCEL_HEIGHT, label: 'GABBY' });

  function nextParcel() {
    const previous = placed.at(-1);
    const direction = level() % 2 === 0 ? 1 : -1;
    return {
      x: direction === 1 ? 0 : WIDTH - previous.w,
      y: previous.y - PARCEL_HEIGHT - 3,
      w: previous.w,
      h: PARCEL_HEIGHT,
      direction,
      speed: Math.min(isEndless() ? 690 : Infinity, stage().speed + level() * stage().speedStep),
      label: stage().markets[level() % stage().markets.length]
    };
  }

  // Shared by every drop: a close match snaps into place; otherwise only the overlap remains.
  function resolveLanding(previous, incoming, tolerance = 8) {
    if (Math.abs(previous.x - incoming.x) <= tolerance) {
      return { x: previous.x, w: previous.w, perfect: true };
    }
    const left = Math.max(previous.x, incoming.x);
    const right = Math.min(previous.x + previous.w, incoming.x + incoming.w);
    return { x: left, w: Math.max(0, right - left), perfect: false };
  }

  function rememberBest() {
    if (isEndless()) {
      if (level() <= endlessBest) return;
      endlessBest = level();
      try { localStorage.setItem(ENDLESS_BEST_KEY, String(endlessBest)); } catch {}
      return;
    }
    if (progress() <= best) return;
    best = progress();
    try { localStorage.setItem(BEST_KEY, String(best)); } catch {}
  }

  function syncInterface() {
    const text = locale();
    scoreLabel.textContent = String(level());
    bestLabel.textContent = String(isEndless() ? endlessBest : best);
    bestTitle.textContent = isEndless() ? text.endlessBest : window.siteLanguage === 'en' ? 'BEST PROGRESS' : '最佳进度';
    stageLabel.textContent = isEndless() ? text.endlessTitle : text.stage(stageIndex + 1);
    goalLabel.textContent = isEndless() ? text.endlessGoal : text.goal(stage().markets.length);
    const nextMarket = stage().markets[level() % stage().markets.length];
    destinationLabel.textContent = !isEndless() && level() >= stage().markets.length ? text.routeDone : text.destination(markets[nextMarket][window.siteLanguage === 'en' ? 'en' : 'zh']);
    recordsTitle.textContent = text.recordsTitle;
    recordsNote.textContent = text.recordsNote;
    recordForm.querySelector('label').textContent = text.nameLabel;
    playerName.placeholder = text.namePlaceholder;
    recordForm.querySelector('button').textContent = text.submit;
    recordForm.hidden = !(isEndless() && state === 'lost' && level() > 0 && !recordSubmitted && runToken);
    dropButton.disabled = state !== 'playing';
    overlay.hidden = state === 'playing';
    if (state === 'idle') {
      overlayTitle.textContent = text.idleTitle;
      overlayCopy.textContent = text.idleCopy;
      startButton.textContent = text.start;
    } else if (state === 'lost') {
      overlayTitle.textContent = text.lostTitle;
      overlayCopy.textContent = isEndless() ? text.endlessLost(level()) : text.lostCopy(level());
      startButton.textContent = isEndless() ? text.endlessRetry : text.retry;
    } else if (state === 'cleared') {
      overlayTitle.textContent = text.clearedTitle(stageIndex + 1);
      overlayCopy.textContent = text.clearedCopy;
      startButton.textContent = text.next(stageIndex + 2);
    } else if (state === 'won') {
      overlayTitle.textContent = text.winTitle;
      overlayCopy.textContent = text.winCopy;
      startButton.textContent = text.restart;
    }
    renderRecords();
  }

  function reset(newState = 'idle') {
    state = newState;
    placed = [baseParcel()];
    moving = nextParcel();
    fragments = [];
    confetti = [];
    feedback = null;
    lastTime = 0;
    announcement.textContent = '';
    recordStatus.textContent = '';
    recordForm.hidden = true;
    syncInterface();
    render();
  }

  async function start() {
    if (state === 'cleared') stageIndex += 1;
    if (state === 'won') stageIndex = stages.length;
    if (isEndless()) {
      startButton.disabled = true;
      try {
        const response = await fetch(`${API_BASE}/run`, { method: 'POST' });
        if (!response.ok) throw new Error('Run could not start');
        const payload = await response.json();
        runToken = payload.token;
      } catch {
        overlayCopy.textContent = locale().recordsUnavailable;
        startButton.disabled = false;
        return;
      }
      startButton.disabled = false;
    }
    recordSubmitted = false;
    reset('playing');
    dropButton.focus({ preventScroll: true });
  }

  function drop() {
    if (state !== 'playing' || !moving) return;
    const previous = placed.at(-1);
    const incoming = moving;
    const landing = resolveLanding(previous, incoming, stage().tolerance);
    if (landing.w < 25) {
      fragments.push({ ...incoming, velocity: 0, rotation: 0 });
      moving = null;
      state = 'lost';
      announcement.textContent = locale().missed(level());
      syncInterface();
      if (isEndless() && level() > 0) playerName.focus();
      else startButton.focus({ preventScroll: true });
      return;
    }
    if (!landing.perfect) {
      const overhangX = incoming.x < previous.x ? incoming.x : landing.x + landing.w;
      const overhangW = incoming.w - landing.w;
      if (overhangW > 0) fragments.push({ ...incoming, x: overhangX, w: overhangW, velocity: 0, rotation: 0 });
    } else {
      feedback = { kind: 'perfect', x: landing.x + landing.w / 2, y: incoming.y - 15, until: performance.now() + 760 };
    }
    placed.push({ x: landing.x, y: incoming.y, w: landing.w, h: PARCEL_HEIGHT, label: incoming.label });
    rememberBest();
    if (!isEndless() && level() >= stage().markets.length) {
      moving = null;
      state = stageIndex === stages.length - 1 ? 'won' : 'cleared';
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) makeConfetti();
      announcement.textContent = locale().completed(stageIndex + 1);
      syncInterface();
      startButton.focus({ preventScroll: true });
    } else {
      moving = nextParcel();
      announcement.textContent = locale().placed(level());
      syncInterface();
    }
  }

  let highlightedRecord = null;

  function renderRecords(message = null) {
    recordsList.replaceChildren();
    if (message || !records.length) {
      const item = document.createElement('li');
      item.className = 'stack-records-empty';
      item.textContent = message || locale().recordsEmpty;
      recordsList.append(item);
      return;
    }
    records.slice(0, 5).forEach((record, index) => {
      const item = document.createElement('li');
      if (record.id === highlightedRecord) item.className = 'is-highlight';
      const rank = document.createElement('span');
      rank.className = 'stack-record-rank';
      rank.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span');
      name.className = 'stack-record-name';
      name.textContent = record.name;
      const score = document.createElement('strong');
      score.className = 'stack-record-score';
      score.textContent = locale().recordUnit(record.score);
      item.append(rank, name, score);
      recordsList.append(item);
    });
  }

  async function loadRecords() {
    renderRecords(locale().recordsLoading);
    try {
      const response = await fetch(`${API_BASE}/leaderboard`);
      if (!response.ok) throw new Error('Leaderboard unavailable');
      const payload = await response.json();
      records = Array.isArray(payload.scores) ? payload.scores : [];
      renderRecords();
    } catch {
      renderRecords(locale().recordsUnavailable);
    }
  }

  async function saveRecord(event) {
    event.preventDefault();
    if (!isEndless() || state !== 'lost' || !runToken || recordSubmitted || level() < 1) return;
    const name = playerName.value.trim().replace(/\s+/g, ' ');
    if (!name || name.length > 16) return;
    const submitButton = recordForm.querySelector('button');
    submitButton.disabled = true;
    recordStatus.textContent = locale().saving;
    try {
      const response = await fetch(`${API_BASE}/leaderboard`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score: level(), token: runToken })
      });
      if (!response.ok) throw new Error('Score rejected');
      const payload = await response.json();
      highlightedRecord = payload.id;
      recordSubmitted = true;
      runToken = null;
      try { localStorage.setItem(NAME_KEY, name); } catch {}
      recordStatus.textContent = locale().saved;
      recordsNote.textContent = locale().saved;
      announcement.textContent = locale().saved;
      recordForm.hidden = true;
      await loadRecords();
    } catch {
      recordStatus.textContent = locale().saveFailed;
    } finally {
      submitButton.disabled = false;
    }
  }

  function makeConfetti() {
    confetti = Array.from({ length: 35 }, (_, index) => ({
      x: 50 + Math.random() * (WIDTH - 100), y: -Math.random() * 220,
      vx: (Math.random() - .5) * 70, vy: 80 + Math.random() * 130,
      angle: Math.random() * 6, spin: (Math.random() - .5) * 5,
      size: 4 + Math.random() * 5, color: index % 3 === 0 ? '#a32227' : index % 3 === 1 ? '#243a31' : '#c9aa77'
    }));
  }

  function drawBackground() {
    context.fillStyle = '#e5e8dc';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.strokeStyle = 'rgba(53, 80, 61, .11)';
    context.lineWidth = 1;
    for (let x = 40; x < WIDTH; x += 40) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke();
    }
    for (let y = 40; y < HEIGHT; y += 40) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke();
    }
    context.strokeStyle = 'rgba(163, 34, 39, .45)';
    context.lineWidth = 1.5;
    context.setLineDash([3, 7]);
    context.beginPath(); context.moveTo(60, 104); context.bezierCurveTo(200, 22, 385, 105, 560, 45); context.stroke();
    context.setLineDash([]);
    context.fillStyle = '#a32227';
    context.beginPath(); context.arc(58, 105, 4, 0, Math.PI * 2); context.fill();
    context.beginPath(); context.arc(560, 45, 4, 0, Math.PI * 2); context.fill();
    context.font = '700 12px Arial, sans-serif';
    context.letterSpacing = '2px';
    context.fillStyle = '#556858';
    context.fillText(isEndless() ? 'GLOBAL DELIVERY / ENDLESS MODE' : `GLOBAL DELIVERY / ${String(stageIndex + 1).padStart(2, '0')} OF ${String(stages.length).padStart(2, '0')}`, 25, 28);
    context.letterSpacing = '0px';
    context.save();
    context.translate(555, 94);
    context.rotate(-.17);
    context.strokeStyle = 'rgba(163, 34, 39, .42)';
    context.lineWidth = 2;
    context.beginPath(); context.arc(0, 0, 38, 0, Math.PI * 2); context.stroke();
    context.font = '700 12px Arial, sans-serif';
    context.textAlign = 'center'; context.fillStyle = '#a32227';
    context.fillText('AIR MAIL', 0, 4);
    context.restore();
    context.fillStyle = '#243a31';
    context.fillRect(0, 455, WIDTH, 25);
    context.fillStyle = '#a32227';
    context.fillRect(0, 451, WIDTH, 4);
    context.font = '700 11px Arial, sans-serif';
    context.fillStyle = '#f4e7d0';
    context.fillText('FROM SHENZHEN · TO THE WORLD', 16, 472);
  }

  function drawParcel(parcel, translucent = false) {
    if (!parcel || parcel.w <= 0) return;
    context.save();
    context.globalAlpha = translucent ? .8 : 1;
    const isBase = parcel.label === 'GABBY';
    context.fillStyle = isBase ? '#294638' : '#fff8e8';
    context.fillRect(parcel.x, parcel.y, parcel.w, parcel.h);
    context.strokeStyle = '#243a31';
    context.lineWidth = 2;
    context.strokeRect(parcel.x + 1, parcel.y + 1, Math.max(0, parcel.w - 2), parcel.h - 2);
    context.fillStyle = isBase ? '#b65248' : '#bc5045';
    context.fillRect(parcel.x + parcel.w * .23, parcel.y + 1, Math.min(15, parcel.w * .12), parcel.h - 2);
    context.fillStyle = 'rgba(36, 58, 49, .12)';
    context.fillRect(parcel.x + 2, parcel.y + parcel.h - 7, Math.max(0, parcel.w - 4), 5);
    if (parcel.w >= 52) {
      context.save();
      context.beginPath(); context.rect(parcel.x + 1, parcel.y + 1, parcel.w - 2, parcel.h - 2); context.clip();
      context.font = '800 13px Arial, sans-serif';
      context.textAlign = 'right';
      context.fillStyle = isBase ? '#fff3db' : '#243a31';
      const market = markets[parcel.label];
      const fullLabel = market ? market[window.siteLanguage === 'en' ? 'en' : 'zh'] : parcel.label;
      const shortLabel = market?.short || parcel.label;
      const available = parcel.w * .7 - 12;
      const shownLabel = context.measureText(fullLabel).width <= available ? fullLabel : shortLabel;
      if (context.measureText(shownLabel).width <= available) context.fillText(shownLabel, parcel.x + parcel.w - 13, parcel.y + 25);
      context.restore();
    }
    context.restore();
  }

  function render(now = performance.now()) {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    // Keep the next parcel in view as longer routes grow beyond the canvas.
    const topParcel = moving || placed.at(-1);
    const cameraY = Math.max(0, 155 - (topParcel?.y ?? 155));
    context.save();
    context.translate(0, cameraY);
    if (moving && state === 'playing') {
      const previous = placed.at(-1);
      context.save();
      context.strokeStyle = 'rgba(163, 34, 39, .48)';
      context.lineWidth = 1.5;
      context.setLineDash([7, 7]);
      context.strokeRect(previous.x, moving.y, previous.w, moving.h);
      context.restore();
    }
    placed.forEach(parcel => {
      if (parcel.y + cameraY > -PARCEL_HEIGHT && parcel.y + cameraY < HEIGHT) drawParcel(parcel);
    });
    if (moving) drawParcel(moving, state === 'idle');
    fragments.forEach(fragment => drawParcel(fragment));
    confetti.forEach(piece => {
      context.save(); context.translate(piece.x, piece.y); context.rotate(piece.angle);
      context.fillStyle = piece.color; context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.8);
      context.restore();
    });
    if (feedback && now < feedback.until) {
      context.fillStyle = '#a32227';
      context.font = '800 18px Arial, sans-serif';
      context.textAlign = 'center';
      context.fillText(locale().perfect, feedback.x, feedback.y);
    }
    context.restore();
  }

  function tick(now) {
    if (!dialog.open) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
    lastTime = now;
    if (state === 'playing' && moving) {
      moving.x += moving.speed * delta * moving.direction;
      if (moving.x <= 0) { moving.x = 0; moving.direction = 1; }
      if (moving.x + moving.w >= WIDTH) { moving.x = WIDTH - moving.w; moving.direction = -1; }
    }
    for (const fragment of fragments) {
      fragment.velocity += 1000 * delta;
      fragment.y += fragment.velocity * delta;
      fragment.rotation += delta;
    }
    fragments = fragments.filter(fragment => fragment.y < HEIGHT + 70);
    for (const piece of confetti) {
      piece.x += piece.vx * delta; piece.y += piece.vy * delta; piece.angle += piece.spin * delta;
    }
    confetti = confetti.filter(piece => piece.y < HEIGHT + 20);
    render(now);
    frame = requestAnimationFrame(tick);
  }

  const density = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(WIDTH * density);
  canvas.height = Math.round(HEIGHT * density);
  context.setTransform(density, 0, 0, density, 0, 0);
  reset();

  openButton.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('dialog-open');
    stageIndex = 0;
    reset();
    loadRecords();
    startButton.focus({ preventScroll: true });
    frame = requestAnimationFrame(tick);
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    document.body.classList.remove('dialog-open');
    openButton.focus({ preventScroll: true });
  });
  startButton.addEventListener('click', start);
  recordForm.addEventListener('submit', saveRecord);
  dropButton.addEventListener('click', drop);
  canvas.addEventListener('click', drop);
  document.addEventListener('keydown', event => {
    if (!dialog.open || state !== 'playing' || event.code !== 'Space') return;
    if (event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
    drop();
  });
  document.addEventListener('visibilitychange', () => { lastTime = 0; });
  window.addEventListener('site-language-change', () => {
    syncInterface();
    render();
  });
})();
