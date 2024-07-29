<template>
    <!-- 右侧按钮 -->
    <div class="flex-container">
        <Button style="border-radius: 8px 0 0 8px;padding: 8px;" severity="success" raised aria-label="Search"
            @click="handlerDrawer">
            <i class="pi pi-cog" style="font-size: 1.8rem"></i>
        </Button>
    </div>

    <Drawer style="width: 360px;" v-model:visible="visibleRight" position="right" :showCloseIcon="false">
        <div class="drawer-container">
            <div>
                <span>暗黑模式</span>
                <ToggleSwitch @change="toggleColorScheme" v-model="checked" />
            </div>

            <div>
                <span>预设主题</span>
                <div>
                    <Button label="Aura" @click="handlerTheme('aura')" severity="success" />
                    <Button label="Lara" @click="handlerTheme('lara')" severity="info" />
                    <Button label="Nora" @click="handlerTheme('nora')" severity="warn" />
                </div>
            </div>

            <div>
                <span>菜单主题</span>
                <div>
                    <div style="cursor: pointer;">
                        <svg-icon name="simple" @click="handlerLayout('simple')" />
                        <p>简约</p>
                    </div>
                    <div style="cursor: pointer;" @click="handlerLayout('business')">
                        <svg-icon name="business" />
                        <p>商务</p>
                    </div>
                </div>
                <div v-if="!themeStore.isSimple" class="color-theme">
                    <Button class="color-btn" :label="item" v-for="(item, index) in themeStore.simpleMenuColor"
                        :key="index" :style="{ background: item, borderColor: item }"
                        @click="handlerChangeMenuBgColor(item)" />
                </div>
                <div v-else class="color-theme">
                    <Button class="color-btn" :label="item" v-for="(item, index) in themeStore.businessMenuColor"
                        :key="index" :style="{ background: item, borderColor: item }"
                        @click="handlerChangeMenuBgColor(item)" />
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script setup>
import Divider from 'primevue/divider';
import { ref, onMounted } from 'vue';
import { useThemeStore } from "@/stores/models/theme";

const checked = ref(false);
const visibleRight = ref(false);
const themeStore = useThemeStore();
onMounted(() => { })

// 切换暗色模式
const toggleColorScheme = () => {
    const element = document.querySelector('html');
    element.classList.toggle('my-app-dark');
}

// 切换主题
const handlerTheme = (theme) => {
    themeStore.setTheme(theme);
    //刷新
    location.reload();
}

// 切换布局模式
const handlerLayout = (item) => {
    if (item === 'simple') {
        themeStore.isSimple = false;
    } else {
        themeStore.isSimple = true;
    }
}

const handlerDrawer = () => {
    visibleRight.value = !visibleRight.value;
}

const handlerChangeMenuBgColor = (color) => {
    themeStore.currentMenuBgColor = color;
}
</script>
<style scoped lang='scss'>
.flex-container {
    position: absolute;
    right: 0;
    top: 50%;
}

.drawer-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100vh;
}

.drawer-container>div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex: 1;
}

.drawer-container>div:nth-child(2) {
    width: 100%;
    flex: 2;
}

.drawer-container>div:nth-child(2)>div {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-evenly;
}

.drawer-container>div:nth-child(3) {
    width: 100%;
    flex: 2
}

.drawer-container>div:nth-child(3)>div {
    display: flex;
    align-items: start;
    justify-content: space-evenly;
    margin-top: 40px;

    p {
        font-size: 12px;
        text-align: center;
    }
}

.color-theme {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    /* 一行尽量放三个元素 */
    justify-content: flex-start;
    /* 使用正确的注释和属性名 */
}

.color-theme .color-btn {
    flex-basis: 30%;
    /* 设置子元素的flex基础宽度 */
    margin-right: 5%;
    /* 添加右边距，根据需要调整 */
    margin-bottom: 20px;
    /* 如果需要，可以添加 box-sizing: border-box; 以避免边距影响总宽度 */
}
</style>