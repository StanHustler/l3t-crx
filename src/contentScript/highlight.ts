import {invalidTags, Words} from "../constant";
import {Store} from "../lib/store";

let words : Words

export const unknownHL = new Highlight()
export const contextHL = new Highlight()
CSS.highlights.set('wh-unknown', unknownHL)
CSS.highlights.set('wh-context', contextHL)

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
            if (words[w]?.status) continue
            const range = new Range()
            range.setStart(curNode, segment.index - preEnd)
            range.setEnd(curNode, segment.index - preEnd + w.length)

            if (words[w] && !words[w].status) {
                contextHL.add(range)
            } else {
                unknownHL.add(range)
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
        rangesWithRectAtMouseOverCache = [...unknownHL, ...contextHL]
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



export async function init() {
    words = await Store.getAllKnown()
    highlight(document.body)

}
