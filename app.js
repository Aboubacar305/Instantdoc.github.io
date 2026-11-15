/* L'instant Santé – app.js (UTF-8) */
const WHATSAPP_NUM = '22656221895';

/* ---------- Navigation ---------- */
function toggleMenu() {
  const nav = document.getElementById('dropdownNav');
  nav.classList.toggle('open');
  document.getElementById('menuArrow').innerText = nav.classList.contains('open') ? '▲' : '▼';
}
function switchPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));
  target.classList.add('active-page');
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', (b.getAttribute('onclick') || '').includes("'" + pageId + "'")));
  document.getElementById('dropdownNav').classList.remove('open');
  document.getElementById('menuArrow').innerText = '▼';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleAccordion(header) {
  const content = header.nextElementSibling, arrow = header.lastElementChild;
  document.querySelectorAll('.accordion-content').forEach(i => { if (i !== content) i.classList.remove('open'); });
  document.querySelectorAll('.accordion-header span:last-child').forEach(a => { if (a !== arrow) a.innerText = '▼'; });
  content.classList.toggle('open');
  arrow.innerText = content.classList.contains('open') ? '▲' : '▼';
}

/* ---------- Recherche (sans accents) ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function executeEncycloSearch() {
  const query = norm(document.getElementById('encycloSearchInput').value.trim());
  const out = document.getElementById('encycloSearchResultsArea');
  if (query.length < 2) { out.style.display = 'none'; return; }
  const items = [
    { term: 'tension hta hypertension', title: 'Hypertension Artérielle (HTA) & Script Python', desc: "Ouvre le module 1 de l'accueil pour analyser ta tension." },
    { term: 'diabete sucre imc poids', title: "Diabète de Type 2 & Calculateur d'IMC", desc: "Ouvre le module 2 de l'accueil pour évaluer ta corpulence." },
    { term: 'yeux vue ecran lumiere bleue', title: 'Santé Oculaire', desc: 'Ouvre le module 3 : lumière bleue et règle des 20-20-20.' },
    { term: 'paludisme fievre moustique', title: 'Paludisme', desc: 'Page Encyclopédie, module 4 : signes, prévention, quand consulter.' },
    { term: 'brulure urgence secours saignement', title: 'Urgences & Secours', desc: 'Page Urgences : brûlure, saignement, personne inconsciente, AVC.' }
  ];
  const matches = items.filter(i => norm(i.term + ' ' + i.title + ' ' + i.desc).includes(query));
  out.style.display = 'block';
  out.innerHTML = matches.length
    ? matches.map(m => `<div style="background:#fff;padding:12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #7c3aed;"><h4 style="color:#7c3aed;margin-bottom:4px;">${m.title}</h4><p style="font-size:.88rem;margin:0;">${m.desc}</p></div>`).join('')
    : `<p style="font-size:.9rem;">Aucun dossier direct. <a href="https://www.google.com/search?q=${encodeURIComponent(query + ' sante')}" target="_blank" rel="noopener" style="color:#7c3aed;font-weight:700;">Rechercher sur le web ➔</a></p>`;
}

/* ---------- Quiz ---------- */
const masterQuizPool = [
  { q: "Quel numéro d'urgence joindre pour les sapeurs-pompiers au Burkina Faso ?", options: ['15', '17', '18', '16'], correct: 2 },
  { q: 'Quelle quantité de sel ne pas dépasser par jour ?', options: ['15 g', '5 g', '25 g', '10 g'], correct: 1 },
  { q: 'Quel réflexe avoir face à une brûlure ?', options: ["Mettre de l'huile", "Passer de l'eau tempérée 10 min", 'Mettre du sel', 'Frotter'], correct: 1 },
  { q: 'Quelle tension signale une hypertension artérielle (HTA) ?', options: ['120/80 mmHg', '110/70 mmHg', '140/90 mmHg ou plus', '90/60 mmHg'], correct: 2 },
  { q: 'Que faire face à un accidenté inconscient qui respire ?', options: ['Lui donner à boire', 'Le mettre en Position Latérale de Sécurité (PLS)', 'Le secouer', 'Le laisser debout'], correct: 1 },
  { q: 'Que risque-t-on en mettant du jus de citron dans les yeux ?', options: ['Une meilleure vue', 'Une brûlure de la cornée et un risque de cécité', 'Rien', 'Moins de fatigue'], correct: 1 },
  { q: 'Quel est le rôle principal de Neema Digit SAS ?', options: ['Vendre des fruits', 'Ingénierie digitale & web', 'Réparer des voitures', 'Coiffure'], correct: 1 },
  { q: 'Qui est le PDG fondateur de Neema Digit SAS ?', options: ['Ouedraogo Aboubacar (Mr BOW 226)', 'Inconnu', 'Personne', 'Un cabinet'], correct: 0 },
  { q: "Quelle durée minimale d'activité physique par jour est recommandée ?", options: ['5 minutes', '30 minutes de marche active', '3 heures', '1 mois'], correct: 1 },
  { q: 'Comment stopper rapidement une hémorragie externe abondante ?', options: ['Appuyer directement sur la plaie', 'Mettre de la poudre', "Boire de l'eau", 'Attendre'], correct: 0 },
  { q: 'Quel nutriment en excès favorise le diabète de type 2 ?', options: ['Sucres raffinés et sodas', 'Eau minérale', 'Légumes verts', 'Poisson'], correct: 0 },
  { q: "Que signifie l'abréviation médicale HTA ?", options: ['Hémorragie Toxique', 'Hypertension Artérielle', 'Hydratation Totale', 'Hyper Tension'], correct: 1 },
  { q: 'Quelle maladie oculaire abîme le nerf optique silencieusement ?', options: ['Cataracte', 'Glaucome', 'Conjonctivite', 'Astigmatisme'], correct: 1 },
  { q: "Quelle quantité d'eau boire environ par jour ?", options: ['0,5 litre', 'Entre 1,5 et 2 litres', '5 litres', '10 litres'], correct: 1 },
  { q: 'La sédentarité augmente-t-elle les risques cardiovasculaires ?', options: ['Non', 'Oui, fortement', 'Uniquement la nuit', 'Chez les bébés'], correct: 1 },
  { q: 'Quel numéro permet de joindre la police au Burkina Faso ?', options: ['15', '17', '18', '16'], correct: 1 },
  { q: 'Le tabagisme a-t-il un effet néfaste sur les artères ?', options: ['Non', 'Oui, il les abîme et les obstrue', 'Il protège', 'Aucun effet'], correct: 1 },
  { q: "Qu'est-ce que la cataracte ?", options: ['Opacification du cristallin', 'Rougeur', 'Goût amer', 'Saignement'], correct: 0 },
  { q: 'Quel aliment est riche en potassium et bon pour le cœur ?', options: ['La banane', 'Le sel de table', 'Les chips', 'La mayonnaise'], correct: 0 },
  { q: 'Le stress chronique peut-il faire monter la tension ?', options: ['Non', 'Oui, par vasoconstriction', "Seulement en été", 'Le matin seulement'], correct: 1 },
  { q: 'Pourquoi éviter de donner à boire à une personne inconsciente ?', options: ["Risque d'étouffement", 'Elle aurait de la fièvre', 'Cela arrête la respiration', 'Sans danger'], correct: 0 },
  { q: 'À quelle fréquence contrôler sa tension ?', options: ['Tous les 10 ans', 'Au moins une fois par an', 'Toutes les heures', 'Jamais'], correct: 1 },
  { q: 'Les bouillons cubes industriels sont-ils riches en sel ?', options: ['Oui, très riches', 'Sans sel', 'Que du sucre', '100 % eau'], correct: 0 },
  { q: "Signes d'un AVC (visage affaissé) : que faire ?", options: ['Faire dormir', 'Appeler immédiatement les secours', 'Donner un café', 'Attendre'], correct: 1 },
  { q: "Objectif principal de L'instant Santé ?", options: ['Être ton compagnon de vie et de prévention', 'Vendre des médicaments', 'Faire de la chirurgie', 'Rien'], correct: 0 },
  { q: 'Conséquence de la lumière bleue excessive ?', options: ['Améliore la vue', 'Fatigue et sécheresse oculaire', 'Soigne la myopie', 'Sans effet'], correct: 1 },
  { q: "Pourquoi ne pas prendre d'antibiotiques sans ordonnance ?", options: ['Résistance bactérienne', 'Ils font dormir', 'Ils donnent faim', 'Aucune raison'], correct: 0 },
  { q: 'Quels organes filtrent principalement les toxines ?', options: ['Foie et reins', 'Estomac', 'Cœur', 'Pancréas'], correct: 0 },
  { q: 'Le sport régulier aide-t-il à réguler la glycémie ?', options: ['Oui', 'Non', 'Il augmente le sucre', 'Il fatigue le sang'], correct: 0 },
  { q: 'Comment se transmet le paludisme ?', options: ['Par la piqûre du moustique anophèle', 'Par une poignée de main', 'Par le sel', 'Par la lumière bleue'], correct: 0 },
  { q: 'Quelle protection limite les piqûres la nuit ?', options: ['La moustiquaire imprégnée', 'Un bonnet', 'Du sucre', 'Un ventilateur éteint'], correct: 0 },
  { q: 'Siège de Neema Digit SAS ?', options: ['Ouagadougou, Burkina Faso', 'Paris', 'Dakar', 'Abidjan'], correct: 0 }
];
let activeQuizData = [], currentQIdx = 0, userScore = 0, canAnswer = true, currentPlayerName = 'Joueur';
const kahootColors = ['k-red', 'k-blue', 'k-yellow', 'k-green'], kahootShapes = ['▲', '◆', '●', '■'];
const $ = id => document.getElementById(id);

