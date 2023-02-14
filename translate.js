const { Translate } = require('@google-cloud/translate').v2

const translateService = new Translate(
    {
        projectId: 'Ertaos-bot',
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    }
)

module.exports.translate = async(text, to) => {
    const [translation] = await translateService.translate(text, to);
    return translation
}
