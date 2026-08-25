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

export function parseQuestions(markdown: string): Question[] {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n')
  const blocks = [...normalizedMarkdown.matchAll(/^---\n([\s\S]*?)\n---\n([\s\S]*?)(?=\n---\n|(?![\s\S]))/gm)]
  return blocks.flatMap((match) => {
    const lines = `${match[1]}\n${match[2]}`.trim().split('\n')
    const metadata = Object.fromEntries(
      lines
        .filter((line) => line.includes(':'))
        .map((line) => {
          const [key, ...value] = line.split(':')
          return [key.trim(), value.join(':').trim().replace(/^['"]|['"]$/g, '')]
        }),
    )
    const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim()
    const imageMatch = lines.find((line) => /^!\[[^\]]*\]\([^)]+\)$/.test(line))?.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    const options = lines.filter((line) => /^[A-D]\. /.test(line)).map((line) => line.slice(3).trim())
    const explanation = lines.find((line) => line.startsWith('> '))?.slice(2).trim() ?? ''
    const answer = options.findIndex((_, index) => String.fromCharCode(65 + index) === metadata.answer)
    if (!metadata.id || !title || options.length < 2 || answer < 0) return []
    return [
      {
        id: metadata.id,
        category: metadata.category,
        categoryLabel: categoryLabels[metadata.category] ?? metadata.category,
        difficulty: metadata.difficulty,
        prompt: title,
        options,
        answer,
        explanation,
        imageSrc: imageMatch?.[2],
        imageAlt: imageMatch?.[1],
      },
    ]
  })
}
