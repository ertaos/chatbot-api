const { translate } = require('./translate')
const { askQuestion } = require('./ai')

const headers = {
    'Access-Control-Allow-Origin': '*'
}

const sendSuccessResponse = data => {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
    }
}

const sendFailResponse = error => {
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error })
    }
}

module.exports.askQuestion = async event => {
    if (!event.body) return sendFailResponse('Missing request body')
    const body = JSON.parse(event.body)
    console.log(body)
    const { question } = body
    if (!question) return sendFailResponse('Missing question')

    console.log(`question - ${question}`)
    const questionInEnglish = await translate(question, 'en')
    console.log(`questionInEnglish - ${questionInEnglish}`)
    const answerInEnglish = await askQuestion(questionInEnglish)
    console.log(`answerInEnglish - ${answerInEnglish}`)
    const answerInGeorgian = await translate(answerInEnglish, 'ka')
    console.log(`answerInGeorgian - ${answerInGeorgian}`)

    return sendSuccessResponse( {
        answer: answerInGeorgian
    })
}
