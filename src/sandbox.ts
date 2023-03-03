import { createConversation, getConversation, updateConversation } from './services/conversation.service'
import { ChatCompletionResponseMessageRoleEnum } from 'openai'

import * as console from 'console'

const eng = [{
    role: ChatCompletionResponseMessageRoleEnum.User,
    content: "Does sun round around the earth?"
}]
const geo = [{
    role: ChatCompletionResponseMessageRoleEnum.User,
    content: 'Does sun round around the earth?'
}]

const geoUpdated = [
    {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: 'Does sun round around the earth?'
    },
    {
        role: ChatCompletionResponseMessageRoleEnum.User,
        content: 'Does sun round around the earth22?'
    }
]

const ip = '10.10.13'

const run = async () => {
    //await createConversation(eng, geo, ip)
    //const conversation = await getConversation('5874eecf-b1a3-4086-8bfa-23a6be8e0159')
    //if (!conversation) return "NO_CONVERSATION"

    await updateConversation({
        conversationId: '5874eecf-b1a3-4086-8bfa-23a6be8e0159',
        conversationGeo: geoUpdated,
        conversationEng: eng,
        ipAddress: ip
    })
}

run()
