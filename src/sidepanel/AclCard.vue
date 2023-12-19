<script setup lang="ts">
import {RiArrowRightSLine} from "@remixicon/vue";
</script>

<template>
    <div class="card">
        <div class="c" style="align-items: flex-end">
            <div class="title">
                访问控制
            </div>
            <div>
                <select>
                    <option value="0">不工作</option>
                    <option value="1">正向模式</option>
                    <option value="2">反向模式</option>
                </select>
            </div>
        </div>
        <div class="c" style="align-items: flex-start">
            <div class="subtitle">
                zhihu.com
            </div>
            <div class="desc">
                管理名单
                <RiArrowRightSLine size="12px"/>
            </div>
        </div>
    </div>
</template>

<style scoped>

.c {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
    align-items: center;
}

.card {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0 16px;
    width: 100%;
    height: 64px;
    background: var(--bg-1);
    box-shadow: 0 3px 7px rgba(0, 0, 0, .07);
    border-radius: 6px;
    margin-bottom: 12px;
    box-sizing: border-box;
    overflow: hidden;

    .title {
        font-size: 18px;
        font-weight: 500;
        color: var(--text-9);
    }

    .subtitle, .desc{
        margin-top: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .subtitle{
        color: var(--text-6);
        font-size: 12px;
    }
}
</style>
