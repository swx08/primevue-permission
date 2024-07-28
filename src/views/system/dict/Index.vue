<template>
  <AutoComplete v-model="value" :suggestions="items" @complete="search"
    :inputStyle="{height: '30px', width: '220px'}" />
  <div style="margin: 20px;">
    <Button style="background-color: red;border-color: red;" raised />
  </div>
  <Button class="color-btn" v-for="(item, index) in themeStore.simpleMenuColor" :key="index"
    :style="{ background: item, borderColor: item }" @click="handlerChangeMenuBgColor(item)" />
</template>

<script setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/models/theme";
const value = ref("字典管理");
const items = ref([]);
const themeStore = useThemeStore();

const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}
</script>
