import {createApp, h} from 'vue'
import L3tCard from "./L3tCard.vue";
import shadow from 'vue-shadow-dom'


const app = createApp({
    render() {
        return (h(L3tCard))
    }
})
app.use(shadow)

const root = document.createElement("L3T")
document.body.appendChild(root)
app.mount(root)


function genMarkStyle() {
    return `
        ::highlight(l3t-unread){
            color: #ff0000;
        }
        ::highlight(l3t-unknown){
            color: #16982b;
        }
        `
}
root.appendChild(document.createElement("style")).textContent = genMarkStyle()

