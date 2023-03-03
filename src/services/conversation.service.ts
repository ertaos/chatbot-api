import { DynamoDBClient, PutItemCommand, PutItemCommandInput, GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import { ChatCompletionRequestMessage } from 'openai'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import * as console from 'console'

const DDB = new DynamoDBClient({})
const CONVERSATIONS_TABLE = process.env.CONVERSATIONS_TABLE || ''

export const createConversation = async(
    conversationEng: Array<ChatCompletionRequestMessage>,
    conversationGeo: Array<ChatCompletionRequestMessage>,
    ipAddress: string): Promise<string | undefined> => {
    const conversationId = uuidv4()

    const params: PutItemCommandInput = {
        TableName: CONVERSATIONS_TABLE,
        Item: marshall({
            conversationId,
            conversationEng,
            conversationGeo,
            ipAddress
        })
    }

    try {
        await DDB.send(new PutItemCommand(params))
        return conversationId
    } catch (e) {
        console.log(`Error occurred createConversation - ${conversationId}`)
    }
}

export const getConversation = async(conversationId: string): Promise<Conversation | undefined> => {
    const params: GetItemCommandInput = {
        TableName: CONVERSATIONS_TABLE,
        Key: marshall({
            conversationId
        })
    }

    try {
        const response = await DDB.send(new GetItemCommand(params))
        if (response.Item) { // @ts-ignore
            return unmarshall(response.Item)
        }
    } catch (e) {
        console.log(`Error occurred getConversation - ${conversationId}`)
    }
}

export const updateConversation = async(conversation: Conversation) => {
    const params: PutItemCommandInput = {
        TableName: CONVERSATIONS_TABLE,
        Item: marshall({
            conversationId: conversation.conversationId,
            ipAddress: conversation.ipAddress,
            conversationEng: conversation.conversationEng,
            conversationGeo: conversation.conversationGeo
        })
    }
    try {
        await DDB.send(new PutItemCommand(params))
    } catch (e) {
        console.log(`Error occurred updateConversation - ${conversation.conversationId}`)
    }
}


export type Conversation = {
    conversationId: string
    ipAddress: string
    conversationEng: Array<ChatCompletionRequestMessage>
    conversationGeo: Array<ChatCompletionRequestMessage>
}

export { ChatCompletionRequestMessageRoleEnum as ConversationRoles } from 'openai'
