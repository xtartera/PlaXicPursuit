import type { Question } from './model/questions'
import { GameModel } from './model/gameModel'
import { playResultSound } from './audio'
import { renderStartScreen } from './views/startView'
import { renderGameScreen } from './views/gameView'
import { renderResultScreen } from './views/resultView'
import { answerFeedbackHtml, feedbackDurationMs } from './views/feedback'

export class GameController {
  readonly app: HTMLDivElement
  readonly model: GameModel
  private timer: number | undefined
  private visibilityHandler: (() => void) | undefined
  private pauseReasons = new Set<string>()

  constructor(app: HTMLDivElement, questions: Question[]) {
    this.app = app
    this.model = new GameModel(questions)
  }

  start(): void {
    this.showStartScreen()
  }

  private clearTimer(): void {
    if (this.timer !== undefined) window.clearInterval(this.timer)
    this.timer = undefined
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler)
    this.visibilityHandler = undefined
    this.pauseReasons.clear()
  }

  private showStartScreen(): void {
    this.clearTimer()
    this.model.reset()
    this.app.innerHTML = renderStartScreen(this.model.questions.length)
    this.app.querySelector<HTMLButtonElement>('#start')?.addEventListener('click', () => this.showGameScreen())
  }

  private showGameScreen(): void {
    this.clearTimer()
    this.app.innerHTML = renderGameScreen(this.model)
    this.app.querySelectorAll<HTMLButtonElement>('.answer').forEach((button) => {
      button.addEventListener('click', () => this.chooseAnswer(Number(button.dataset.index)))
    })
    this.app.querySelector<HTMLButtonElement>('.quit')?.addEventListener('click', () => this.showStartScreen())
  }

  private chooseAnswer(index: number): void {
    if (this.model.answered) return
    const result = this.model.submitAnswer(index)
    playResultSound(result.correct)
    this.showGameScreen()
    this.showFeedback(result.correct)
  }

  private showFeedback(correct: boolean): void {
    const feedback = this.app.querySelector<HTMLDivElement>('#feedback')!
    const duration = feedbackDurationMs(correct, this.model.question.explanation)
    feedback.hidden = false
    feedback.classList.add(correct ? 'is-correct' : 'is-incorrect')
    feedback.innerHTML = answerFeedbackHtml(this.model.question, correct, duration)
    feedback.tabIndex = -1
    feedback.focus({ preventScroll: true })
    this.startAutoAdvance(feedback, duration)
  }

  private startAutoAdvance(feedback: HTMLDivElement, duration: number): void {
    let remaining = duration
    let previous = performance.now()
    const pauseButton = feedback.querySelector<HTMLButtonElement>('#pause-advance')!
    const updatePauseButton = () => {
      const paused = this.pauseReasons.has('manual')
      pauseButton.textContent = paused ? '▶' : 'Ⅱ'
      pauseButton.setAttribute('aria-pressed', String(paused))
      pauseButton.setAttribute('aria-label', paused ? "Reprendre l'avanç automàtic" : "Pausar l'avanç automàtic")
    }
    pauseButton.addEventListener('click', () => {
      if (this.pauseReasons.has('manual')) this.pauseReasons.delete('manual')
      else this.pauseReasons.add('manual')
      updatePauseButton()
    })
    feedback.addEventListener('pointerenter', () => this.pauseReasons.add('pointer'))
    feedback.addEventListener('pointerleave', () => this.pauseReasons.delete('pointer'))
    feedback.addEventListener('focusin', (event) => {
      if (event.target !== feedback && event.target !== pauseButton) this.pauseReasons.add('focus')
    })
    feedback.addEventListener('focusout', () => this.pauseReasons.delete('focus'))
    this.visibilityHandler = () => {
      if (document.hidden) this.pauseReasons.add('hidden')
      else this.pauseReasons.delete('hidden')
    }
    document.addEventListener('visibilitychange', this.visibilityHandler)
    this.timer = window.setInterval(() => {
      const now = performance.now()
      if (this.pauseReasons.size === 0) remaining -= now - previous
      previous = now
      const seconds = Math.max(0, Math.ceil(remaining / 1000))
      const label = feedback.querySelector('#advance-label')
      const progress = feedback.querySelector<HTMLElement>('#advance-progress')
      if (label) label.textContent = `${this.model.isLastQuestion ? 'Resultat' : 'Següent pregunta'} en ${seconds} segons`
      if (progress) progress.style.width = `${Math.max(0, (remaining / duration) * 100)}%`
      if (remaining <= 0) this.nextQuestion()
    }, 100)
  }

  private nextQuestion(): void {
    this.clearTimer()
    if (this.model.isLastQuestion) this.showResultScreen()
    else {
      this.model.advance()
      this.showGameScreen()
    }
  }

  private showResultScreen(): void {
    this.app.innerHTML = renderResultScreen(this.model)
    this.app.querySelector<HTMLButtonElement>('#restart')?.addEventListener('click', () => this.showStartScreen())
  }
}
