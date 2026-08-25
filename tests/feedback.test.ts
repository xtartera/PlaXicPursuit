import assert from 'node:assert/strict'
import test from 'node:test'
import { feedbackDurationMs } from '../src/views/feedback.ts'

test('un encert avança al cap de quatre segons', () => {
  assert.equal(feedbackDurationMs(true, 'Explicació breu'), 4000)
})

test('un error deixa almenys set segons de lectura', () => {
  assert.equal(feedbackDurationMs(false, 'Explicació breu'), 7000)
})

test('les explicacions llargues no superen deu segons', () => {
  assert.equal(feedbackDurationMs(false, Array(100).fill('paraula').join(' ')), 10000)
})
