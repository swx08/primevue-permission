<template>
    <!-- 右侧按钮 -->
    <div class="flex-container">
        <Button style="border-radius: 8px 0 0 8px;padding: 8px;" severity="success" raised aria-label="Search"
            @click="handlerDrawer">
            <i class="pi pi-cog" style="font-size: 1.8rem"></i>
        </Button>
    </div>

    <Drawer v-model:visible="visibleRight" position="right" :showCloseIcon="false">
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
                    <div style="cursor: pointer;" @click="handlerLayout">
                        <svg-icon name="simple" />
                        <p>简约</p>
                    </div>
                    <div style="cursor: pointer;" @click="handlerLayout">
                        <svg-icon name="business" />
                        <p>商务</p>
                    </div>
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
const handlerLayout = () => {
    themeStore.isSimple = !themeStore.isSimple;
}

const handlerDrawer = () => {
    visibleRight.value = !visibleRight.value;
}
</script>
<style scoped lang='scss'>
.flex-container {
    position: absolute;
    right: 0;
    top: 50%;
}

.drawer-container {
    height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.drawer-container>div {
    flex: auto;
}

.drawer-container>div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.drawer-container>div:nth-child(2) {
    width: 100%;
}

.drawer-container>div:nth-child(2)>div {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
}

.drawer-container>div:nth-child(3) {
    width: 100%;
}

.drawer-container>div:nth-child(3)>div {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-around;

    p{
        font-size: 12px;
        text-align: center;
    }
}
</style>