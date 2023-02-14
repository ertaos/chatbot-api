const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

module.exports.askQuestion = async question => {
    const completion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: question,
        max_tokens: 500,
        temperature: 2,
        top_p: 0.1
    })
    return completion.data.choices[0].text
}
