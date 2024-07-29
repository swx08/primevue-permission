<template>
    <Breadcrumb :model="breadcrumbStore.breadcrumbs">
        <template #item="{ item, props }">
            <router-link v-if="item.href" :to="item.href">
                <Button size="small" v-bind="props.action" :label="item.title"
                    :icon="item.icon" text />
            </router-link>
            <Button size="small" v-else v-bind="props.action" :label="item.title" :icon="item.icon" text />
        </template>
    </Breadcrumb>
</template>

<script setup>
import { ref } from "vue";
import { useBreadcrumbStore } from "@/stores/models/breadcrumb";
import Button from "primevue/button";

const breadcrumbStore = useBreadcrumbStore();
</script>

<style scoped lang='scss'>
.p-breadcrumb{
    padding: 5px;
}
</style>
