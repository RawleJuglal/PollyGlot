// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import { Configuration, OpenAIApi} from 'openai'

const configuation = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuation)

const handler = async (event) => {
  try {
    const response = await openai.createChatCompletion({
      model:'gpt-3.5-turbo',
      messages: event.body,
      presence_penalty:.2,
  })
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        reply:response.data
      }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