function playSoundEffect(win) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)(), t0 = ctx.currentTime;
    const notes = win ? [523.25, 659.25, 783.99, 1046.5] : [300, 260, 220, 180], step = win ? .12 : .2;
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = win ? 'triangle' : 'sawtooth';
      o.frequency.setValueAtTime(f, t0 + i * step);
      g.gain.setValueAtTime(win ? .2 : .15, t0 + i * step);
      g.gain.exponentialRampToValueAtTime(.001, t0 + i * step + .3);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0 + i * step); o.stop(t0 + i * step + .35);
    });
  } catch (e) { /* audio non pris en charge */ }
}
function startQuizGame() {
  currentPlayerName = $('playerNameInput').value.trim() || 'Ami(e)';
  $('playerDisplayTitle').innerText = 'Joueur : ' + currentPlayerName;
  $('quizNameSection').style.display = 'none';
  $('quizGameArea').style.display = 'block';
  activeQuizData = [...masterQuizPool].sort(() => Math.random() - .5).slice(0, 20);
  currentQIdx = 0; userScore = 0;
  loadQuestion();
}
function loadQuestion() {
  canAnswer = true;
  const nb = $('nextQuestionBtn');
  nb.style.display = 'none';
  nb.innerText = 'Question Suivante ➔';
  const q = activeQuizData[currentQIdx];
  $('questionCounter').innerText = `Question ${currentQIdx + 1} / ${activeQuizData.length}`;
  $('scoreCounter').innerText = `Score : ${userScore} pts`;
  $('kahootQuestion').innerText = q.q;
  $('quizProgressBar').style.width = (currentQIdx / activeQuizData.length * 100) + '%';
  const grid = $('kahootGrid');
  grid.innerHTML = '';
  q.options.forEach((txt, i) => {
    const b = document.createElement('button');
    b.className = 'kahoot-btn ' + kahootColors[i % 4];
    b.innerHTML = `<span>${kahootShapes[i % 4]}</span> <span>${txt}</span>`;
    b.onclick = () => selectAnswer(i, b);
    grid.appendChild(b);
  });
}
function selectAnswer(i, btn) {
  if (!canAnswer) return;
  canAnswer = false;
  const q = activeQuizData[currentQIdx];
  document.querySelectorAll('.kahoot-btn').forEach((b, idx) => {
    b.classList.add('disabled');
    if (idx === q.correct) b.classList.add('correct-anim');
  });
  if (i === q.correct) { userScore++; $('scoreCounter').innerText = `Score : ${userScore} pts`; }
  else btn.classList.add('wrong-anim');
  const nb = $('nextQuestionBtn');
  if (currentQIdx >= activeQuizData.length - 1) nb.innerText = 'Voir mon Bilan Final 🏆';
  nb.style.display = 'block';
}
function nextQuestion() {
  if (currentQIdx < activeQuizData.length - 1) { currentQIdx++; loadQuestion(); }
  else showFinalResult();
}
function showFinalResult() {
  $('quizProgressBar').style.width = '100%';
  $('quizGameArea').style.display = 'none';
  $('kahootResult').style.display = 'block';
  $('resultPlayerName').innerText = currentPlayerName;
  const note = Math.round(userScore / activeQuizData.length * 20);
  $('finalScoreDisplay').innerText = note + ' / 20';
  const badge = $('scoreBadge'), fb = $('finalFeedbackText');
  if (note >= 12) {
    badge.innerText = '🏆 Niveau Expert Préventif'; badge.style.background = '#dcfce7'; badge.style.color = '#15803d';
    fb.innerText = `Bravo ${currentPlayerName} ! Tu assures en prévention santé.`;
    playSoundEffect(true);
  } else {
    badge.innerText = '💡 À Consolider'; badge.style.background = '#fee2e2'; badge.style.color = '#b91c1c';
    fb.innerText = `Bien joué ${currentPlayerName} ! Continue d'explorer notre encyclopédie.`;
    playSoundEffect(false);
  }
}
function resetQuizSession() {
  $('kahootResult').style.display = 'none';
  $('quizNameSection').style.display = 'block';
  $('playerNameInput').value = '';
}

