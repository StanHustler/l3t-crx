<script setup lang="ts">
import { onMounted, ref } from 'vue'

const link = ref('https://github.com/guocaoyi/create-chrome-ext')

let kInput: HTMLInputElement
let value = ref()

onMounted(() => {
    kInput = document.getElementById('k_input') as HTMLInputElement
    getV()
})

const getV = async () => {
    let res = await chrome.storage.local.get(kInput.value)
    value.value = res[kInput.value]
}

const setV = async () => {
    if (!value.value) return
    await chrome.storage.local.set({ [kInput.value]: JSON.parse(value.value) })
}

</script>

<template>
    <main>
        <h3>DevTools Page</h3>

        <select id="k_input" @change="getV">
            <option>setting</option>
            <option>words</option>
            <option>sentences</option>
        </select>
        <button @click="setV">set</button>
        <table>
            <tr v-for="k in Object.keys(value)" v-if="value">
                <td>
                    <span>{{ k }}</span>
                </td>
                <td>
                    <span>{{ value[k] }}</span>
                </td>
                <td>
                    <button @click="delete value[k]"> X </button>
                </td>
            </tr>
        </table>
    </main>
</template>

<style>
:root {
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        'Open Sans',
        'Helvetica Neue',
        sans-serif;

    color-scheme: light dark;
    background-color: #242424;
}

@media (prefers-color-scheme: light) {
    :root {
        background-color: #fafafa;
    }

    a:hover {
        color: #42b983;
    }
}

body {
    min-width: 20rem;
}

main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
}

h3 {
    color: #42b983;
    text-transform: uppercase;
    font-size: 1.5rem;
    font-weight: 200;
    line-height: 1.2rem;
    margin: 2rem auto;
}

a {
    font-size: 0.5rem;
    margin: 0.5rem;
    color: #cccccc;
    text-decoration: none;
}

textarea {
    width: 90%;
    height: 400px;
}
</style>
