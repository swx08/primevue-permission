<template>
  <div>
    公告管理
    <Toast />
    <Button label="Show" @click="show()" />
    <InputText v-tooltip="'Enter your username'" type="text" placeholder="Right" />
    <InputText v-tooltip.top="'Enter your username'" type="text" placeholder="Top" />
    <InputText v-tooltip.bottom="'Enter your username'" type="text" placeholder="Bottom" />
    <InputText v-tooltip.left="'Enter your username'" type="text" placeholder="Left" />
  </div>

  <div style="margin-top: 30px;">
    <Button type="button" icon="pi pi-image" label="Image" @click="toggle" />
    <Popover ref="op">
      <div style="width: 300px;height: 300px;">
        我是消息
      </div>
    </Popover>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from "primevue/usetoast";

const toast = useToast();
onMounted(() => {})

const show = () => {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
}
</script>
<style scoped lang='scss'>
</style>