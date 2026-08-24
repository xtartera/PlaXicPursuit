#!/usr/bin/env node
// Imports questions from a Google Forms CSV export into content/questions.md.
//
// Usage:
//   node scripts/import-questions.mjs <path-to-csv> [--difficulty=mitjana]
//
// Expected CSV columns (Google Forms export, any order, matched by header name):
//   Categoria, Pregunta, Resposta A, Resposta B, Resposta C, Resposta D,
//   Resposta Correcta, Explicació, Ruta Enllaç a Imatge (Opcional)
// "Marca de temps" and "Font" are read but not written to questions.md.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const csvPath = process.argv[2]
if (!csvPath) {
  console.error('Ús: node scripts/import-questions.mjs <path-to-csv> [--difficulty=mitjana]')
  process.exit(1)
}
const difficultyArg = process.argv.find((arg) => arg.startsWith('--difficulty='))
const defaultDifficulty = difficultyArg ? difficultyArg.split('=')[1] : 'mitjana'

const questionsPath = resolve('content/questions.md')

const categoryKeyByLabel = {
  historia: 'historia',
  llocs: 'llocs',
  cultura: 'cultura',
  memoria: 'memoria',
  gent: 'gent',
  futur: 'futur',
}
function normalizeCategory(label) {
  const key = label
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
  return categoryKeyByLabel[key]
}

// Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas/quotes, CRLF.
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const chars = text.replace(/\r\n/g, '\n')
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    if (inQuotes) {
      if (char === '"' && chars[i + 1] === '"') { field += '"'; i++ }
      else if (char === '"') inQuotes = false
      else field += char
    } else if (char === '"') inQuotes = true
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += char
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

const csvRows = parseCsv(readFileSync(csvPath, 'utf8'))
const header = csvRows[0].map((cell) => cell.trim())
const col = (name) => header.indexOf(name)
const idx = {
  category: col('Categoria'),
  question: col('Pregunta'),
  a: col('Resposta A'),
  b: col('Resposta B'),
  c: col('Resposta C'),
  d: col('Resposta D'),
  correct: col('Resposta Correcta'),
  explanation: col('Explicació'),
  image: col('Ruta Enllaç a Imatge (Opcional)'),
}
for (const [key, i] of Object.entries(idx)) {
  if (i === -1 && key !== 'image' && key !== 'explanation') {
    console.error(`No trobo la columna esperada per a "${key}" a la capçalera del CSV.`)
    process.exit(1)
  }
}

const existing = readFileSync(questionsPath, 'utf8')
const existingIds = [...existing.matchAll(/^id:\s*pla-xic-(\d+)/gm)].map((m) => Number(m[1]))
let nextId = (existingIds.length ? Math.max(...existingIds) : 0) + 1

const blocks = []
const skipped = []

for (const row of csvRows.slice(1)) {
  const question = row[idx.question]?.trim()
  const a = row[idx.a]?.trim()
  const b = row[idx.b]?.trim()
  const c = row[idx.c]?.trim()
  const d = row[idx.d]?.trim()
  const correct = row[idx.correct]?.trim().toUpperCase()
  const rawCategory = row[idx.category]?.trim()
  const explanation = idx.explanation !== -1 ? row[idx.explanation]?.trim() : ''
  const image = idx.image !== -1 ? row[idx.image]?.trim() : ''

  if (!question || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correct)) {
    skipped.push({ question: question || '(sense text)', reason: 'falten camps obligatoris (pregunta/opcions/resposta correcta)' })
    continue
  }
  const category = normalizeCategory(rawCategory || '')
  if (!category) {
    skipped.push({ question, reason: `categoria buida o desconeguda ("${rawCategory}")` })
    continue
  }

  const id = `pla-xic-${String(nextId).padStart(3, '0')}`
  nextId++
  const lines = [
    '---',
    `id: ${id}`,
    `category: ${category}`,
    `difficulty: ${defaultDifficulty}`,
    `answer: ${correct}`,
    '---',
    `# ${question}`,
  ]
  if (image) lines.push(`![](${image})`)
  lines.push(`A. ${a}`, `B. ${b}`, `C. ${c}`, `D. ${d}`)
  if (explanation) lines.push(`> ${explanation}`)
  blocks.push(lines.join('\r\n'))
}

if (blocks.length) {
  const trimmedExisting = existing.replace(/\s+$/, '')
  writeFileSync(questionsPath, trimmedExisting + '\r\n\r\n' + blocks.join('\r\n\r\n') + '\r\n')
}

console.log(`Importades ${blocks.length} preguntes noves a content/questions.md.`)
if (skipped.length) {
  console.log(`\nSaltades ${skipped.length}:`)
  for (const s of skipped) console.log(`  - "${s.question}" -> ${s.reason}`)
}
