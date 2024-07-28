<template>
    <Breadcrumb :model="breadcrumbStore.breadcrumbs">
        <template #item="{ item, props }">
            <router-link v-if="item.href" v-slot="{ href, navigate }" :to="item.href" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="[item.icon, 'text-color']" />
                    <span class="text-primary font-semibold">{{ item.title }}</span>
                </a>
            </router-link>
            <a v-else :href="item.href" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0">{{ item.title }}</span>
            </a>
        </template>
    </Breadcrumb>
</template>

<script setup>
import { ref } from "vue";
import { useBreadcrumbStore } from "@/stores/models/breadcrumb";

const breadcrumbStore = useBreadcrumbStore();
</script>
