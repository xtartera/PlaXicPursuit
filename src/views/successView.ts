import type { GameModel } from '../model/gameModel'
import { escapeHtml } from './escapeHtml'
import { renderBoard, renderCollection } from './board'

export function renderSuccessScreen(model: GameModel, categoryKey: string, category: string): string {
  return `<main class="outcome-screen success-screen"><header class="outcome-nav"><div class="wordmark"><span>PX</span><div><b>Pla Xic</b><small>Pursuit</small></div></div><div class="score"><span>Punts</span><strong>${model.score}</strong></div></header><section class="outcome-table"><div class="outcome-board">${renderBoard(model, categoryKey)}<div class="earned-wedge format-${categoryKey}"><span></span></div></div><div class="outcome-copy"><p class="eyebrow">FORMATGET ACONSEGUIT</p><h1>És teu!</h1><div class="wedge-name"><i></i><span>${escapeHtml(category)}</span></div><p>Has encertat la carta i afegeixes una nova peça a la teva col·lecció.</p><div class="point-change positive">+1 punt</div><p class="success-count countdown">Nova carta en <b>3</b></p></div></section>${renderCollection(model)}</main>`
}
