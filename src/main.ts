import './style.css'
import questionsMarkdown from '../content/questions.md?raw'

type Question = { id: string; category: string; categoryLabel: string; difficulty: string; prompt: string; options: string[]; answer: number; explanation: string; imageSrc?: string; imageAlt?: string }
const categoryLabels: Record<string, string> = { historia: 'Història', memoria: 'Memòria', cultura: 'Cultura', llocs: 'Llocs' }

function parseQuestions(markdown: string): Question[] {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n')
  const blocks = [...normalizedMarkdown.matchAll(/^---\n([\s\S]*?)\n---\n([\s\S]*?)(?=\n---\n|(?![\s\S]))/gm)]
  return blocks.flatMap((match) => {
    const lines = `${match[1]}\n${match[2]}`.trim().split('\n')
    const metadata = Object.fromEntries(lines.filter((line) => line.includes(':')).map((line) => { const [key, ...value] = line.split(':'); return [key.trim(), value.join(':').trim().replace(/^['"]|['"]$/g, '')] }))
    const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim()
    const imageMatch = lines.find((line) => /^!\[[^\]]*\]\([^)]+\)$/.test(line))?.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    const options = lines.filter((line) => /^[A-D]\. /.test(line)).map((line) => line.slice(3).trim())
    const explanation = lines.find((line) => line.startsWith('> '))?.slice(2).trim() ?? ''
    const answer = options.findIndex((_, index) => String.fromCharCode(65 + index) === metadata.answer)
    if (!metadata.id || !title || options.length < 2 || answer < 0) return []
    return [{ id: metadata.id, category: metadata.category, categoryLabel: categoryLabels[metadata.category] ?? metadata.category, difficulty: metadata.difficulty, prompt: title, options, answer, explanation, imageSrc: imageMatch?.[2], imageAlt: imageMatch?.[1] }]
  })
}

const questions = parseQuestions(questionsMarkdown)
let currentQuestion = 0
let score = 0
let answered = false
let penaltyTimer: number | undefined
let wrongAnswers = new Set<number>()
const acquiredCategories = new Set<string>()
const app = document.querySelector<HTMLDivElement>('#app')!
const boardCategories = ['Història', 'Llocs', 'Cultura', 'Memòria', 'Gent', 'Futur']
const boardCategoryKeys = ['historia', 'llocs', 'cultura', 'memoria', 'gent', 'futur']
const suggestionFormUrl = 'https://forms.gle/4UN1E7PeDZRhgF348'
let audioContext: AudioContext | undefined

function playResultSound(correct: boolean): void {
  audioContext ??= new AudioContext()
  const now = audioContext.currentTime
  const notes = correct ? [523.25, 783.99] : [220, 146.83]
  notes.forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator()
    const gain = audioContext!.createGain()
    const start = now + index * 0.12
    oscillator.type = correct ? 'sine' : 'triangle'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(correct ? 0.12 : 0.09, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2)
    oscillator.connect(gain)
    gain.connect(audioContext!.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.21)
  })
}

function renderBoard(landedCategory = ''): string {
  const progress = Math.min(currentQuestion + (answered ? 1 : 0), 6)
  const orbitPosition = answered ? (progress * 2) % 12 : (progress * 2 + 1) % 12
  const isStart = progress === 0 && !answered
  return `<div class="board-wrap ${isStart ? 'is-start' : ''}" aria-label="Progrés de la partida"><div class="board" style="--pawn-position: ${orbitPosition}"><div class="board-orbit">${Array.from({ length: 12 }, (_, index) => { const categoryIndex = index / 2; const isFormatSpace = index % 2 === 0; const category = isFormatSpace ? boardCategories[categoryIndex] : ''; const landed = isFormatSpace && boardCategoryKeys[categoryIndex] === landedCategory; return `<span class="orbit-space ${isFormatSpace ? `format-space format-${categoryIndex} ${landed ? 'is-landed' : ''}` : ''} ${index === orbitPosition ? 'is-current' : ''}" ${category ? `title="Formatget: ${category}"` : ''}></span>` }).join('')}</div><div class="board-center"><span>PX</span><small>${progress}/6</small></div><div class="pawn" aria-hidden="true"><span></span></div></div></div>`
}

function renderCollection(): string {
  return `<section class="collection" aria-label="Formatgets de la partida"><div class="collection-heading"><span>Formatgets</span><strong>${acquiredCategories.size}/6 aconseguits</strong></div><div class="collection-list">${boardCategories.map((category, index) => `<span class="collection-item format-${index} ${acquiredCategories.has(boardCategoryKeys[index]) ? 'is-acquired' : ''}"><i></i>${category}<b>${acquiredCategories.has(boardCategoryKeys[index]) ? 'Aconseguit' : 'Pendent'}</b></span>`).join('')}</div></section>`
}

function render(resetAttempts = true): void {
  if (penaltyTimer) window.clearInterval(penaltyTimer)
  if (resetAttempts) wrongAnswers = new Set<number>()
  const question = questions[currentQuestion]
  const progress = Math.round((currentQuestion / questions.length) * 100)
  app.innerHTML = `<main class="shell game-shell"><header class="topbar"><div class="brand-mark" aria-hidden="true">PX</div><div><p class="eyebrow">PLA XIC</p><h1>Pursuit</h1></div><div class="score"><span>Punts</span><strong>${score}</strong></div></header><section class="game-panel" aria-live="polite"><div class="progress-row"><span>Pregunta ${currentQuestion + 1} de ${questions.length}</span><span>${progress}%</span></div><div class="progress-track"><span style="width: ${progress}%"></span></div><div class="question-meta"><span class="category-dot"></span><span>${question.categoryLabel}</span><span class="difficulty">${question.difficulty}</span></div><h2>${question.prompt}</h2>${question.imageSrc ? `<figure class="question-media"><img src="${question.imageSrc}" alt="${question.imageAlt ?? question.prompt}" loading="lazy"></figure>` : ''}<div class="answers" role="group" aria-label="Opcions de resposta">${question.options.map((option, index) => `<button class="answer ${wrongAnswers.has(index) ? 'incorrect' : ''}" data-index="${index}" type="button" ${wrongAnswers.has(index) ? 'disabled' : ''}><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div><div class="feedback" id="feedback" hidden></div></section><footer class="game-footer"><span class="mini-dot"></span><span>Una partida feta al barri, per al barri</span><a class="suggest-link" href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una pregunta <span aria-hidden="true">↗</span></a><button class="quit" type="button">Sortir</button></footer></main>`
  document.querySelectorAll<HTMLButtonElement>('.answer').forEach((button) => button.addEventListener('click', () => chooseAnswer(Number(button.dataset.index))))
  document.querySelector<HTMLButtonElement>('.quit')?.addEventListener('click', startScreen)
}

function chooseAnswer(index: number): void {
  if (answered) return
  answered = true
  const question = questions[currentQuestion]
  playResultSound(index === question.answer)
  if (index === question.answer) {
    score += 1
    acquiredCategories.add(question.category)
    showSuccessScreen(question.category, question.categoryLabel, question.explanation)
  } else {
    answered = false
    wrongAnswers.add(index)
    score = Math.max(0, score - 1)
    const remaining = question.options.length - wrongAnswers.size
    showPenaltyScreen(question.categoryLabel, remaining)
  }
  document.querySelector<HTMLSpanElement>('.score strong')?.replaceChildren(String(score))
}

function showSuccessScreen(categoryKey: string, category: string, explanation: string): void {
  app.innerHTML = `<main class="shell success-screen"><div class="penalty-top"><div class="brand-mark" aria-hidden="true">PX</div><span class="success-score">Punts <strong>${score}</strong></span></div>${renderBoard(categoryKey)}${renderCollection()}<div class="landed-badge">Formatget aconseguit <strong>${category}</strong></div><div class="comic-scene success-scene" aria-live="assertive"><div class="comic-caption success-caption">BRAVO!</div><div class="comic-character success-character"><div class="character-hat"></div><div class="character-face"><i></i><i></i><b></b></div><div class="character-body"><span>✦</span></div><div class="character-arm left"></div><div class="character-arm right"></div><div class="character-leg left"></div><div class="character-leg right"></div></div><div class="comic-bubble success-bubble">Aquesta la sabia!</div><div class="comic-shadow"></div></div><p class="eyebrow">${category.toUpperCase()}</p><h1>Encertat!</h1><div class="success-readout"><strong>+1 punt</strong><span>Molt bé, continua així.</span></div><p class="success-count">Continuem en <b>3</b></p></main>`
  let secondsLeft = 3
  penaltyTimer = window.setInterval(() => {
    secondsLeft -= 1
    const counter = document.querySelector<HTMLElement>('.success-count b')
    if (counter) counter.textContent = String(secondsLeft)
    if (secondsLeft === 0) {
      window.clearInterval(penaltyTimer)
      render(false)
      document.querySelectorAll<HTMLButtonElement>('.answer').forEach((button) => { button.disabled = true })
      showFeedback(explanation, `<strong>Molt bé!</strong><span>${explanation}</span><button id="next" type="button">${currentQuestion === questions.length - 1 ? 'Veure resultat' : 'Següent pregunta'} <span aria-hidden="true">→</span></button>`)
    }
  }, 1000)
}

function showPenaltyScreen(category: string, remaining: number): void {
  app.innerHTML = `<main class="shell penalty-screen"><div class="penalty-top"><div class="brand-mark" aria-hidden="true">PX</div><span class="penalty-score">Punts <strong>${score}</strong></span></div>${renderBoard()}${renderCollection()}<div class="comic-scene" aria-live="assertive"><div class="comic-caption">UPS!</div><div class="comic-character"><div class="character-hat"></div><div class="character-face"><i></i><i></i><b></b></div><div class="character-body"><span>?</span></div><div class="character-arm left"></div><div class="character-arm right"></div><div class="character-leg left"></div><div class="character-leg right"></div></div><div class="comic-bubble">On era aquesta...?</div><div class="comic-shadow"></div></div><p class="eyebrow">${category.toUpperCase()}</p><h1>No és aquesta.</h1><div class="penalty-readout"><strong>−1 punt</strong><span>Opció descartada. Sense pistes.</span></div><p class="penalty-count">Tornem-hi en <b>4</b></p></main>`
  let secondsLeft = 4
  penaltyTimer = window.setInterval(() => {
    secondsLeft -= 1
    const counter = document.querySelector<HTMLElement>('.penalty-count b')
    if (counter) counter.textContent = String(secondsLeft)
    if (secondsLeft === 0) {
      window.clearInterval(penaltyTimer)
      render(false)
      if (remaining === 0) {
        answered = true
        showFeedback('', `<strong>Opcions esgotades</strong><span>No has trobat la resposta aquesta vegada.</span><button id="next" type="button">${currentQuestion === questions.length - 1 ? 'Veure resultat' : 'Següent pregunta'} <span aria-hidden="true">→</span></button>`)
      }
    }
  }, 1000)
}

function showFeedback(explanation: string, content: string): void {
  const feedback = document.querySelector<HTMLDivElement>('#feedback')!
  feedback.hidden = false
  feedback.innerHTML = `${content}${explanation && content.includes('Molt bé') ? '' : `<span>${explanation}</span>`}`
  document.querySelector<HTMLButtonElement>('#next')?.addEventListener('click', nextQuestion)
}

function nextQuestion(): void {
  if (currentQuestion === questions.length - 1) { app.innerHTML = `<main class="shell result-screen"><div class="result-badge">${score}/${questions.length}</div><p class="eyebrow">PARTIDA ACABADA</p><h1>Bon passeig pel Pla Xic.</h1><p>Has encertat ${score} de ${questions.length} preguntes.</p><button class="primary" id="restart" type="button">Tornar a jugar <span>↗</span></button></main>`; document.querySelector<HTMLButtonElement>('#restart')?.addEventListener('click', startScreen); return }
  currentQuestion += 1; answered = false; render()
}

function startScreen(): void {
  score = 0; currentQuestion = 0; answered = false
  acquiredCategories.clear()
  app.innerHTML = `<main class="shell start-screen"><div class="start-top"><div class="brand-mark large" aria-hidden="true">PX</div><span class="live-pill"><span></span> Joc en proves</span></div><div class="start-layout"><div class="start-copy"><p class="eyebrow">TRIVIAL DEL BARRI</p><h1>Quant coneixes<br><em>el Pla Xic?</em></h1><p class="intro">Una partida curta per descobrir històries, llocs i veus que fan únic el nostre barri.</p><div class="start-actions"><button class="primary" id="start" type="button">Començar la partida <span>↗</span></button><a class="suggest-link" id="start-suggest" href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una pregunta <span aria-hidden="true">↗</span></a></div><div class="start-note"><span>✦</span> ${questions.length} preguntes preparades<br><span>⌁</span> Dissenyat per jugar en colla</div></div><div class="start-visual" aria-label="Tauler del Pla Xic"><div class="visual-label">JUGA · RECORRE · DESCOBREIX</div><div class="visual-board"><div class="visual-ring ring-one"></div><div class="visual-ring ring-two"></div><div class="visual-core">PX<small>pursuit</small></div>${Array.from({ length: 12 }, (_, index) => `<i class="visual-space space-${index} ${index % 2 === 0 ? 'special' : ''}"></i>`).join('')}<b class="visual-pawn"></b></div><div class="visual-sticker">6<br><small>categories</small></div></div></div></main>`
  document.querySelector<HTMLButtonElement>('#start')?.addEventListener('click', () => render())
}

startScreen()
