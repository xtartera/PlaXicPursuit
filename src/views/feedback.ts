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
  return `<div class="feedback-copy"><strong>${title}</strong><span>${escapeHtml(lead)}</span>${question.explanation ? `<p>${escapeHtml(question.explanation)}</p>` : ''}</div><div class="auto-advance" aria-live="polite"><div><span id="advance-label">Següent pregunta en ${Math.ceil(durationMs / 1000)} segons</span><button id="pause-advance" type="button" aria-pressed="false" aria-label="Pausar l'avanç automàtic">Ⅱ</button></div><div class="advance-track"><span id="advance-progress" style="width:100%"></span></div></div>`
}
