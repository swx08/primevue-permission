<template>
  <div class="container">
    <div>
      <svg-icon name="404" height="220px" width="400px"></svg-icon>
      <div style="display: flex;justify-content: center;align-items: center;">
        <div>
          <div style="margin-bottom: 30px">
            <span>抱歉，页面不见了～</span>
          </div>
          <router-link to="/home">
            <Button label="返回" icon="pi pi-arrow-circle-left" severity="secondary" raised aria-label="Bookmark" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

</script>
<style scoped lang='scss'>
.container {
  height: 100vh;
  width: 100%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>