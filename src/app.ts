import { getConversation, createConversation, updateConversation, ConversationRoles } from './services/conversation.service'
import { georgiaOrGeorgia, sendHttpResponse } from './utils'
import { translate } from './services/translate.service'
import { sendMessage } from './services/openai.service'
import { APIGatewayEvent } from 'aws-lambda'
import * as console from 'console'
import { ChatCompletionRequestMessage } from 'openai/api'
import { v4 as uuidv4 } from 'uuid'

export const askQuestion = async (event: APIGatewayEvent) => {
    if (!event.body) return sendHttpResponse(400, { error: 'NO_EVENT_BODY' })

    const ipAddress = event.requestContext.identity.sourceIp
    const body = JSON.parse(event.body)
    let { conversationId, message } = body

    if (!message) if (!event.body) return sendHttpResponse(400, { error: 'NO_EVENT_MESSAGE' })

    message = georgiaOrGeorgia(message)
    console.log(`message - ${message}`)
    const messageInEnglish = await translate(message, 'en')

    let conversation
    if (conversationId) conversation = await getConversation(conversationId)

    if (conversation) {
        // Store client messages
        conversation.conversationGeo.push({
            role: ConversationRoles.User,
            content: message
        })
        conversation.conversationEng.push({
            role: ConversationRoles.User,
            content: messageInEnglish
        })

        // Send only last 10 message to openAI
        const response = await sendMessage(conversation.conversationEng.slice(-10), conversationId)
        if (!response) {
            console.log('NO_RESPONSE')
            return sendHttpResponse(500)
        }

        const lastItem = response.pop()
        if (!lastItem || !lastItem.message) {
            console.log('BAD_ITEM')
            console.log(lastItem)
            return sendHttpResponse(500)
        }

        const messageInGeorgian = await translate(lastItem.message.content, 'ka')

        // Store Assistant messages
        conversation.conversationEng.push({
            role: lastItem.message.role,
            content: lastItem.message.content
        })
        conversation.conversationGeo.push({
            role: lastItem.message.role,
            content: messageInGeorgian
        })

        await updateConversation(conversation)
        return sendHttpResponse(200, { message: messageInGeorgian })
    }

    // New conversation flow
    conversationId = uuidv4()
    const conversationGeo: Array<ChatCompletionRequestMessage> = [
        {
            role: ConversationRoles.User,
            content: message
        }
    ]
    const conversationEng: Array<ChatCompletionRequestMessage> = [
        {
            role: ConversationRoles.User,
            content: messageInEnglish
        }
    ]

    const response = await sendMessage(conversationEng, conversationId)
    if (response) {
        const lastItem = response.pop()
        if (!lastItem || !lastItem.message) {
            console.log('BAD_ITEM')
            console.log(lastItem)
            return sendHttpResponse(500)
        }

        const messageInGeorgian = await translate(lastItem.message.content, 'ka')

        conversationEng.push(lastItem.message)
        conversationGeo.push(
            {
                role: ConversationRoles.Assistant,
                content: messageInGeorgian
            }
        )

        await createConversation(conversationEng, conversationGeo, ipAddress, conversationId)
        return sendHttpResponse(200, { conversationId, message : messageInGeorgian })

    } else {
        console.log('NO_RESPONSE')
        return sendHttpResponse(500)
    }
}
