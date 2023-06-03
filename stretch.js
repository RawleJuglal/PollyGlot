import './stretch.css'
import worldMap from './src/images/worldmap.png'
import frFlag from './src/images/fr-flag.png'
import spFlag from './src/images/sp-flag.png'
import jpnFlag from './src/images/jpn-flag.png'
import sendPlane from './src/images/send-plane.svg'

const headerEL = document.querySelector('#header')
const chatbotConversation = document.querySelector('#conversationBox')
const submitBtnEL = document.querySelector('#submit-btn')
const langInputsEL = document.querySelector('#lang-inputs')
let desiredLanguage = ''

function renderHeader(){
    headerEL.style.backgroundImage = `url(${worldMap})`
    headerEL.style.backgroundSize = 'cover'
    headerEL.style.backgroundRepeat = 'no-repeat'
}

function renderSubmitBtn(){
    let img = document.createElement('img')
    img.src = sendPlane
    img.alt = 'send button'
    submitBtnEL.appendChild(img)
}

function renderLangInputs(){
    const flagArr = ['frFlag', 'spFlag', 'jpnFlag']
    flagArr.map(item =>{
       let img =  document.createElement('img')
        switch(item){
            case 'frFlag':
                img.src = frFlag;
                img.alt = 'french flag'
                img.id = item
                img.classList.add('flag')
                break;
            case 'spFlag':
                img.src = spFlag;
                img.alt = 'spanish flag'
                img.id = item
                img.classList.add('flag')
                break;
            case 'jpnFlag':
                img.src = jpnFlag;
                img.alt = 'japenese flag'
                img.id = item
                img.classList.add('flag')
                break;
            default:
                throw {
                    message:'no id was matched'
                }
        }
        langInputsEL.appendChild(img)
    })
}

function addLanguageListener(){
   [...new Set(document.getElementsByClassName('flag'))].map(item =>{
    item.addEventListener('click',(event)=> setDesiredLanguage(event))
   })
}

function setDesiredLanguage(event){
    if(event.target.id === 'frFlag'){
        desiredLanguage = 'french'
    } else if(event.traget.id === 'spFlag'){
        desiredLanguage = 'spanish'
    } else {
        desiredLanguage = 'japanese'
    }
}

function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}

renderHeader()
renderTypewriterText(`Select the language you 
me to translate into, type your text and hit send!`)
renderSubmitBtn()
renderLangInputs()
addLanguageListener()