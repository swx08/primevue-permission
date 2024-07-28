<template>
    <Galleria :value="images" :numVisible="8" :showThumbnails="false" :autoPlay="true"
        :transitionInterval="2000">
        <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%;height: 99.5vh;" />
        </template>
    </Galleria>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { carouselData } from '@/assets/data/carousel';

const images = ref(carouselData);
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>
