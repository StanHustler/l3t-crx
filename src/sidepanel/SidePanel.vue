<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Store} from "../lib/store";
import {RiPieChartLine, RiListCheck2, RiSettingsLine} from "@remixicon/vue";

const countSync = ref(0)

const YouDaoSetting = ref({
    appKey : '',
    key : ''
})

onMounted(async () => {

    const setting = await Store.getSetting('YouDao')
    YouDaoSetting.value.appKey = setting.appKey
    YouDaoSetting.value.key = setting.key

    chrome.storage.sync.get(['count'], (result) => {
        countSync.value = result.count ?? 0
    })

    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'COUNT') {
            countSync.value = request?.count ?? 0
        }
    })
})

const saveSetting = () => {
  Store.setSetting('YouDao', YouDaoSetting.value)
}
</script>

<template>
    <header>
        <div class="logo">
            L3t
        </div>
        <div class="btn-data-statistics">
            <RiPieChartLine size="16px" class="i"/>
            <a>统计</a>
        </div>
    </header>
    <main>
        <h3>SidePanel Page</h3>

        <h4>Count from Popup: {{ countSync }}</h4>

        appKey <input v-model="YouDaoSetting.appKey">
        key <input v-model="YouDaoSetting.key">
        <button @click="saveSetting">保存</button>

        <div class="dashboard">
            11
            <div class="card">

            </div>
        </div>
    </main>

    <footer>
        <div class="tabs active">
            <RiListCheck2 size = "20px" class="i"/>
            <span>我的</span>
        </div>
        <div class="tabs">
            <RiSettingsLine size = "20px" class="i"/>
            <span>设置</span>
        </div>
    </footer>

</template>

<style lang="less">
body {
    margin: 0;
}
:root {
    --bg-color: yellow;
    --bg-2: #fff5d5;
    --bg-4: #fafafa;
    --border-1: rgba(0,0,0,0.08);
    --anchor-1: #ff7008;
}

@media (prefers-color-scheme: light) {
    :root {
        --bg-color: #1e1e1e;
    }
}

header {
    display: flex;
    align-items: center;
    height: 56px;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: inset 0 -1px 0 var(--border-1);

    .btn-data-statistics {
        margin-left: auto;
        margin-right: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;

        .i {
            color: var(--anchor-1);
            margin-right: 4px;
        }
    }
}

main {
    padding: 0 12px 0 16px;
    height: calc(100vh - 112px);
    overflow-y: auto;
    background: var(--bg-4);

    .dashboard {
        display: flex;
        padding-top: 16px;
        justify-content: space-between;
        flex-wrap: wrap;
        background-color: var(--bg-color);

        .card {
            display: flex;
            align-items: center;
            position: relative;
            padding-left: 16px;
            width: 48%;
            height: 64px;
            box-shadow: 0 3px 7px rgba(0, 0, 0, .07);
            border-radius: 6px;
            margin-bottom: 12px;
            box-sizing: border-box;
            overflow: hidden
        }
    }
}

footer {
    height: 56px;
    box-shadow: inset 0 1px 0 var(--border-1);
    width: 100%;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: var(--bg-1);
    display: flex;
    align-items: center;
    justify-content: center;

    .tabs {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 132px;
    }

    .tabs.active {
        background: var(--bg-2);
        border-radius: 100px;
        color: var(--anchor-1);
    }

}


</style>
