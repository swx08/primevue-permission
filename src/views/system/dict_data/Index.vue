<template>
  <div>字典数据</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute();
const id = route.query.id;
toast.success(id)

onMounted(() => {})

</script>
<style scoped lang='scss'>
</style>