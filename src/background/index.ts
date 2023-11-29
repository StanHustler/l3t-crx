import {Messages, StoreWay} from "../constant";

console.log('background is running')

chrome.runtime.onInstalled.addListener(() => {
    const setting = {
        storeWay: StoreWay.Chrome,
    }
    chrome.storage.local.set(setting).then(r => console.log('installed'))

})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name === "l3t") {
        port.onMessage.addListener(async (msg) => {
            console.log("port message received", msg)
            switch (msg.action) {
                case Messages.FetchHtml: {
                    const {url, uuid} = msg
                    const htmlRes = await fetch(url, {
                        mode: 'no-cors',
                        credentials: 'include'
                    })
                    const htmlText = await htmlRes.text()
                    port.postMessage({result: htmlText, uuid})
                    break
                }
                case Messages.FetchAPI: {
                    const {url, data, uuid} = msg
                    console.log(msg)

                    const formData = new FormData();
                    formData.append("q", data.q);
                    formData.append("from", data.from);
                    formData.append("to", data.to);
                    formData.append("appKey", data.appKey);
                    formData.append("salt", data.salt);
                    formData.append("sign", data.sign);
                    formData.append("signType", "v3");
                    formData.append("curtime", data.curtime);

                    const res = await fetch("https://openapi.youdao.com/api", {
                        method: 'POST',
                        body: formData,
                        redirect: 'follow'
                    })
                    port.postMessage({result: await res.json(), uuid})
                    break
                }
            }
        })
    }

})
