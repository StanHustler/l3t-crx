import {Messages} from "../constant";
import {sendMessage} from "./port";
import CryptoJS from "crypto-js";

type DictResult = {
    word: string
    exp: string
    tag: string
}

const cache: Record<string, DictResult> = {}

export async function lookup(word: string) {
    if (cache[word]) return Promise.resolve(cache[word])

    console.log("========lookup", word)
    const html = await fetchText("https://dict.youdao.com/result?word=" + word + "&lang=en")
    const doc = new DOMParser().parseFromString(html, "text/html")

    const result : DictResult = {
        "word": word,
        "exp" : "",
        "tag" : "",
    }


    doc.querySelectorAll("li.word-exp").forEach((el) => {
        result.exp += el.textContent + "\n"
    })

    doc.querySelectorAll(".exam_type-value").forEach((el) => {
        result.tag += el.textContent + "|"
    })

    result.exp = result.exp.slice(0, -2)
    result.tag = result.tag.slice(0, -1)

    cache[word] = result
    return result
}


export async function fetchText(url: string): Promise<string> {
    const result = await sendMessage(Messages.FetchHtml, { url })
    return result ?? ''
}


export async function lookupPara(query:string) {
    const url = 'https://openapi.youdao.com/api'


    const salt = (new Date).getTime();
    const curtime = Math.round(new Date().getTime()/1000);
    const str1 = appKey + truncate(query) + salt + curtime + key;
    const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
    function truncate(q: string){
        const len = q.length;
        if(len<=20) return q;
        return q.substring(0, 10) + len + q.substring(len-10, len);
    }

    const data = {
        q: query,
        from: 'en',
        to: 'zh-CHS',
        appKey: appKey,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
    }

    const result = await sendMessage(Messages.FetchAPI, { url ,data })
    return result ?? ''
}
