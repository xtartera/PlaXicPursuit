import type { GameModel } from '../model/gameModel'
import { boardCategories, boardCategoryKeys } from '../model/gameModel'

export function renderBoard(model: GameModel, landedCategory = ''): string {
  const progress = Math.min(model.currentQuestion + (model.answered ? 1 : 0), 6)
  const orbitPosition = model.answered ? (progress * 2) % 12 : (progress * 2 + 1) % 12
  const isStart = progress === 0 && !model.answered
  return `<div class="board-wrap ${isStart ? 'is-start' : ''}" aria-label="Progrés de la partida"><div class="board" style="--pawn-position: ${orbitPosition}"><div class="board-orbit">${Array.from({ length: 12 }, (_, index) => {
    const categoryIndex = index / 2
    const isFormatSpace = index % 2 === 0
    const category = isFormatSpace ? boardCategories[categoryIndex] : ''
    const landed = isFormatSpace && boardCategoryKeys[categoryIndex] === landedCategory
    return `<span class="orbit-space ${isFormatSpace ? `format-space format-${categoryIndex} ${landed ? 'is-landed' : ''}` : ''} ${index === orbitPosition ? 'is-current' : ''}" ${category ? `title="Formatget: ${category}"` : ''}></span>`
  }).join('')}</div><div class="board-center"><span>PX</span><small>${progress}/6</small></div><div class="pawn" aria-hidden="true"><span></span></div></div></div>`
}

export function renderCollection(model: GameModel): string {
  return `<section class="collection" aria-label="Formatgets de la partida"><div class="collection-heading"><span>Formatgets</span><strong>${model.acquiredCategories.size}/6 aconseguits</strong></div><div class="collection-list">${boardCategories
    .map(
      (category, index) =>
        `<span class="collection-item format-${index} ${model.acquiredCategories.has(boardCategoryKeys[index]) ? 'is-acquired' : ''}"><i></i>${category}<b>${model.acquiredCategories.has(boardCategoryKeys[index]) ? 'Aconseguit' : 'Pendent'}</b></span>`,
    )
    .join('')}</div></section>`
}

export function renderBoardModal(model: GameModel): string {
  return `<div class="board-modal" role="dialog" aria-modal="true" aria-label="Progrés de la partida"><button class="modal-close" type="button" aria-label="Tancar">&times;</button><p class="eyebrow">EL TEU PROGRÉS</p>${renderBoard(model)}${renderCollection(model)}</div>`
}
