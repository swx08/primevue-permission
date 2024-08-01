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
        <Column
          header="权限标识"
          sortable
          field="permission"
          style="min-width: 15rem"
        >
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
        <Column
          header="操作"
          alignFrozen="right"
          style="min-width: 12rem"
          frozen
        >
          <template #body="{ node }">
            <div>
              <Button
                @click="handleAddMenu(node.data)"
                v-permission="`permission:menu:add`"
                icon="pi  pi-plus"
                outlined
                rounded
                severity="success"
                :disabled="node.data.type === 2"
              />
              <Button
                @click="handleEchoMenu(node.data)"
                v-permission="`permission:menu:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                severity="info"
                style="margin: 0 10px"
              />
              <Button
                v-permission="`permission:menu:delete`"
                @click="confirmDeleteMenu(node.data)"
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

  <!-- 新增菜单弹框 -->
  <Drawer
    v-model:visible="addDirectDrawer"
    :style="{ width: '45%' }"
    position="right"
    @hide="handlerCancel"
  >
    <template #header>
      <span style="font-weight: bold; font-size: 18px">{{
        menuDTO.id === undefined ? "新增菜单" : "修改菜单"
      }}</span>
    </template>

    <div class="msg-tip">
      <Message severity="warn">注意：请先选择菜单类型！！！</Message>
    </div>
    <div class="form-container" v-verify="verify">
      <div class="form-group">
        <label class="form-label">上级菜单</label>
        <InputText placeholder="上级菜单" v-model="menuDTO.parent" disabled />
      </div>
      <div class="form-group">
        <label class="form-label">菜单类型</label>
        <Select
          v-model="menuDTO.type"
          inputId="dd-city"
          :options="typeData"
          optionLabel="label"
          optionValue="value"
          placeholder="菜单类型"
          @change="doChange"
        />
      </div>
      <div class="form-group" v-if="btnShow">
        <label class="form-label">组件名称</label>
        <InputText
          verify="required"
          placeholder="大写开头：Permission"
          v-model="menuDTO.name"
        />
      </div>
      <div class="form-group">
        <label class="form-label">菜单名称</label>
        <InputText
          verify="required"
          placeholder="如：权限管理"
          v-model="menuDTO.title"
        />
      </div>
      <div class="form-group" v-if="directShow">
        <label class="form-label">权限标识</label>
        <InputText
          verify="required"
          placeholder="permission:user:add"
          v-model="menuDTO.permission"
        />
      </div>
      <div class="form-group" v-if="menuShow">
        <label class="form-label">组件路径</label>
        <InputText
          verify="required"
          placeholder="/permission/user/index"
          v-model="menuDTO.component"
        />
      </div>
      <div class="form-group">
        <label class="form-label">菜单状态</label>
        <Select
          v-model="menuDTO.status"
          :options="statusData"
          optionLabel="label"
          optionValue="value"
          placeholder="菜单状态"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button
          size="small"
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handlerSaveOrEditMenu"
          outlined
          :loading="saveLoading"
        />
        <Button
          size="small"
          @click="handlerCancel"
          label="取消"
          severity="danger"
          icon="pi pi-times"
          outlined
        />
      </div>
    </template>
  </Drawer>

  <!-- 删除菜单弹框 -->
  <Dialog
    :closable="false"
    v-model:visible="deleteMenuDialog"
    :style="{ width: '380px' }"
    header="删除菜单"
    :modal="true"
  >
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除菜单数据 ? </span>
    </div>
    <template #footer>
      <Button
        label="取消"
        outlined
        size="small"
        icon="pi pi-times"
        text
        @click="handlerCancel"
      />
      <Button
        label="确认"
        severity="danger"
        outlined
        size="small"
        icon="pi pi-check"
        text
        @click="handlerDeleteMenu"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MENU_CONSTANT } from "@/constant/dictType.js";
import { queryDictLabel } from "@/api/dict_data";
import {
  queryMenuList,
  queryMenuListByLike,
  addMenu,
  echoMenu,
  updateMenu,
  removeMenu,
} from "@/api/menu";
import { create_verify } from "vue-best-verify";
import { toast } from "vue3-toastify";
import { verifyMenuName } from "@/utils/regexutils";

//表单校验
const verify = create_verify({
  border_hint: false,
});
const menu = ref();
const saveLoading = ref(false);
const loading = ref(true);
const tableData = ref([]);
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
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
      addDirectDrawer.value = true;
      menuDTO.value.parent = "主类目";
      typeData.value = [
        {
          label: "目录",
          value: 0,
        },
      ];
    },
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
const statusData = ref([]);
const addDirectDrawer = ref(false);
const deleteMenuDialog = ref(false);
const menuDTO = ref({});
const directShow = ref(true);
const menuShow = ref(true);
const btnShow = ref(true);
const deleteMenuId = ref(null);

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
  if (
    searchMenu.value.title !== "" ||
    searchMenu.value.type !== null ||
    searchMenu.value.status !== null
  ) {
    getMenuListByLike();
  }
};

