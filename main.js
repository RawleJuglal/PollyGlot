import './style.css'
import { process } from './env'
import { Configuration, OpenAIApi} from 'openai'
import worldMap from './src/images/worldmap.png'
import frFlag from './src/images/fr-flag.png'
import spFlag from './src/images/sp-flag.png'
import jpnFlag from './src/images/jpn-flag.png'

const configuation = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuation)

const headerEL = document.querySelector('#header')
const languages = new Set(document.getElementsByName('translation_language'))
const aiResponseEL = document.querySelector('#ai-response')
const toTranslateEL = document.querySelector('#eng-text')
const translatedEL = document.querySelector('#translated-text')
const langInputEl = document.querySelector('#lang-inputs')
let language = ''
const submitBtnEL = document.getElementById('submit-btn')
const resetBtnEl = document.getElementById('reset-btn')

headerEL.style.backgroundImage = `url(${worldMap})`
headerEL.style.backgroundSize = 'cover'
headerEL.style.backgroundRepeat = 'no-repeat'
createFlags()
// let img = document.createElement('img')
// img.src = frFlag
// img.alt = `french flag`
// document.getElementById('fr-flag').appendChild(img)

submitBtnEL.addEventListener('click', async ()=>{
  langInputEl.style.display = 'none'
  language = [...languages].filter(item => item.checked).map(item => item.value).reduce((acc, val)=> acc + val, '')
  console.log(toTranslateEL.value)

  const translationData = await fetchTranslation(`Please translate ${toTranslateEL.value} in ${language}`)
  renderResponse(translationData.data.choices[0].text)
  resetBtnEl.style.display = 'block'
  submitBtnEL.style.display = 'none'
})

resetBtnEl.addEventListener('click', ()=>{
  toTranslateEL.value = ''
  translatedEL.value = ''
  aiResponseEL.style.display = 'none'
  langInputEl.style.display = 'block'
  submitBtnEL.style.display = 'block'
  resetBtnEl.style.display = 'none'
})

async function fetchTranslation(translationPrompt){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: translationPrompt,
    temperature:0,
    max_tokens:50,
  })

  return response
}

function renderResponse(text){
  translatedEL.value = text;
  aiResponseEL.style.display = 'block'
}

function createFlags(){
  const arr = ['fr-flag', 'sp-flag', 'jpn-flag']
  arr.map(item => {
    let img = document.createElement('img')
    switch(item) {
      case 'fr-flag':
        img.src = frFlag
        img.alt = 'french flag'
        document.getElementById(item).appendChild(img)
        break;
      case 'sp-flag':
        img.src = spFlag
        img.alt = 'spanish flag'
        document.getElementById(item).appendChild(img)
        break;
      case 'jpn-flag':
        img.src = jpnFlag
        img.alt = 'japenese flag'
        document.getElementById(item).appendChild(img)
        break;
      default:
        throw {
          message:'no case found'
        }
    }

  })
  
}