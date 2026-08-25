import type { GameModel } from '../model/gameModel'
import { renderCollection } from './board'

export function renderResultScreen(model: GameModel): string {
  const wedges = Array.from({ length: 6 }, (_, index) => `<i class="result-wedge wedge-${index}"></i>`).join('')
  return `<main class="result-screen"><div class="result-board" aria-hidden="true">${wedges}<div><b>PX</b><span>FINAL</span></div></div><section class="result-copy"><p class="eyebrow">PARTIDA ACABADA</p><h1>Has completat<br>la volta al barri.</h1><div class="result-stats"><span><b>${model.score}</b> punts</span><span><b>${model.correctAnswers}</b> encerts</span><span><b>${model.acquiredCategories.size}</b> formatgets</span></div>${renderCollection(model)}<button class="primary" id="restart" type="button">Tornar a jugar <span aria-hidden="true">↻</span></button></section></main>`
}
