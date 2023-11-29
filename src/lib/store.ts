import {Language, Words} from "../constant";

enum StorageKey {
    'words' = 'words',
    'setting' = 'setting'
}
export class Store {
    /**
     * set a word to known/unknown status
     * @param w word
     * @param s status
     */
    static setWord = async (w: string,s: boolean) => {
        const data = await chrome.storage.local.get(['words'])
        const words: Words = data.words ? JSON.parse(data.words) : {}
        words[w] = {status: s, language: Language.English, timestamp: Date.now()/1000|0}
        console.log(words)
        await chrome.storage.local.set({'words': JSON.stringify(words)})
    }

    static getAllWords = async () => {
        const data = await chrome.storage.local.get(['words'])
        if (data.words) return JSON.parse(data.words)
        return {}
    }

    static clear = async () => {
        // await chrome.storage.local.clear()
        await chrome.storage.local.remove(['words'])
    }

    static exportData = async () => {
        const downloadAsJsonFile = (content: string, filename: string) => {
            const a = document.createElement('a')
            a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
            a.download = filename
            a.click()
        }

        const data = await chrome.storage.local.get(['words'])
        downloadAsJsonFile(JSON.stringify(data), 'L3t_'+Date.now()+'.json')
    }
}
