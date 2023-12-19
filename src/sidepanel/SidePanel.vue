<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Store} from "../lib/store";
import {RiPieChartLine, RiListCheck2, RiSettingsLine, RiFileList3Fill, RiArrowRightSLine} from "@remixicon/vue";
import AclCard from "./AclCard.vue";

const countSync = ref(0)

const YouDaoSetting = ref({
    appKey : '',
    key : ''
})

const pageIndex = ref(0)

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
    <main v-if="pageIndex===0">
        <h3>SidePanel Page</h3>

        <h4>Count from Popup: {{ countSync }}</h4>

        appKey <input v-model="YouDaoSetting.appKey">
        key <input v-model="YouDaoSetting.key">
        <button @click="saveSetting">保存</button>

        <div class="dashboard">
            <div class="card">
                <RiFileList3Fill size="44px" class="i"/>
                <div class="stats">
                    <span class="num">4</span>
                    <span class="des">
                        <span>例句</span>
                        <RiArrowRightSLine size="12px"/>
                    </span>
                </div>
            </div>
        </div>

        <AclCard/>
    </main>
    <main v-if="pageIndex===1" style="background-color: white">
        <div class="section-card">
            <div class="label">基础设置</div>
            <div class="item-table">
                <div class="item">
                    <div class="left"><div class="name">界面语言</div></div>
                    <div class="right">
                        <div class="selector">
                            <span>中文-简体</span>
                            <RiArrowRightSLine size="12px"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <footer>
        <div class="tabs" :class="pageIndex==0?'active':''" @click="pageIndex=0">
            <RiListCheck2 size = "20px" class="i"/>
            <span>我的</span>
        </div>
        <div class="tabs" :class="pageIndex==1?'active':''" @click="pageIndex=1">
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
    --bg-1: #fff;
    --bg-2: #fff5d5;
    --bg-4: #fafafa;
    --border-1: rgba(0,0,0,0.08);
    --anchor-1: #ff7008;
    --text-6: rgba(0,0,0,0.6);
    --text-8: rgba(0,0,0,0.8);
    --text-9: rgba(0,0,0,0.9);

    --icon-style-bg: rgba(0,0,0,0.04);
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

        .card {
            display: flex;
            align-items: center;
            position: relative;
            padding-left: 16px;
            width: 48%;
            height: 64px;
            background: var(--bg-1);
            box-shadow: 0 3px 7px rgba(0, 0, 0, .07);
            border-radius: 6px;
            margin-bottom: 12px;
            box-sizing: border-box;
            overflow: hidden;

            .i {
                position: absolute;
                right: -2px;
                bottom: -12px;
                color: var(--icon-style-bg);
            }

            .stats {
                display: flex;
                flex-direction: column;

                .num {
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--text-9);
                }

                .des {
                    margin-top: 4px;
                    display: flex;
                    align-items: center;
                    color: var(--text-6);
                    cursor: pointer;
                    font-size: 12px;
                }
            }
        }
    }

    .section-card {
        margin-top: 24px;

        .label {
            font-size: 14px;
            color: var(--text-8);
            font-weight: 500;
        }

        .item-table {
            margin-top: 16px;
            border: 1px solid var(--border-1);
            border-radius: 6px;

            .item {
                &:last-child {
                    border-bottom: none;
                }
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 40px;
                padding: 0 16px;
                border-bottom: 1px solid var(--border-1);
                position: relative;

                .right {
                    text-align: right;
                    cursor: pointer;

                    .selector {
                        display: flex;
                        align-items: center;
                    }
                }

                .name {
                    font-size: 13px;
                    color: var(--text-8);
                    display: block;
                    max-width: 184px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-user-select: none;
                    user-select: none;
                }
            }
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
        cursor: pointer;
    }

    .tabs.active {
        background: var(--bg-2);
        border-radius: 100px;
        color: var(--anchor-1);
    }

}


</style>
