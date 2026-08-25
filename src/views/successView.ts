import type { GameModel } from '../model/gameModel'
import { renderBoard, renderCollection } from './board'
import { escapeHtml } from './escapeHtml'

export function renderSuccessScreen(model: GameModel, categoryKey: string, category: string): string {
  const safeCategory = escapeHtml(category)
  return `<main class="shell success-screen"><div class="penalty-top"><div class="brand-mark" aria-hidden="true">PX</div><span class="success-score">Punts <strong>${model.score}</strong></span></div>${renderBoard(model, categoryKey)}${renderCollection(model)}<div class="landed-badge">Formatget aconseguit <strong>${safeCategory}</strong></div><div class="comic-scene success-scene" aria-live="assertive"><div class="comic-caption success-caption">BRAVO!</div><div class="comic-character success-character"><div class="character-hat"></div><div class="character-face"><i></i><i></i><b></b></div><div class="character-body"><span>✦</span></div><div class="character-arm left"></div><div class="character-arm right"></div><div class="character-leg left"></div><div class="character-leg right"></div></div><div class="comic-bubble success-bubble">Aquesta la sabia!</div><div class="comic-shadow"></div></div><p class="eyebrow">${escapeHtml(category.toUpperCase())}</p><h1>Encertat!</h1><div class="success-readout"><strong>+1 punt</strong><span>Molt bé, continua així.</span></div><p class="success-count">Continuem en <b>3</b></p></main>`
}
