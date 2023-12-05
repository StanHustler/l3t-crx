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

        const data = await chrome.storage.local.get(['words','sentences','setting'])
        downloadAsJsonFile(JSON.stringify(data), 'L3t_'+Date.now()+'.json')
    }

    static getSetting = async (key :string) => {
        const data = await chrome.storage.local.get(['setting'])
        const settings = data.setting ? JSON.parse(data.setting) : {}
        return settings[key]
    }

    static setSetting = async (key:string, setting: any) => {
        const data = await chrome.storage.local.get(['setting'])
        const settings = data.setting ? JSON.parse(data.setting) : {}
        settings[key] = setting
        await chrome.storage.local.set({'setting': JSON.stringify(settings)})
    }

    static setSentence = async (w: string, s: string) => {
        const getFaviconUrl = () => {
            const favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement
            const iconUrl = favicon?.href ?? ''
            if (iconUrl.startsWith('data:image')) return ''
            return iconUrl
        }

        const d = {
            url: location.href,
            title: document.title.substring(0, 40),
            text: s,
            timestamp: Date.now()/1000|0,
            favicon: getFaviconUrl()
        }

        const data = await chrome.storage.local.get(['sentences'])
        const sentences = data.sentences ? JSON.parse(data.sentences) : {}
        sentences[w] = sentences[w] || []
        sentences[w].push(d)
        await chrome.storage.local.set({'sentences': JSON.stringify(sentences)})
    }

    static delSentence = async (w: string) => {
        const data = await chrome.storage.local.get(['sentences'])
        const sentences = data.sentences ? JSON.parse(data.sentences) : {}
        delete sentences[w]
        await chrome.storage.local.set({'sentences': JSON.stringify(sentences)})
    }
}
