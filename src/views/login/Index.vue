<template>
    <div class="container">
        <div class="left">
            <Carousel />
        </div>
        <div class="right">
            我是表单
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Carousel from "@/views/login/carousel/Index.vue";
onMounted(() => { })

</script>
<style scoped lang='scss'>
.container {
    display: flex;

    .left {
        width: 50%;
        height: 100vh;
    }

    .right {
        width: 50%;
        height: 100vh;
        background-color: rgb(171, 169, 172);
    }
}
</style>