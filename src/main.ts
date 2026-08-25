import './style.css'
import questionsMarkdown from '../content/questions.md?raw'
import { parseQuestions } from './model/questions'
import { GameController } from './controller'

const app = document.querySelector<HTMLDivElement>('#app')!
const questions = parseQuestions(questionsMarkdown)

new GameController(app, questions).start()
