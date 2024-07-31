<template>
  <Card>
    <template #content>
      <TreeTable
        :value="tableData"
        scrollable
        scrollHeight="430px"
        stripedRows
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
          field="id"
          header="编号"
          sortable
          frozen
          expander
          style="min-width: 8rem"
        >
        </Column>
        <Column
          header="组件名称"
          sortable
          field="name"
          style="min-width: 10rem"
        >
        </Column>
        <Column
          header="菜单名称"
          field="title"
          sortable
          style="min-width: 10rem"
        >
        </Column>
        <Column field="type" header="类型" sortable style="min-width: 8rem">
          <template #body="{ node }">
            <Tag v-if="node.data.type === 0" severity="info" value="目录"></Tag>
            <Tag
              v-if="node.data.type === 1"
              severity="success"
              value="菜单"
            ></Tag>
            <Tag v-if="node.data.type === 2" severity="warn" value="按钮"></Tag>
            {{ type }}
          </template>
        </Column>
        <Column header="权限标识" sortable field="permission" style="min-width: 15rem">
        </Column>
        <Column
          field="component"
          sortable
          header="组件路径"
          style="min-width: 16rem"
        >
        </Column>
        <Column field="status" sortable header="状态" style="min-width: 8rem">
          <template #body="{ node }">
            <Tag
              v-if="node.data.status === 0"
              severity="danger"
              value="禁用"
            ></Tag>
            <Tag
              v-if="node.data.status === 1"
              severity="success"
              value="正常"
            ></Tag>
          </template>
        </Column>
        <Column header="操作" alignFrozen="right" style="min-width: 12rem" frozen>
          <template #body="{ data }">
            <ConfirmPopup></ConfirmPopup>
            <div>
              <Button
                v-permission="`permission:menu:add`"
                icon="pi  pi-plus"
                outlined
                rounded
                severity="success"
              />
              <Button
                @click="handleEchoUser(data.id)"
                v-permission="`permission:menu:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                severity="info"
                style="margin: 0 10px"
              />
              <Button
                v-permission="`permission:menu:delete`"
                @click="confirmDeleteUser(data.id)"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </template>
        </Column>
      </TreeTable>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MENU_CONSTANT } from "@/constant/dictType.js";
import { queryDictLabel } from "@/api/dict_data";
import { queryMenuList ,queryMenuListByLike} from "@/api/menu";

const menu = ref();
const loading = ref(false);
const tableData = ref([]);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
       addOrEditUserDialog.value = true;
     }
  },
  {
    label: "导入",
    icon: "pi pi-file-import",
  },
  {
    label: "导出",
    icon: "pi pi-file-export",
  },
]);
const searchMenu = ref({
  title: "",
  type: null,
  status: null,
});
const typeData = ref([
  {
    label: "目录",
    value: 0,
  },
  {
    label: "菜单",
    value: 1,
  },
  {
    label: "按钮",
    value: 2,
  },
]);
const statusData = ref([]);

onMounted(() => {
  getAllMenuData();
  getDictTypeStatus();
});
//获取菜单数据 抽屉树形数据
const getAllMenuData = () => {
  queryMenuList().then((res) => {
    if (res.code === 200) {
      tableData.value = res.data;
      loading.value = false;
    } else {
      loading.value = false;
    }
  });
};

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(MENU_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  });
};

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

//搜索
const handleSearch = () => {
  if ((searchMenu.value.title !== "") || (searchMenu.value.type !== null) || (searchMenu.value.status !== null)) {
    getMenuListByLike();
  }
}

//模糊查询
const getMenuListByLike = () => {
  queryMenuListByLike(searchMenu.value).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data;
    }
  })
}

//重置
const handleReset = () => {
  searchMenu.value = {
    title: "",
    type: null,
    status: null
  };
  getAllMenuData();
}
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
