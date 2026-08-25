import assert from 'node:assert/strict'
import test from 'node:test'
import { GameModel } from '../src/model/gameModel.ts'
import type { Question } from '../src/model/questions.ts'

const question: Question = {
  id: 'test-001', category: 'historia', categoryLabel: 'Història', difficulty: 'facil',
  prompt: 'Pregunta?', options: ['A', 'B', 'C', 'D'], answer: 3, explanation: 'Explicació',
}

test('separa els punts dels encerts', () => {
  const model = new GameModel([question])
  assert.deepEqual(model.submitAnswer(0), { correct: false, remaining: 2 })
  assert.deepEqual(model.submitAnswer(3), { correct: true, remaining: 2 })
  assert.equal(model.score, 1)
  assert.equal(model.correctAnswers, 1)
})

test('esgota la pregunta després de tres respostes incorrectes', () => {
  const model = new GameModel([question])
  assert.equal(model.submitAnswer(0).remaining, 2)
  assert.equal(model.submitAnswer(1).remaining, 1)
  assert.equal(model.submitAnswer(2).remaining, 0)
})

test('no penalitza dues vegades la mateixa resposta', () => {
  const model = new GameModel([question])
  model.score = 2
  model.submitAnswer(0)
  model.submitAnswer(0)
  assert.equal(model.score, 1)
})

test('el progrés representa la pregunta visible', () => {
  const model = new GameModel(Array.from({ length: 10 }, () => ({ ...question })))
  assert.equal(model.progressPercent, 10)
  model.currentQuestion = 9
  assert.equal(model.progressPercent, 100)
})
