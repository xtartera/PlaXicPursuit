import type { Question } from './model/questions'
import { GameModel } from './model/gameModel'
import { playResultSound } from './audio'
import { renderBoardModal } from './views/board'
import { renderStartScreen } from './views/startView'
import { renderGameScreen } from './views/gameView'
import { renderSuccessScreen } from './views/successView'
import { renderPenaltyScreen } from './views/penaltyView'
import { renderResultScreen } from './views/resultView'
import { correctFeedbackHtml, exhaustedFeedbackHtml } from './views/feedback'

export class GameController {
  readonly app: HTMLDivElement
  readonly model: GameModel
  private countdownTimer: number | undefined

  constructor(app: HTMLDivElement, questions: Question[]) {
    this.app = app
    this.model = new GameModel(questions)
  }

  start(): void {
    this.showStartScreen()
  }

  private clearCountdown(): void {
    if (this.countdownTimer !== undefined) window.clearInterval(this.countdownTimer)
  }

  private showStartScreen(): void {
    this.clearCountdown()
    this.model.reset()
    this.app.innerHTML = renderStartScreen(this.model.questions.length)
    this.app.querySelector<HTMLButtonElement>('#start')?.addEventListener('click', () => this.showGameScreen())
  }

  private showGameScreen(): void {
    this.app.innerHTML = renderGameScreen(this.model)
    this.app
      .querySelectorAll<HTMLButtonElement>('.answer')
      .forEach((button) => button.addEventListener('click', () => this.chooseAnswer(Number(button.dataset.index))))
    this.app.querySelector<HTMLButtonElement>('.quit')?.addEventListener('click', () => this.showStartScreen())
    this.app.querySelector<HTMLButtonElement>('.board-toggle')?.addEventListener('click', () => this.showBoardModal())
  }

  private showBoardModal(): void {
    const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop board-modal-backdrop'
    backdrop.innerHTML = renderBoardModal(this.model)
    document.body.appendChild(backdrop)
    const close = () => {
      backdrop.remove()
      document.removeEventListener('keydown', onKeydown)
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) close()
    })
    backdrop.querySelector('.modal-close')?.addEventListener('click', close)
    document.addEventListener('keydown', onKeydown)
  }

  private chooseAnswer(index: number): void {
    if (this.model.answered) return
    const question = this.model.question
    const result = this.model.submitAnswer(index)
    playResultSound(result.correct)
    if (result.correct) {
      this.showSuccessScreen(question.category, question.categoryLabel, question.explanation)
    } else {
      this.showPenaltyScreen(question.categoryLabel, result.remaining)
    }
  }

  private showSuccessScreen(categoryKey: string, category: string, explanation: string): void {
    this.clearCountdown()
    this.app.innerHTML = renderSuccessScreen(this.model, categoryKey, category)
    let secondsLeft = 3
    this.countdownTimer = window.setInterval(() => {
      secondsLeft -= 1
      const counter = this.app.querySelector<HTMLElement>('.success-count b')
      if (counter) counter.textContent = String(secondsLeft)
      if (secondsLeft === 0) {
        this.clearCountdown()
        this.showGameScreen()
        this.app.querySelectorAll<HTMLButtonElement>('.answer').forEach((button) => (button.disabled = true))
        this.showFeedback(correctFeedbackHtml(explanation, this.model.isLastQuestion))
      }
    }, 1000)
  }

  private showPenaltyScreen(category: string, remaining: number): void {
    this.clearCountdown()
    this.app.innerHTML = renderPenaltyScreen(this.model, category)
    let secondsLeft = 4
    this.countdownTimer = window.setInterval(() => {
      secondsLeft -= 1
      const counter = this.app.querySelector<HTMLElement>('.penalty-count b')
      if (counter) counter.textContent = String(secondsLeft)
      if (secondsLeft === 0) {
        this.clearCountdown()
        if (remaining === 0) {
          this.model.exhaustOptions()
          this.showGameScreen()
          this.showFeedback(exhaustedFeedbackHtml(this.model.isLastQuestion))
        } else {
          this.showGameScreen()
        }
      }
    }, 1000)
  }

  private showFeedback(html: string): void {
    const feedback = this.app.querySelector<HTMLDivElement>('#feedback')!
    feedback.hidden = false
    feedback.innerHTML = html
    feedback.querySelector<HTMLButtonElement>('#next')?.addEventListener('click', () => this.nextQuestion())
  }

  private nextQuestion(): void {
    if (this.model.isLastQuestion) {
      this.showResultScreen()
      return
    }
    this.model.advance()
    this.showGameScreen()
  }

  private showResultScreen(): void {
    this.app.innerHTML = renderResultScreen(this.model)
    this.app.querySelector<HTMLButtonElement>('#restart')?.addEventListener('click', () => this.showStartScreen())
  }
}
