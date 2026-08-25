import type { Question } from './questions'

export type AnswerResult = { correct: boolean }

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export function createQuizQuestions(questions: Question[], count: number, random = Math.random): Question[] {
  return shuffle(questions, random).slice(0, Math.min(count, questions.length)).map((question) => {
    const correctOption = question.options[question.answer]
    const options = shuffle(question.options, random)
    return { ...question, options, answer: options.indexOf(correctOption) }
  })
}

export class GameModel {
  readonly sourceQuestions: Question[]
  readonly quizLength: number
  questions: Question[] = []
  currentQuestion = 0
  score = 0
  correctAnswers = 0
  answered = false
  selectedAnswer: number | undefined

  constructor(questions: Question[], quizLength = 6) {
    this.sourceQuestions = questions
    this.quizLength = quizLength
    this.reset()
  }

  get question(): Question {
    return this.questions[this.currentQuestion]
  }

  get isLastQuestion(): boolean {
    return this.currentQuestion === this.questions.length - 1
  }

  get progressPercent(): number {
    return Math.round(((this.currentQuestion + 1) / this.questions.length) * 100)
  }

  reset(): void {
    this.questions = createQuizQuestions(this.sourceQuestions, this.quizLength)
    this.currentQuestion = 0
    this.score = 0
    this.correctAnswers = 0
    this.answered = false
    this.selectedAnswer = undefined
  }

  submitAnswer(index: number): AnswerResult {
    if (this.answered || index < 0 || index >= this.question.options.length) return { correct: false }
    this.answered = true
    this.selectedAnswer = index
    const correct = index === this.question.answer
    if (correct) {
      this.score += 100
      this.correctAnswers += 1
    }
    return { correct }
  }

  advance(): void {
    this.currentQuestion += 1
    this.answered = false
    this.selectedAnswer = undefined
  }
}
