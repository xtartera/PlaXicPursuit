import type { GameModel } from '../model/gameModel'

function resultMessage(percent: number): string {
  if (percent >= 90) return 'Memòria viva del barri.'
  if (percent >= 70) return 'Portes el Pla Xic ben après.'
  if (percent >= 40) return 'Ja coneixes uns quants racons.'
  return "Acabes d'arribar al barri."
}

export function renderResultScreen(model: GameModel): string {
  const percent = Math.round((model.correctAnswers / model.questions.length) * 100)
  return `<main class="quiz-result"><section><p class="eyebrow">QUIZ COMPLETAT</p><div class="result-ring" style="--result:${percent}"><div><b>${percent}%</b><span>d'encerts</span></div></div><h1>${resultMessage(percent)}</h1><p>Has descobert ${model.questions.length} petites històries del Pla Xic.</p><div class="result-stats"><span><b>${model.score}</b> punts</span><span><b>${model.correctAnswers}/${model.questions.length}</b> encerts</span></div><button class="primary" id="restart" type="button">Jugar una altra vegada <span aria-hidden="true">↻</span></button></section></main>`
}
