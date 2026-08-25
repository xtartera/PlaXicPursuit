export type Question = {
  id: string
  category: string
  categoryLabel: string
  difficulty: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
  imageSrc?: string
  imageAlt?: string
}

const categoryLabels: Record<string, string> = {
  historia: 'Història',
  memoria: 'Memòria',
  cultura: 'Cultura',
  llocs: 'Llocs',
  gent: 'Gent',
  futur: 'Futur',
}

const validDifficulties = new Set(['facil', 'mitjana', 'dificil'])
const safeImageUrl = /^(?:\/questions\/[^\s"'<>]+|https?:\/\/[^\s"'<>]+)$/

export function parseQuestions(markdown: string): Question[] {
  const normalizedMarkdown = markdown.replace(/\r\n?/g, '\n')
  const blocks = [...normalizedMarkdown.matchAll(/^---\n([\s\S]*?)\n---\n([\s\S]*?)(?=\n---\n|(?![\s\S]))/gm)]
  const questions: Question[] = []
  const ids = new Set<string>()
  const errors: string[] = []

  blocks.forEach((match, blockIndex) => {
    const metadata = Object.fromEntries(
      match[1].split('\n').filter((line) => line.includes(':')).map((line) => {
        const [key, ...value] = line.split(':')
        return [key.trim(), value.join(':').trim().replace(/^['"]|['"]$/g, '')]
      }),
    )
    const lines = match[2].trim().split('\n')
    const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim()
    const imageMatch = lines.find((line) => /^!\[[^\]]*\]\([^)]+\)$/.test(line))?.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    const options = lines.filter((line) => /^[A-D]\. /.test(line)).map((line) => line.slice(3).trim())
    const explanation = lines.find((line) => line.startsWith('> '))?.slice(2).trim() ?? ''
    const answer = options.findIndex((_, index) => String.fromCharCode(65 + index) === metadata.answer)
    const label = metadata.id || `bloc ${blockIndex + 1}`
    const blockErrors: string[] = []

    if (!metadata.id) blockErrors.push('falta id')
    else if (ids.has(metadata.id)) blockErrors.push(`id duplicat: ${metadata.id}`)
    if (!metadata.category || !categoryLabels[metadata.category]) blockErrors.push(`categoria desconeguda: ${metadata.category || '(buida)'}`)
    if (!metadata.difficulty || !validDifficulties.has(metadata.difficulty)) blockErrors.push(`dificultat desconeguda: ${metadata.difficulty || '(buida)'}`)
    if (!title) blockErrors.push('falta l’enunciat')
    if (options.length !== 4 || options.some((option) => !option)) blockErrors.push('calen exactament quatre opcions')
    if (answer < 0) blockErrors.push('la resposta correcta no és una opció vàlida')
    if (imageMatch && !safeImageUrl.test(imageMatch[2])) blockErrors.push(`ruta d’imatge no permesa: ${imageMatch[2]}`)

    if (blockErrors.length) {
      errors.push(`${label}: ${blockErrors.join(', ')}`)
      return
    }

    ids.add(metadata.id)
    questions.push({
      id: metadata.id,
      category: metadata.category,
      categoryLabel: categoryLabels[metadata.category],
      difficulty: metadata.difficulty,
      prompt: title!,
      options,
      answer,
      explanation,
      imageSrc: imageMatch?.[2],
      imageAlt: imageMatch?.[1],
    })
  })

  if (blocks.length === 0) errors.push('no s’ha trobat cap bloc de pregunta')
  if (errors.length) throw new Error(`Preguntes no vàlides:\n- ${errors.join('\n- ')}`)
  return questions
}
