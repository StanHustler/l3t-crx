import {Language, Words} from "../constant";


export class Store {
    static setKnown = async (w: string) => {
        const data = await chrome.storage.local.get(['words'])
        const words: Words = data.words ? JSON.parse(data.words) : {}
        if (words[w]) return
        words[w] = {status: true, language: Language.English, timestamp: Date.now()/1000|0}
        console.log(words)
        await chrome.storage.local.set({'words': JSON.stringify(words)})
    }

    static getAllKnown = async () => {
        const data = await chrome.storage.local.get(['words'])
        if (data.words) {
            return JSON.parse(data.words)
        }
        return {}
    }

    static clear = async () => {
        await chrome.storage.local.clear()
    }

    static exportData = async () => {
        const downloadAsJsonFile = (content: string, filename: string) => {
            const a = document.createElement('a')
            a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
            a.download = filename
            a.click()
        }

        const data = await chrome.storage.local.get(['known'])
        downloadAsJsonFile(JSON.stringify(data), 'L3t_'+Date.now()+'.json')
    }
}
