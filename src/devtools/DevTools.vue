<script setup lang="ts">
import {onMounted, ref} from 'vue'

const link = ref('https://github.com/guocaoyi/create-chrome-ext')

let k:HTMLInputElement,v:HTMLInputElement;

onMounted(()=>{
    v = document.getElementById('v_input') as HTMLInputElement
    k = document.getElementById('k_input') as HTMLInputElement
})

const getV = async () =>{
    let res =  await chrome.storage.local.get(k.value)
    v.value = res[k.value]
}

const setV = async () =>{
    await chrome.storage.local.set({[k.value]:JSON.parse(v.value)})
}

</script>

<template>
  <main>
    <h3>DevTools Page</h3>

    <input id="k_input" @change="getV" />
    <textarea id="v_input" />
      <button @click="setV"> set </button>
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
