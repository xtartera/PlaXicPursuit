export function renderResultScreen(score: number, correctAnswers: number, total: number): string {
  return `<main class="shell result-screen"><div class="result-badge">${score} punts</div><p class="eyebrow">PARTIDA ACABADA</p><h1>Bon passeig pel Pla Xic.</h1><p>Has encertat ${correctAnswers} de ${total} preguntes.</p><button class="primary" id="restart" type="button">Tornar a jugar <span>↗</span></button></main>`
}
