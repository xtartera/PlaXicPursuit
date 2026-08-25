function nextButtonHtml(isLastQuestion: boolean): string {
  return `<button id="next" type="button">${isLastQuestion ? 'Veure resultat' : 'Següent pregunta'} <span aria-hidden="true">→</span></button>`
}

export function correctFeedbackHtml(explanation: string, isLastQuestion: boolean): string {
  return `<strong>Molt bé!</strong><span>${explanation}</span>${nextButtonHtml(isLastQuestion)}`
}

export function exhaustedFeedbackHtml(isLastQuestion: boolean): string {
  return `<strong>Opcions esgotades</strong><span>No has trobat la resposta aquesta vegada.</span>${nextButtonHtml(isLastQuestion)}`
}
