import {enRegex, invalidTags, Words} from "../constant";
import {Store} from "../lib/store";

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
        if (segment.isWordLike && enRegex.test(w)) {
            // known word
            if (words[w]?.status) continue
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

export async function init() {
    words = await Store.getAllWords()
    highlight(document.body)

}
