export const sendHttpResponse = (statusCode: number, data?: any) => {
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode,
        body: JSON.stringify(data)
    }
}

export const georgiaOrGeorgia = (text: string) => {
    return text.split(' ')
        .map(x => x.includes('საქართველო') ? `${x} (რესპუბლიკა)` : x)
        .join(' ')
}
export const removeRepublic = (text: string) => text.replace('(რესპუბლიკა)', '')
