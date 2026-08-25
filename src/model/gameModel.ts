import type { Question } from './questions'

export const boardCategories = ['Història', 'Llocs', 'Cultura', 'Memòria', 'Gent', 'Futur']
export const boardCategoryKeys = ['historia', 'llocs', 'cultura', 'memoria', 'gent', 'futur']

export type AnswerResult = { correct: boolean; remaining: number }

export class GameModel {
  readonly questions: Question[]
  currentQuestion = 0
  score = 0
  answered = false
  wrongAnswers = new Set<number>()
  acquiredCategories = new Set<string>()

  constructor(questions: Question[]) {
    this.questions = questions
  }

  get question(): Question {
    return this.questions[this.currentQuestion]
  }

  get isLastQuestion(): boolean {
    return this.currentQuestion === this.questions.length - 1
  }

  get progressPercent(): number {
    return Math.round((this.currentQuestion / this.questions.length) * 100)
  }

  reset(): void {
    this.currentQuestion = 0
    this.score = 0
    this.answered = false
    this.wrongAnswers = new Set()
    this.acquiredCategories = new Set()
  }

  submitAnswer(index: number): AnswerResult {
    const question = this.question
    const correct = index === question.answer
    if (correct) {
      this.answered = true
      this.score += 1
      this.acquiredCategories.add(question.category)
    } else {
      this.wrongAnswers.add(index)
      this.score = Math.max(0, this.score - 1)
    }
    return { correct, remaining: question.options.length - this.wrongAnswers.size }
  }

  exhaustOptions(): void {
    this.answered = true
  }

  advance(): void {
    this.currentQuestion += 1
    this.answered = false
    this.wrongAnswers = new Set()
  }
}
