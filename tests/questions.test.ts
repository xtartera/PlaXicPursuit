import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { parseQuestions } from '../src/model/questions.ts'

const validQuestion = `---
id: test-001
category: historia
difficulty: facil
answer: B
---
# Una pregunta?
A. Primera
B. Segona
C. Tercera
D. Quarta
> Una explicació.`

test('interpreta una pregunta vàlida', () => {
  const questions = parseQuestions(validQuestion)
  assert.equal(questions.length, 1)
  assert.equal(questions[0].answer, 1)
  assert.equal(questions[0].categoryLabel, 'Història')
})

test('valida el fitxer de contingut complet', () => {
  const markdown = readFileSync(new URL('../content/questions.md', import.meta.url), 'utf8')
  assert.equal(parseQuestions(markdown).length, 34)
})

test('rebutja preguntes incompletes en lloc de descartar-les en silenci', () => {
  assert.throws(() => parseQuestions(validQuestion.replace('D. Quarta\n', '')), /exactament quatre opcions/)
})

test('rebutja identificadors duplicats', () => {
  assert.throws(() => parseQuestions(`${validQuestion}\n\n${validQuestion}`), /id duplicat/)
})

test('rebutja rutes d’imatge potencialment perilloses', () => {
  const unsafe = validQuestion.replace('# Una pregunta?', '# Una pregunta?\n![prova](javascript:alert)')
  assert.throws(() => parseQuestions(unsafe), /ruta d’imatge no permesa/)
})
