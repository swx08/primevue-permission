<template>
  <div class="layout-content" :class="{ collapsed: collapsedStore.collapsed ? true : false }">
    <Simplebar class="scrollbarWrap" data-simplebar-auto-hide="false">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" v-if="flag" />
        </transition>
      </router-view>
    </Simplebar>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useCollapsedStore } from "@/stores/models/collapsed";
import { useRefreshStore } from "@/stores/models/refresh";
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

//控制菜单收缩
const collapsedStore = useCollapsedStore();
const useRefresh = useRefreshStore();
//控制当前组件是否销毁重建
const flag = ref(true);

//监听pina中存储的refresh是否改变，若改变则说明刷新
watch(
  () => useRefresh.refresh,
  () => {
    //点击刷新按钮，路由组件销毁
    flag.value = false;
    //紧接着又重新创建组件，相当于重新发送请求
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>
<style scoped lang='scss'>
.layout-content {
  height: calc(100vh - $base-header-height - ($base-header-padding * 3));
  width: calc(100vw - $base-aside-width);
  margin: $base-content-margin;
  transition: all 0.3s;

  &.collapsed {
    width: calc(100vw - $base-aside-collapsed-width);
    transition: all 0.3s;
  }
}

.scrollbarWrap {
  height: calc(100vh - $base-header-height - ($base-header-padding * 3));
  width: 100%;
}

// 滚动条背景颜色
:deep(.simplebar-scrollbar::before) {
  display: none;
  // background-color: $simplebar-scrollbar-backColor;
}

// 滚动条宽度
:deep(.simplebar-vertical) {
  width: 10px;
}

.fade-enter-active {
  /* 增加了过渡的持续时间以使其更温和 */
  transition: opacity 0.7s, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* 更平缓的缓动函数 */
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.7);
  /* 从0.5开始缩放，使起始状态部分可见 */
  transform-origin: center;
}
</style>