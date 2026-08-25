import assert from 'node:assert/strict'
import test from 'node:test'
import { createQuizQuestions, GameModel } from '../src/model/gameModel.ts'
import type { Question } from '../src/model/questions.ts'

const question = (id: string): Question => ({
  id, category: 'historia', categoryLabel: 'Història', difficulty: 'facil',
  prompt: 'Pregunta?', options: ['A', 'B', 'C', 'D'], answer: 3, explanation: 'Explicació',
})

const categorizedQuestion = (id: string, category: string): Question => ({
  ...question(id), category, categoryLabel: category,
})

test('crea un quiz de sis preguntes sense duplicats', () => {
  const quiz = createQuizQuestions(Array.from({ length: 10 }, (_, index) => question(String(index))), 6, () => 0.42)
  assert.equal(quiz.length, 6)
  assert.equal(new Set(quiz.map(({ id }) => id)).size, 6)
})

test('no selecciona més de dues preguntes de la mateixa categoria quan hi ha varietat', () => {
  const source = ['historia', 'llocs', 'cultura'].flatMap((category) =>
    Array.from({ length: 4 }, (_, index) => categorizedQuestion(`${category}-${index}`, category)),
  )
  const quiz = createQuizQuestions(source, 6, () => 0.42)
  const counts = quiz.reduce<Record<string, number>>((result, { category }) => {
    result[category] = (result[category] ?? 0) + 1
    return result
  }, {})
  assert.ok(Object.values(counts).every((count) => count <= 2))
})

test('barreja les opcions conservant la resposta correcta', () => {
  const [shuffled] = createQuizQuestions([question('1')], 1, () => 0)
  assert.equal(shuffled.options[shuffled.answer], 'D')
})

test('només accepta una resposta i dona 100 punts per encert', () => {
  const model = new GameModel([question('1')], 1)
  const answer = model.question.answer
  assert.deepEqual(model.submitAnswer(answer), { correct: true })
  assert.deepEqual(model.submitAnswer(answer), { correct: false })
  assert.equal(model.score, 100)
  assert.equal(model.correctAnswers, 1)
})

test('una resposta incorrecta dona zero punts i tanca la pregunta', () => {
  const model = new GameModel([question('1')], 1)
  const wrong = (model.question.answer + 1) % 4
  assert.deepEqual(model.submitAnswer(wrong), { correct: false })
  assert.equal(model.score, 0)
  assert.equal(model.answered, true)
  assert.equal(model.selectedAnswer, wrong)
})

test('el progrés representa la pregunta visible', () => {
  const model = new GameModel(Array.from({ length: 6 }, (_, index) => question(String(index))), 6)
  assert.equal(model.progressPercent, 17)
  model.currentQuestion = 5
  assert.equal(model.progressPercent, 100)
})