/* ---------- Formulaire : ouvre WhatsApp avec le message prérempli ---------- */
function handleFormSubmit(event) {
  event.preventDefault();
  const n = $('userName').value.trim(), m = $('userEmail').value.trim(), w = $('userWhatsapp').value.trim();
  const txt = `Bonjour, je suis ${n}. Email : ${m}. WhatsApp : ${w}. Je vous contacte depuis L'instant Santé.`;
  window.open('https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  const fb = $('formFeedback');
  fb.style.display = 'block'; fb.style.background = '#dcfce7'; fb.style.color = '#15803d';
  fb.innerText = 'WhatsApp s’ouvre : envoie le message prérempli pour finaliser.';
  $('contactMotionForm').reset();
}

/* ---------- Fiches (bouton WhatsApp) ---------- */
const FICHES = [
  ['🫀', 'HTA & prévention cardiovasculaire'], ['🩸', 'Diabète & équilibre glycémique'],
  ['👁️', 'Ergonomie visuelle & écrans'], ['🦟', 'Paludisme : prévention et réflexes'],
  ['🔥', 'Brûlures : les bons gestes'], ['🩹', 'Hémorragie & position latérale de sécurité'],
  ['😴', 'Sommeil & écrans'], ['🧂', 'Réduire le sel au quotidien'],
  ['🧘', 'Gérer le stress des examens'], ['💧', 'Hydratation au quotidien']
];
function renderFiches() {
  const box = $('fichesList');
  if (!box) return;
  box.innerHTML = FICHES.map((f, i) => {
    const num = String(i + 1).padStart(2, '0');
    const msg = encodeURIComponent(`Bonjour, je souhaite la fiche ${num} : ${f[1]} (L'instant Santé).`);
    return `<div class="category-block"><div class="category-title">${f[0]} Fiche ${num} · ${f[1]}</div><a class="btn-whatsapp" href="https://wa.me/${WHATSAPP_NUM}?text=${msg}" target="_blank" rel="noopener">💬 Demander cette fiche sur WhatsApp</a></div>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', renderFiches);
                   
