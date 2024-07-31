<template>
  <div>
    字典管理
    <div style="margin-top: 30px">
      <Tree
        v-model:selectionKeys="selectedKey"
        :value="nodes"
        selectionMode="checkbox"
        v-model:expandedKeys="expandedKeys"
      ></Tree>
    </div>

    <div style="margin-top: 30px">
      <Button label="数据" @click="handlerData" />
    </div>

    <div>
      数据：
      <!-- {{ selectedKey }} -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
onMounted(() => {});

const nodes = ref([
  {
    key: "1",
    label: "测试1",
    parentId: 1,
    children: [
      {
        key: "1-1",
        label: "测试1-1",
        parentId: 1,
      },
      {
        key: "1-2",
        label: "测试1-2",
        parentId: 1,
      },
    ],
  },
  {
    key: "2",
    label: "测试2",
    parentId: 1,
    children: [
      {
        key: "2-1",
        label: "测试2-1",
        parentId: 1,
      },
      {
        key: "2-2",
        label: "测试2-2",
        parentId: 1,
      },
    ],
  },
]);

const expandedKeys = ref({
  '1': true,
  "1-1": true,
  "1-2": true,
});
const selectedKey = ref({
  1: {
    checked: true,
    partialChecked: false,
  },
  // "1-1": {
  //   checked: true,
  //   partialChecked: false,
  // },
  "1-2": {
    checked: true,
    partialChecked: false,
  },
});

const handlerData = () => {
  // toast.success(selectedKey.value)
  // console.log(selectedKey.value);
  const temp = {};
  const numbers = [1, 2, 3]; // 原始数组
  numbers.forEach((n) => {
    temp[n] = {
      checked: true,
      partialChecked: false,
    };
  });

  console.log(temp);
};
</script>
<style scoped lang='scss'>
</style>