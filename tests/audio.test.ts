import assert from 'node:assert/strict'
import test from 'node:test'
import { isSoundEnabled, toggleSound } from '../src/audio.ts'

test('el so es pot silenciar i reactivar durant la sessió', () => {
  assert.equal(isSoundEnabled(), true)
  assert.equal(toggleSound(), false)
  assert.equal(isSoundEnabled(), false)
  assert.equal(toggleSound(), true)
})
