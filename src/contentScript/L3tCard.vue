<script setup lang="ts">
import {unknownHL, getRangeAtPoint, init, unreadHL2known, unreadHL, unreadHL2unknown} from "./highlight";
import {ShadowRoot, ShadowStyle} from "vue-shadow-dom";
import {onMounted, ref, watch} from "vue";

import Heart from "../assets/heart.svg";
import Hearted from "../assets/hearted.svg";
import Loading from "../assets/loading.svg";
import Check from "../assets/check.svg";
import More from "../assets/more.svg";
import Bookmark from "../assets/bookmark.svg";
import {lookup} from "../lib/YoudaoDict";
import {Store} from "../lib/store";


const curWord = ref({word: "test", exp: ""})

onMounted(()=>{

    let rangeCache: Range | null = null
    let domCache: HTMLElement

    document.addEventListener('mousemove', (e) => {
        const range = getRangeAtPoint(e)
        if (range) {
            if (rangeCache != range) {
                rangeCache = range
                adjustCardPosition(range)
                curWord.value.word = range.toString().toLowerCase()
                // lookup(curWord.value.word).then((cb) => {
                //     curWord.value.exp = cb.exp
                // })
            }

            clearTimerHideRef()
            timerShowRef = window.setTimeout(() => {
                openCard()
            }, 200)
        } else {
            timerShowRef && clearTimeout(timerShowRef)
            isCardVisible() && hidePopupDelay(500)
        }

        domCache = e.target as HTMLElement

    })

    document.addEventListener('keypress', (e) => {
        switch (e.key) {
            case 'a':
                if (!isCardVisible()) return
                Store.setWord(curWord.value.word, true)
                unreadHL2known(curWord.value.word)
                break
            case 's':
                if (!isCardVisible()) return
                Store.setWord(curWord.value.word, false)
                unreadHL2unknown(curWord.value.word)
                break
            case 'z':
                console.log(domCache.textContent)
                const transNode = document.createElement('div')
                transNode.className = 'l3t-trans-node'
                transNode.textContent = "aaa"
                domCache.append(transNode)


        }
    })

})
function getCardNode() {
    const root = document.querySelector('#shadow-root')?.shadowRoot
    return root?.querySelector('div') as HTMLElement
}

const isCardVisible = () => {
    return getCardNode().classList.contains('card_visible')
}

function adjustCardPosition(r: Range) {
    const cardNode = getCardNode();

    const {x: x, y: y, width: m_width, height: m_height} = r.getBoundingClientRect();
    const { x: c_x, y: c_y, width: c_width, height: c_height } = cardNode.getBoundingClientRect();

    const scrollLeft = document.documentElement.scrollLeft;
    const scrollTop = document.documentElement.scrollTop;

    let left = x + scrollLeft - c_width / 2 + m_width / 2
    let top = y + scrollTop - c_height

    cardNode.style.left = `${left}px`
    cardNode.style.top = `${top}px`

}

function openCard() {
    if (!isCardVisible()) {
        getCardNode().classList.add('card_visible');
        // console.log("added")
    }}


let timerHideRef: number
let timerShowRef: number

function clearTimerHideRef() {
    timerHideRef && clearTimeout(timerHideRef)
}

function hidePopupDelay(ms: number) {
    clearTimerHideRef()
    timerHideRef = window.setTimeout(() => {
        const cardNode = getCardNode()
        cardNode.classList.remove('card_visible')
        cardNode.inert = true
        // setDictHistory([])
    }, ms)
}




</script>

<template>
    <shadow-root id="shadow-root">
        <div class="l3t-card">
            <div class="l3t-card-header">
                <h3> {{curWord.word}} </h3>
                <div class="btn-action">
                    <div class="btn-star">
                        <Heart class="card-icon"/>
                    </div>
                    <div class="btn-star">
                        <Check class="card-icon"/>
                    </div>
                </div>
            </div>

            <div class="card-loading" v-if="!curWord.exp"><Loading/></div>
            <div class="l3t-card-exp" v-else>{{curWord.exp}}}</div>

            <div class="l3t-card-footer">
                <div class="card-slot">
                    <More class="card-icon"/>
                    More
                </div>
                <div class="card-slot">
                    <Bookmark class="card-icon"/>
                    Like
                </div>
            </div>

        </div>
        <shadow-style>
            .l3t-card {
            --primary-100: #FF7008;
            --primary-110: #df5f04;
            --primary-10: #FFF5DE;
            --black-100: rgba(0, 0, 0, 1);
            --black-90: rgba(0, 0, 0, 0.9);
            --black-80: rgba(0, 0, 0, 0.8);
            --black-70: rgba(0, 0, 0, 0.7);
            --black-60: rgba(0, 0, 0, 0.6);
            --black-50: rgba(0, 0, 0, 0.5);
            --black-40: rgba(0, 0, 0, 0.4);
            --black-20: rgba(0, 0, 0, 0.2);
            --black-10: rgba(0, 0, 0, 0.1);
            --black-8: rgba(0, 0, 0, 0.08);
            --white-100: rgba(255, 255, 255, 1);
            --white-90: rgba(255, 255, 255, 0.8);
            --white-80: rgba(255, 255, 255, 0.7);
            --white-70: rgba(255, 255, 255, 0.6);
            --white-50: rgba(255, 255, 255, 0.5);
            --white-60: rgba(255, 255, 255, 0.4);
            --white-40: rgba(255, 255, 255, 0.3);
            --white-20: rgba(255, 255, 255, 0.2);
            --white-10: rgba(255, 255, 255, 0.1);
            --white-8: rgba(255, 255, 255, 0.08);
            --bg-1: var(--white-100);
            --bg-2: var(--primary-10);
            --bg-3: rgba(245, 245, 245, 0.8);
            --bg-4: #FAFAFA;
            --text-9: var(--black-90);
            --text-8: var(--black-80);
            --text-7: var(--black-70);
            --text-6: var(--black-60);
            --text-5: var(--black-50);
            --text-4: var(--black-40);
            --text-0: var(--white-100);
            --border-1: var(--black-8);
            --border-2: var(--black-20);
            --anchor-1: var(--primary-100);
            --anchor-2: var(--primary-110);
            }

            .l3t-card {
            opacity: 0;
            z-index: 2147483647;
            position: absolute;
            width: 260px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border-1);
            background: var(--bg-1);
            height: auto;
            box-sizing: border-box;
            box-shadow: 0 8px 28px rgba(0, 0, 0, .16)
            }

            .card_visible {
            opacity: 1 !important;
            }

            .l3t-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            height: 50px;
            }

            .l3t-card-exp {
            padding: 12px;
            font-size: 14px;
            color: var(--text-4);
            }

            .l3t-card-footer {
            margin-top: auto;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            border-radius: 0 0 8px 8px;
            background: var(--bg-3);
            user-select: none;
            }

            .btn-action {
            margin-left: auto;
            display: flex;
            align-items: center;
            }

            .btn-star {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            margin-left: 10px;

            background-color: var(--bg-2);
            width: 22px;
            height: 22px;
            border-radius: 50%;
            }

            .card-icon {
            height: 15px;
            width: 15px;
            }

            .card-slot {
            display: flex;
            align-items: center;
            }

            .card-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 0;
            }

            @media (prefers-color-scheme: dark) {
            .l3t-card {
            background: rgb(34,34,34);
            }
            .l3t-card-footer {
            background: rgb(31,31,31);
            }
            div {
            color: white;
            }
            }

        </shadow-style>
    </shadow-root>


</template>

<style>
.l3t-trans-node {
    color: gray;
    font-size: smaller;
}
</style>
