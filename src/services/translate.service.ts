const { Translate } = require('@google-cloud/translate').v2
import * as console from 'console'

const translateService = new Translate(
    {
        projectId: 'Ertaos-bot',
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '')
    }
)

export const translate = async(text: string, to: string) => {
    try {
        const [translation] = await translateService.translate(text, to)
        return translation
    } catch (e) {
        console.log(e)
    }
}
