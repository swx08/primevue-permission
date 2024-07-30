<template>
  <Card>
    <template #content>
      <TreeTable
        scrollable
        scrollHeight="430px"
        stripedRows
        v-model:selection="selecteds"
        :value="tableData"
        dataKey="id"
        :loading="loading"
      >
        <template #header>
          <Panel toggleable header="查询">
            <template #icons>
              <Button
                icon="pi pi-cog"
                severity="secondary"
                rounded
                text
                @click="toggle"
              />
              <Menu ref="menu" id="config_menu" :model="optionItems" popup />
            </template>
            <div class="panel-container">
              <div class="panel-left">
                <FloatLabel>
                  <InputText
                    class="input"
                    id="title"
                    v-model="searchMenu.title"
                  />
                  <label for="title">菜单名称</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchMenu.type"
                    inputId="dd-city"
                    :options="typeData"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                  />
                  <label for="dd-city">菜单类型</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchMenu.status"
                    inputId="dd-city"
                    :options="statusData"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                  />
                  <label for="dd-city">菜单状态</label>
                </FloatLabel>
              </div>
              <div class="panel-right">
                <Button
                  @click="handleSearch"
                  v-permission="`permission:menu:query`"
                  label="查询"
                  outlined
                  size="small"
                  icon="pi pi-search"
                  severity="success"
                />
                <Button
                  @click="handleReset"
                  v-permission="`permission:menu:reset`"
                  label="重置"
                  outlined
                  size="small"
                  icon="pi pi-refresh"
                  severity="secondary"
                />
              </div>
            </div>
          </Panel>
        </template>
        <template #empty>
          <div class="empty">
            <svg-icon name="empty" width="110px" height="110px" />
          </div>
        </template>
        <Column
          selectionMode="multiple"
          style="width: 3rem"
          frozen
          :exportable="false"
        ></Column>
        <Column
          field="id"
          header="编号"
          sortable
          frozen
          style="min-width: 8rem"
        >
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column
          header="用户名"
          sortable
          field="username"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <span>{{ data.username }}</span>
          </template>
        </Column>
        <Column header="手机号" field="phone" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span>{{ data.phone }}</span>
          </template>
        </Column>
        <Column field="email" header="邮箱" sortable style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.email }}
          </template>
        </Column>
        <Column header="状态" field="status" style="min-width: 8rem">
          <template #body="{ data }">
            <ToggleSwitch
              @change="handleChangeStatus(data.id)"
              v-model="data.checked"
            />
          </template>
        </Column>
        <Column
          field="createTime"
          sortable
          header="创建时间"
          style="min-width: 15rem"
        >
          <template #body="{ data }">
            {{ data.createTime }}
          </template>
        </Column>
        <Column header="操作" style="min-width: 12rem" frozen>
          <template #body="{ data }">
            <ConfirmPopup></ConfirmPopup>
            <div>
              <Button
                @click="handleEchoUser(data.id)"
                v-permission="`permission:user:update`"
                icon="pi pi-pencil"
                outlined
                rounded
              />
              <Button
                v-permission="`permission:user:delete`"
                @click="confirmDeleteUser(data.id)"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
                style="margin: 0 10px"
              />
              <Button
                v-permission="`permission:user:more`"
                icon="pi  pi-ellipsis-h"
                @click="moreToggle($event, data)"
                outlined
                rounded
                severity="info"
              />
              <Menu ref="moreMenu" id="config_menu" :model="moreItems" popup>
                <template #item="{ item, props }">
                  <a @click="handlerMoreOption(item)" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                  </a>
                </template>
              </Menu>
            </div>
          </template>
        </Column>
      </TreeTable>

      <!-- 分页 -->
      <Paginator
        @page="handlePaginationChange"
        :rows="pageSize"
        :totalRecords="total"
        :rowsPerPageOptions="[10, 20, 30, 40]"
      >
      </Paginator>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";

const selecteds = ref([]);
const loading = ref(false);
const tableData = ref([]);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    // command: () => {
    //   addOrEditUserDialog.value = true;
    // },
  }
]);
const searchMenu = ref({
  title: "",
  type: null,
  status: null
});
const typeData = ref([
  {
    label: '目录',
    value: 0
  },
  {
    label: '菜单',
    value: 1
  },
  {
    label: '按钮',
    value: 2
  }
])

</script>

<style lang="scss" scoped>
.panel-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.panel-left {
  width: 66%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-left .input {
  width: 210px;
  height: 35px;
}

.panel-right {
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.p-datatable-header) {
  padding: 0 0 16px 0;
}

.empty {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  color: red;
  margin: 0 10px;
  font-size: 1.5rem;
}
</style>
