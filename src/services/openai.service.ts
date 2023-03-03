import { Configuration, OpenAIApi, ChatCompletionRequestMessage, CreateChatCompletionResponseChoicesInner } from 'openai'
import * as console from 'console'
import axios from 'axios'


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export const sendMessage = async (messages: Array<ChatCompletionRequestMessage>): Promise<Array<CreateChatCompletionResponseChoicesInner> | undefined> => {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            max_tokens: 256,
            messages,
            temperature: 0.7,
            top_p: 1,
        })
        return completion.data.choices
    }
    catch (e) {
        if (axios.isAxiosError(e)) console.log(e.response?.statusText)
    }
}
