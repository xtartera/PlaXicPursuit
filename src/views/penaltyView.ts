import type { GameModel } from '../model/gameModel'
import { escapeHtml } from './escapeHtml'
import { renderBoard, renderCollection } from './board'

export function renderPenaltyScreen(model: GameModel, category: string): string {
  return `<main class="outcome-screen penalty-screen"><header class="outcome-nav"><div class="wordmark"><span>PX</span><div><b>Pla Xic</b><small>Pursuit</small></div></div><div class="score"><span>Punts</span><strong>${model.score}</strong></div></header><section class="outcome-table"><div class="outcome-board missed-board">${renderBoard(model)}<div class="miss-marker">×</div></div><div class="outcome-copy"><p class="eyebrow">${escapeHtml(category.toUpperCase())}</p><h1>No era aquesta.</h1><p>La fitxa es queda a la casella. Descartem aquesta opció i tornem a la carta.</p><div class="point-change negative">−1 punt</div><p class="penalty-count countdown">Tornem-hi en <b>4</b></p></div></section>${renderCollection(model)}</main>`
}
