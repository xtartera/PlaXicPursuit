import { suggestionFormUrl } from '../model/constants'
import type { GameModel } from '../model/gameModel'
import { escapeHtml } from './escapeHtml'

export function renderGameScreen(model: GameModel): string {
  const question = model.question
  const image = question.imageSrc ? `<figure class="question-media"><img src="${escapeHtml(question.imageSrc)}" alt="${escapeHtml(question.imageAlt ?? question.prompt)}" loading="lazy"></figure>` : ''
  const answers = question.options.map((option, index) => {
    const selected = model.selectedAnswer === index
    const correct = model.answered && question.answer === index
    const classes = ['answer', selected ? 'is-selected' : '', correct ? 'is-correct' : '', selected && !correct ? 'is-incorrect' : ''].filter(Boolean).join(' ')
    const state = correct ? '<small>Resposta correcta</small>' : selected ? '<small>La teva resposta</small>' : ''
    return `<button class="${classes}" data-index="${index}" type="button" ${model.answered ? 'disabled' : ''}><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}${state}</span></button>`
  }).join('')
  return `<main class="quiz-game"><header class="quiz-nav"><div class="quiz-brand"><span>PX</span><strong>Quiz del Pla Xic</strong></div><div class="quiz-progress"><span>Pregunta ${model.currentQuestion + 1} de ${model.questions.length}</span><div><i style="width:${model.progressPercent}%"></i></div></div><div class="score"><small>Punts</small><b>${model.score}</b></div></header><section class="quiz-question"><div class="question-meta"><span>Pregunta ${model.currentQuestion + 1}</span><span>${escapeHtml(question.difficulty)}</span></div><h1>${escapeHtml(question.prompt)}</h1>${image}<div class="answers" role="group" aria-label="Opcions de resposta">${answers}</div><div class="feedback" id="feedback" hidden></div></section><footer class="quiz-footer"><a href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una pregunta</a><button class="quit" type="button">Sortir del quiz</button></footer></main>`
}
