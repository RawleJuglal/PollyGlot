import './stretch.css'
import worldMap from './src/images/worldmap.png'
import frFlag from './src/images/fr-flag.png'
import spFlag from './src/images/sp-flag.png'
import jpnFlag from './src/images/jpn-flag.png'
import sendPlane from './src/images/send-plane.svg'



const headerEL = document.querySelector('#header')
const errorEL = document.querySelector('#error')
const chatbotConversation = document.querySelector('#conversationBox')
const textInputEL = document.querySelector('#user-input')
const submitBtnEL = document.querySelector('#submit-btn')
const langInputsEL = document.querySelector('#lang-inputs')
let desiredLanguage = ''
let userInputVal = textInputEL.value;
let errorMessage = ''
const conversationArr = []

const instructionObj = {
    role: 'system',
    content: `You are a highly skilled interpreter that interprets and looks for grammatical and punctuation errors`,
}

submitBtnEL.addEventListener('click', async()=>{
    submitBtnEL.disabled = true;
    if(desiredLanguage !== ''){
        errorEL.style.display = 'none' 
        conversationArr.push({
            role:'user',
            content:`Please interpret in ${desiredLanguage}. Message: ${userInputVal}`,
        })
        renderUserText(userInputVal);
        fetchReply()
        
    } else {
        errorMessage = 'Please select a language'
        errorEL.textContent = errorMessage;
        errorEL.style.display = 'block'
        submitBtnEL.disabled = false;
    }
})

textInputEL.addEventListener('change', (event)=>{
    userInputVal = textInputEL.value;
    if(userInputVal !== ''){
        submitBtnEL.disabled = false;
    } else {
        submitBtnEL.disabled = true;
    }
})

async function fetchReply(){
    const url = 'https://sparkly-croquembouche-0cee24.netlify.app/.netlify/functions/fetchAI'
    let conversationStr = JSON.stringify([instructionObj, ...conversationArr])
    console.log(conversationStr)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'text/plain',
        },
        body: conversationStr
    })

    const data = await response.json()
    conversationArr.push(data.reply.choices[0].message)
    renderTypewriterText(data.reply.choices[0].message.content)
    submitBtnEL.disabled = false;
}

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
    } else if(event.target.id === 'spFlag'){
        desiredLanguage = 'spanish'
    } else {
        desiredLanguage = 'japanese'
    }
    
    document.querySelectorAll('.flag').forEach(item => item.classList.remove('selected-border'))
    document.querySelector(`#${event.target.id}`).classList.add('selected-border')
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

function renderUserText(text){
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = text
    userInputVal = ''
    textInputEL.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}



renderHeader()
renderTypewriterText(`Select the language you 
me to translate into, type your text and hit send!`)
renderSubmitBtn()
renderLangInputs()
addLanguageListener()