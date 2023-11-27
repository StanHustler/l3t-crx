import {StoreWay, Language, knownWords} from "../constant";


export class Store {
    static setKnown = async (w: string) => {
        const data = await chrome.storage.local.get(['known'])
        const known: knownWords = data.known ? JSON.parse(data.known) : {}
        if (known[w]) return
        known[w] = {language: Language.English, timestamp: Date.now()/1000|0}
        console.log(known)
        await chrome.storage.local.set({'known': JSON.stringify(known)})
    }

    static getAllKnown = async () => {
        const data = await chrome.storage.local.get(['known'])
        if (data.known) {
            return JSON.parse(data.known)
        }
        return {}
    }

    static clear = async () => {
        await chrome.storage.local.clear()
    }
}
