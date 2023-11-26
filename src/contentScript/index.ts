import {createApp, h} from 'vue'
import L3tCard from "./L3tCard.vue";


const app = createApp({
    render() {
        return (h(L3tCard))
    }
})

const root = document.createElement("L3T")
document.body.appendChild(root)
app.mount(root)


function genMarkStyle() {
    return `
        ::highlight(wh-unknown){
            color: #ff0000;
        }
        ::highlight(wh-context){
            color: #16982b;
        }
        `
}
root.appendChild(document.createElement("style")).textContent = genMarkStyle()