//模糊查询
const getMenuListByLike = () => {
  queryMenuListByLike(searchMenu.value).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data;
    }
  });
};

//重置
const handleReset = () => {
  searchMenu.value = {
    title: "",
    type: null,
    status: null,
  };
  getAllMenuData();
};

//菜单类型改变
const doChange = (event) => {
  const tempType = menuDTO.value.type;
  const tempParent = menuDTO.value.parent;
  menuDTO.value = {};
  menuDTO.value.type = tempType;
  menuDTO.value.parent = tempParent;
  if (event.value === 0) {
    directShow.value = false;
    menuShow.value = false;
    btnShow.value = true;
  } else if (event.value === 1) {
    directShow.value = true;
    btnShow.value = true;
    menuShow.value = true;
  } else if (event.value === 2) {
    btnShow.value = false;
    directShow.value = true;
    menuShow.value = false;
  }
};

//新增、修改菜单
const handlerSaveOrEditMenu = () => {
  if (menuDTO.value.type === undefined) {
    toast.error("请选择菜单类型！");
  } else {
    //校验菜单权限标识和组件路径是否符合规范
    try {
      verifyMenuName(menuDTO.value);
    } catch (error) {
      toast.error(error.message);
      return;
    }
    if (verify.do_verify()) {
      saveLoading.value = true;
      if (menuDTO.value.id === undefined) {
        handleAdd();
      } else {
        handleEdit();
      }
    }
  }
};

//新增菜单
const handleAdd = () => {
  //新增菜单
  addMenu(menuDTO.value).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      addDirectDrawer.value = false;
      saveLoading.value = false;
      menuDTO.value = {};
      getAllMenuData();
    } else {
      saveLoading.value = false;
    }
  });
};

//修改菜单
const handleEdit = () => {
  //修改菜单
  updateMenu(menuDTO.value).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      addDirectDrawer.value = false;
      saveLoading.value = false;
      menuDTO.value = {};
      getAllMenuData();
    } else {
      saveLoading.value = false;
    }
  });
};

//回显菜单数据
const handleEchoMenu = (menu) => {
  echoMenu(menu.id).then((res) => {
    if (res.code === 200) {
      menuDTO.value = res.data;
      if (menuDTO.value.type === 0) {
        directShow.value = false;
        menuShow.value = false;
        btnShow.value = true;
        typeData.value = [
          {
            label: "目录",
            value: 0,
          },
        ];
      } else if (menuDTO.value.type === 1) {
        directShow.value = true;
        btnShow.value = true;
        menuShow.value = true;
        typeData.value = [
          {
            label: "菜单",
            value: 1,
          },
          {
            label: "按钮",
            value: 2,
          },
        ];
      } else if (menuDTO.value.type === 2) {
        btnShow.value = false;
        directShow.value = true;
        menuShow.value = false;
        typeData.value = [
          {
            label: "菜单",
            value: 1,
          },
          {
            label: "按钮",
            value: 2,
          },
        ];
      }

      addDirectDrawer.value = true;
    }
  });
};

//新增菜单、按钮
const handleAddMenu = (menu) => {
  menuDTO.value.parent = menu.title;
  addDirectDrawer.value = true;
  typeData.value = [
    {
      label: "菜单",
      value: 1,
    },
    {
      label: "按钮",
      value: 2,
    },
  ];
};

const confirmDeleteMenu = (menu) => {
  deleteMenuId.value = menu.id;
  deleteMenuDialog.value = true;
};

//删除菜单
const handlerDeleteMenu = () => {
  removeMenu(deleteMenuId.value).then((res) => {
    if (res.code === 200) {
      toast.success("删除成功！");
      getAllMenuData();
      deleteMenuDialog.value = false;
    }
  });
};

const cancelDalogOrDrawer = () => {
  addDirectDrawer.value = false;
  deleteMenuDialog.value = false;
};

const handlerSetValue = () => {
  menuDTO.value = {};
  directShow.value = true;
  menuShow.value = true;
  btnShow.value = true;
  deleteMenuId.value = null;
};
//所有的弹窗以及抽屉的关闭方法
const handlerCancel = () => {
  cancelDalogOrDrawer();
  handlerSetValue();
};
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

/* 定义表单容器的样式 */
.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px 30px;
}
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.form-label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
}

input[type="text"] {
  width: 200px;
}

:deep(.p-select) {
  width: 200px;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.msg-tip {
  margin-bottom: 30px;
  line-height: 38px;
  padding-top: 10px;
}
</style>
