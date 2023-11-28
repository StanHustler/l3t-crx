export const enRegex = /^[a-zA-Z]+$/

export type WordContext = {
    url: string
    title: string
    text: string
    word: string
    timestamp: number
    favicon?: string
}

export type ContextMap = Record<string, WordContext[]>


export const invalidTags = [
    'SCRIPT',
    'STYLE',
    'BUTTON',
    'VIDEO',
    'SVG',
    'CODE',
    'NOSCRIPT',
    'NOFRAMES',
    'INPUT',
    'TEXTAREA',
    'ABBR',
    'AREA',
    'CODE',
    'PRE',
    'AUDIO',
    'VIDEO',
    'CANVAS',
    'HEAD',
    'MAP',
    'META',
    'OBJECT',
    'WH-ROOT'
]

declare global {
    interface Highlight extends Set<Range> {
        readonly priority: number
    }

    const Highlight: {
        prototype: Highlight
        new (...initialRanges: Array<Range>): Highlight
    }

    type HighlightRegistry = Map<string, Highlight>

    namespace CSS {
        const highlights: HighlightRegistry
    }
}


export const enum Messages {
    SetKnown,
    FetchHtml = 'fetch_html',
}

export enum StoreWay {
    Chrome,
    L3t
}


export enum Language {
    English,
}

export type Word = {
    language: Language,
    status: boolean,
    timestamp: number,
}

export type Words = Record<string, Word>
