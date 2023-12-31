import {enRegex, invalidTags, Words} from "../constant";
import {Store} from "../lib/store";
import set = chrome.cookies.set;

let words : Words

export const unreadHL = new Highlight()
export const unknownHL = new Highlight()
CSS.highlights.set('l3t-unread', unreadHL)
CSS.highlights.set('l3t-unknown', unknownHL)

function highlight(node: Node) {

    function getTextNodes(node: Node): Text[] {
        const textNodes = []
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, (node: Node) => {
            if (invalidTags.includes(node.parentElement?.tagName ?? '')) {
                return NodeFilter.FILTER_REJECT
            } else {
                return NodeFilter.FILTER_ACCEPT
            }
        })

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode as Text)
        }

        return textNodes
    }

    const textNodes = getTextNodes(node)
    for (const node of textNodes) {
        highlightTextNode(node)
    }
}


function highlightTextNode(node: CharacterData) {

    const text = node.nodeValue || ''
    let toHighlightWords = []
    const segmenterEn = new Intl.Segmenter('en-US', { granularity: 'word' })
    const segments = segmenterEn.segment(text)

    const totalLength = node.length
    let preEnd = 0
    let curNode = node

    for (const segment of segments) {
        const w = segment.segment.toLowerCase()
        if (segment.isWordLike) {
            // known word
            if (words[w]?.status || !enRegex.test(w)) continue
            const range = new Range()
            range.setStart(curNode, segment.index - preEnd)
            range.setEnd(curNode, segment.index - preEnd + w.length)

            if (words[w] && !words[w].status) {
                unknownHL.add(range)
            } else {
                unreadHL.add(range)
            }

        }
    }

}

let lastMouseOverElement: Element | null = null;
let rangesWithRectAtMouseOverCache: { range: Range; rect: DOMRect }[] = []
export function getRangeAtPoint(e: MouseEvent) {
    const element = e.target as HTMLElement
    if (element !== lastMouseOverElement) {
        lastMouseOverElement = element
        rangesWithRectAtMouseOverCache = [...unreadHL, ...unknownHL]
            .map(range => {
                if (element === range.commonAncestorContainer?.parentElement) {
                    const rect = range.getBoundingClientRect()
                    return { range, rect }
                }
                return null
            })
            .filter(r => r !== null) as { range: Range; rect: DOMRect }[]
    }

    const rangeAtPoint = rangesWithRectAtMouseOverCache.find(
        ({ rect }) =>
            rect && rect.left <= e.clientX && rect.right >= e.clientX && rect.top <= e.clientY && rect.bottom >= e.clientY
    )
    return rangeAtPoint?.range ?? null
}

export function unreadHL2known(w: string) {
    ;[unreadHL, unknownHL].forEach(hl => {
        hl.forEach(range => {
            const rangeWord = range.toString().toLowerCase()
            if (rangeWord === w) hl.delete(range)
        })
    })
}

export function unreadHL2unknown(w: string) {
    unreadHL.forEach(range =>{
        const rangeWord = range.toString().toLowerCase()
        if (rangeWord === w) {
            unknownHL.add(range)
            unreadHL.delete(range)
        }
    })
}

function observeDomChange() {

    function isTextNodeValid(textNode: Text) {
        return !invalidTags.includes(textNode.parentNode?.nodeName?.toUpperCase() ?? '')
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (!node.isConnected || !node.parentNode?.isConnected) {
                        return false
                    }
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (isTextNodeValid(node as Text)) {
                            highlightTextNode(node as Text)
                        }
                    } else {
                        if ((node as HTMLElement).isContentEditable || node.parentElement?.isContentEditable) {
                            return false
                        }
                        highlight(node)
                    }
                })

                // when remove node, remove highlight range
                if (mutations.length > 0) {
                    ;[unknownHL, unreadHL].forEach(hl => {
                        hl.forEach(r => {
                            if (!r.toString()) {
                                hl.delete(r)
                            }
                        })
                    })
                }
            }
        })
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    })
}



export async function init() {
    words = await Store.getAllWords()
    highlight(document.body)
    observeDomChange()

    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'MARK_UNREAD_ALL_KNOWN') {
            let tmp = new Set<string>()
            unreadHL.forEach(range => {
                tmp.add(range.toString().toLowerCase())
            })
            tmp.forEach(w => {
                unreadHL2known(w)
            })
        }
    })
}

// setTimeout(function() {
//
// }, 1000); // 等待2秒钟后执行

init()
