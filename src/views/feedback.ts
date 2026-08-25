import type { Question } from '../model/questions'
import { escapeHtml } from './escapeHtml.ts'

export function feedbackDurationMs(correct: boolean, explanation: string): number {
  const base = correct ? 4000 : 7000
  const extra = Math.max(0, explanation.trim().split(/\s+/).length - 20) * 100
  return Math.min(10000, base + extra)
}

export function answerFeedbackHtml(question: Question, correct: boolean, durationMs: number): string {
  const title = correct ? 'Molt bé!' : 'No era aquesta.'
  const lead = correct ? 'Has trobat la resposta.' : `La resposta correcta és ${question.options[question.answer]}.`
  return `<div class="feedback-layout"><div class="feedback-mark" aria-hidden="true">${correct ? '✓' : '×'}</div><div class="feedback-copy"><strong id="feedback-title">${title}</strong><span>${escapeHtml(lead)}</span>${question.explanation ? `<p>${escapeHtml(question.explanation)}</p>` : ''}</div></div><div class="auto-advance"><div><span id="advance-label">Següent pregunta en ${Math.ceil(durationMs / 1000)} segons</span><button id="pause-advance" type="button" aria-pressed="false" aria-label="Pausar l'avanç automàtic" title="Pausar l'avanç automàtic">Ⅱ</button></div><div class="advance-track" role="progressbar" aria-label="Temps fins a la pregunta següent" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><span id="advance-progress" style="width:100%"></span></div></div>`
}
