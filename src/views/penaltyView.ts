import type { GameModel } from '../model/gameModel'
import { renderBoard, renderCollection } from './board'

export function renderPenaltyScreen(model: GameModel, category: string): string {
  return `<main class="shell penalty-screen"><div class="penalty-top"><div class="brand-mark" aria-hidden="true">PX</div><span class="penalty-score">Punts <strong>${model.score}</strong></span></div>${renderBoard(model)}${renderCollection(model)}<div class="comic-scene" aria-live="assertive"><div class="comic-caption">UPS!</div><div class="comic-character"><div class="character-hat"></div><div class="character-face"><i></i><i></i><b></b></div><div class="character-body"><span>?</span></div><div class="character-arm left"></div><div class="character-arm right"></div><div class="character-leg left"></div><div class="character-leg right"></div></div><div class="comic-bubble">On era aquesta...?</div><div class="comic-shadow"></div></div><p class="eyebrow">${category.toUpperCase()}</p><h1>No és aquesta.</h1><div class="penalty-readout"><strong>−1 punt</strong><span>Opció descartada. Sense pistes.</span></div><p class="penalty-count">Tornem-hi en <b>4</b></p></main>`
}
