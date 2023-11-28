<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {Store} from "../lib/store";

const way = ref()

onMounted(() => {
    Store.getAllWords().then(res=>way.value = Object.keys(res))
})

const clear = () => {
    Store.clear().then(() => {
        Store.getAllWords().then(res=>way.value = res)
    })
}

const set = () => {
  Store.setKnown('test').then(()=>{
      Store.getAllWords().then(res=>way.value = res)
  })

}
</script>

<template>
    <button @click="clear">clear</button>
    <button @click="set">set</button>
    <button @click="Store.exportData">export</button>
    way: {{way}}
</template>

<style>
</style>
