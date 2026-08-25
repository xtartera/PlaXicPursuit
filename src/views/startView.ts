import { suggestionFormUrl } from '../model/constants'

function startBoardHtml(): string {
  const spaces = Array.from({ length: 24 }, (_, index) => {
    const category = index % 4 === 0 ? ` format-${index / 4}` : ''
    return `<i class="start-space space-${index}${category}" style="--i:${index}"></i>`
  }).join('')
  return `<div class="start-board" aria-hidden="true"><div class="start-track">${spaces}</div><div class="start-hub"><b>PX</b><span>PURSUIT</span></div><div class="start-die"><i></i><i></i><i></i><i></i><i></i></div><div class="start-pawn"><i></i></div></div>`
}

export function renderStartScreen(questionsCount: number): string {
  return `<main class="start-screen"><header class="start-nav"><div class="wordmark"><span>PX</span><div><b>Pla Xic</b><small>Pursuit</small></div></div><span class="edition">Edició del barri · 2026</span></header><section class="start-hero"><div class="start-copy"><p class="eyebrow">EL JOC DE TAULA DEL PLA XIC</p><h1>Recorre el barri.<br><em>Guanya els formatgets.</em></h1><p class="intro">Sis categories, un tauler i totes les històries que ens fan ser d'aquí.</p><div class="start-actions"><button class="primary" id="start" type="button">Començar partida <span aria-hidden="true">→</span></button><a class="suggest-link" href="${suggestionFormUrl}" target="_blank" rel="noreferrer">Proposa una carta</a></div><div class="game-facts"><span><b>${questionsCount}</b> cartes</span><span><b>6</b> formatgets</span><span><b>1</b> barri</span></div></div><div class="start-table">${startBoardHtml()}<p>Preparat per jugar</p></div></section></main>`
}
