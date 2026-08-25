import { suggestionFormUrl } from '../model/constants'
import type { GameModel } from '../model/gameModel'
import { boardCategoryKeys } from '../model/gameModel'
import { escapeHtml } from './escapeHtml'
import { renderBoard, renderCollection } from './board'

export function renderGameScreen(model: GameModel): string {
  const question = model.question
  const formatIndex = boardCategoryKeys.indexOf(question.category)
  const image = question.imageSrc
    ? `<figure class="question-media"><img src="${escapeHtml(question.imageSrc)}" alt="${escapeHtml(question.imageAlt ?? question.prompt)}" loading="lazy"></figure>`
    : ''
  const answers = question.options.map((option, index) => {
    const incorrect = model.wrongAnswers.has(index)
    return `<button class="answer${incorrect ? ' incorrect' : ''}" data-index="${index}" type="button" ${incorrect ? 'disabled' : ''}><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`
  }).join('')

  return `<main class="game-shell category-${formatIndex}"><header class="game-nav"><div class="wordmark"><span>PX</span><div><b>Pla Xic</b><small>Pursuit</small></div></div><div class="turn-counter">Carta <b>${model.currentQuestion + 1}</b> / ${model.questions.length}</div><div class="nav-actions"><div class="score"><span>Punts</span><strong>${model.score}</strong></div><button class="board-toggle" type="button" aria-label="Veure el taulell"><span class="board-toggle-icon"></span><strong>${model.acquiredCategories.size}/6</strong></button></div></header><div class="game-stage"><aside class="table-status"><p class="eyebrow">EL TEU RECORREGUT</p>${renderBoard(model)}${renderCollection(model)}</aside><section class="question-card" aria-live="polite"><div class="card-stripe"></div><div class="card-meta"><span class="category-token"><i></i>${escapeHtml(question.categoryLabel)}</span><span>${escapeHtml(question.difficulty)}</span></div><div class="progress-track" aria-hidden="true"><span style="width:${model.progressPercent}%"></span></div><h1>${escapeHtml(question.prompt)}</h1>${image}<div class="answers" role="group" aria-label="Opcions de resposta">${answers}</div><div class="feedback" id="feedback" hidden></div></section></div><footer class="game-footer"><a href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una carta</a><span>Partida local · Pla Xic</span><button class="quit" type="button">Abandonar partida</button></footer></main>`
}
