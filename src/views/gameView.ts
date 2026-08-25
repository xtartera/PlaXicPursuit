import type { GameModel } from '../model/gameModel'
import { boardCategoryKeys } from '../model/gameModel'
import { suggestionFormUrl } from '../model/constants'
import { escapeHtml } from './escapeHtml'

export function renderGameScreen(model: GameModel): string {
  const question = model.question
  const formatIndex = boardCategoryKeys.indexOf(question.category)
  return `<main class="shell game-shell"><header class="topbar"><div class="brand-mark" aria-hidden="true">PX</div><div><p class="eyebrow">PLA XIC</p><h1>Pursuit</h1></div><div class="topbar-actions"><div class="score"><span>Punts</span><strong>${model.score}</strong></div><button class="board-toggle" type="button" aria-label="Veure el taulell i els formatgets"><span class="board-toggle-icon"></span><strong>${model.acquiredCategories.size}/6</strong></button></div></header><section class="game-panel" aria-live="polite"><div class="progress-row"><span>Pregunta ${model.currentQuestion + 1} de ${model.questions.length}</span><span>${model.progressPercent}%</span></div><div class="progress-track"><span style="width: ${model.progressPercent}%"></span></div><div class="formatget-badge format-${formatIndex}"><span class="formatget-icon"></span><div class="formatget-text"><small>Formatget en joc</small><strong>${escapeHtml(question.categoryLabel)}</strong></div><span class="difficulty">${escapeHtml(question.difficulty)}</span></div><h2>${escapeHtml(question.prompt)}</h2>${question.imageSrc ? `<figure class="question-media"><img src="${escapeHtml(question.imageSrc)}" alt="${escapeHtml(question.imageAlt ?? question.prompt)}" loading="lazy"></figure>` : ''}<div class="answers" role="group" aria-label="Opcions de resposta">${question.options
    .map(
      (option, index) =>
        `<button class="answer ${model.wrongAnswers.has(index) ? 'incorrect' : ''}" data-index="${index}" type="button" ${model.wrongAnswers.has(index) ? 'disabled' : ''}><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`,
    )
    .join('')}</div><div class="feedback" id="feedback" hidden></div></section><footer class="game-footer"><span class="mini-dot"></span><span>Una partida feta al barri, per al barri</span><a class="suggest-link" href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una pregunta <span aria-hidden="true">↗</span></a><button class="quit" type="button">Sortir</button></footer></main>`
}
