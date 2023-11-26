import {uuidv4} from "./utils";
import {Messages} from "../constant";

let messagePort: chrome.runtime.Port

function connectPort() {

    messagePort = chrome.runtime.connect({ name: 'l3t' })
    console.log("connectPort" + messagePort.name)
    messagePort.onDisconnect.addListener(() => {
        connectPort()
    })
}

connectPort()

export function getMessagePort() {
    return messagePort
}


export async function sendMessage(action: Messages, data: object): Promise<any> {
    const port = getMessagePort()
    const uuid = uuidv4()

    return new Promise((resolve, _reject) => {
        const messageHandler = (msg: any) => {
            if (msg.uuid === uuid) {
                resolve(msg.result)
                port.onMessage.removeListener(messageHandler)
            }
        }

        port.postMessage({ action: action, ...data, uuid })
        port.onMessage.addListener(messageHandler)
    })
}
