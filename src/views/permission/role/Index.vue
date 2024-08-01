<template>
  <Card>
    <template #content>
      <DataTable
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
                    id="username"
                    v-model="searchRole.name"
                  />
                  <label for="username">角色名称</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText
                    class="input"
                    id="phone"
                    v-model="searchRole.code"
                  />
                  <label for="phone">角色标识</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchRole.status"
                    inputId="dd-city"
                    :options="statusData"
                    optionLabel="label"
                    optionValue="value"
                  />
                  <label for="dd-city">角色状态</label>
                </FloatLabel>
              </div>
              <div class="panel-right">
                <Button
                  @click="handleSearch"
                  v-permission="`permission:role:query`"
                  label="查询"
                  outlined
                  size="small"
                  icon="pi pi-search"
                  severity="success"
                  :loading="saveLoading"
                />
                <Button
                  @click="handleReset"
                  v-permission="`permission:role:reset`"
                  label="重置"
                  outlined
                  size="small"
                  icon="pi pi-refresh"
                  severity="secondary"
                />
                <Button
                  :disabled="!selecteds || !selecteds.length"
                  label="批量删除"
                  outlined
                  size="small"
                  icon="pi pi-trash"
                  severity="danger"
                  @click="confirmDeleteRole"
                  v-permission="`permission:role:delete`"
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
            <Tag severity="info" :value="data.id"></Tag>
          </template>
        </Column>
        <Column
          header="角色名称"
          sortable
          field="name"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.name"></Tag>
          </template>
        </Column>
        <Column
          header="角色标识"
          field="code"
          sortable
          style="min-width: 12rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.code"></Tag>
          </template>
        </Column>
        <Column header="状态" sortable field="status" style="min-width: 8rem">
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
            <Tag severity="info" :value="data.createTime"></Tag>
          </template>
        </Column>
        <Column header="操作" style="min-width: 12rem" frozen>
          <template #body="{ data }">
            <div>
              <Button
                v-permission="`permission:role:assign`"
                icon="pi  pi-lock"
                @click="confirmAddPermission(data)"
                outlined
                rounded
                severity="success"
              />
              <Button
                @click="handleEchoRole(data.id)"
                v-permission="`permission:role:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                severity="info"
                style="margin: 0 10px"
              />
              <Button
                v-permission="`permission:role:delete`"
                @click="confirmDeleteRole(data.id)"
                icon="pi pi-trash"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </template>
        </Column>
      </DataTable>

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

  <!-- 新增、修改角色弹框 -->
  <Dialog
    v-model:visible="addOrEditRoleDialog"
    :style="{ width: '40%' }"
    :modal="true"
    :header="role.id === undefined ? '新增角色' : '修改角色'"
    @hide="handlerCancel"
  >
    <div class="form-container" v-verify="verify">
      <div class="form-group">
        <label class="form-label">角色名称</label>
        <InputText
          verify="required"
          placeholder="角色名称"
          v-model="role.name"
        />
      </div>
      <div class="form-group">
        <label class="form-label">角色标识</label>
        <InputText
          verify="required"
          placeholder="角色标识"
          v-model="role.code"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handlerAddOrEditRole"
          outlined
          size="small"
        />
        <Button
          label="取消"
          severity="warn"
          icon="pi pi-times"
          @click="handlerCancel"
          outlined
          size="small"
        />
      </div>
    </template>
  </Dialog>

  <!-- 删除角色弹框 -->
  <Dialog
    :closable="false"
    v-model:visible="deleteRoleDialog"
    :style="{ width: '380px' }"
    header="删除角色"
    :modal="true"
  >
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除角色数据 ? </span>
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
        @click="handlerDelete"
      />
    </template>
  </Dialog>

  <!-- 分配权限 -->
  <Drawer
    @hide="handlerCancel"
    v-model:visible="visibleRight"
    style="width: 30%"
    position="right"
    header="角色分配权限"
  >
    <template #default>
      <div class="role-container">
        <Message class="msg msg-one">
          <template #icon>
            <label>角色名称：</label>
          </template>
          <span style="font-weight: bold; font-size: 18px">
            {{ tempRoleName }}
          </span>
        </Message>
        <Tree
          v-model:selectionKeys="selectedMenuKeys"
          v-model:expandedKeys="expandedKeys"
          :value="treeData"
          selectionMode="checkbox"
        ></Tree>
      </div>
    </template>

    <template #footer>
      <div class="footer">
        <Button
          size="small"
          severity="success"
          @click="handlerSavePermiss"
          label="确认"
          icon="pi fill-transparent pi-check"
          :loading="saveLoading"
          outlined
        />
        <Button
          size="small"
          severity="warn"
          @click="handlerCancel"
          label="取消"
          outlined
          icon="pi pi-times"
        />
      </div>
    </template>
  </Drawer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  findRoleList,
  addRole,
  echoRole,
  updateRole,
  removeRole,
  batchDelete,
  updateRoleStatus,
  savePermission,
} from "@/api/role";
import { queryDictLabel } from "@/api/dict_data";
import { ROLE_CONSTANT } from "@/constant/dictType.js";
import { toast } from "vue3-toastify";
import { queryMenuList, queryRoleMenuList } from "@/api/menu";
import { create_verify } from "vue-best-verify";

//表单校验
const verify = create_verify({
  border_hint: false,
});
const statusData = ref([]);
const menu = ref(null);
const loading = ref(true);
const tableData = ref([]);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchRole = ref({
  name: "",
  code: "",
  status: null,
});
const saveLoading = ref(false);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
      addOrEditRoleDialog.value = true;
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
const selecteds = ref([]);
const selectedMenuKeys = ref({});
const expandedKeys = ref({});
const addOrEditRoleDialog = ref(false);
const deleteRoleDialog = ref(false);
const visibleRight = ref(false);

const role = ref({});
const deleteRoleId = ref(null);
const tempRoleId = ref(null);
const tempRoleName = ref("");
const treeData = ref([]);

onMounted(() => {
  getRoleList();
  getDictTypeStatus();
  getAllMenuData();
});

//获取角色分页数据
const getRoleList = () => {
  findRoleList(pageNo.value, pageSize.value, searchRole.value).then((res) => {
    if (res.code === 200 && res.data !== null) {
      tableData.value = res.data.data;
      total.value = res.data.total;
      loading.value = false;
    } else {
      loading.value = false;
    }
  });
};

//监听分页变化
const handlePaginationChange = (event) => {
  pageNo.value = event.page + 1;
  pageSize.value = event.rows;
  getRoleList();
};

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(ROLE_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  });
};

//重置
const handleReset = () => {
  searchRole.value = {
    name: "",
    code: "",
    status: null,
  };
  getRoleList();
};

//查询
const handleSearch = () => {
  if (
    searchRole.value.name !== "" ||
    searchRole.value.code !== "" ||
    searchRole.value.status !== null
  ) {
    getRoleList();
  }
};

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

//新增、编辑角色
const handlerAddOrEditRole = () => {
  if (verify.do_verify()) {
    if (role.value.id === undefined) {
      handlerAdd();
    } else {
      handlerEdit();
    }
  }
};

//新增
const handlerAdd = () => {
  addRole(role.value).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      addOrEditRoleDialog.value = false;
      getRoleList();
      role.value = {};
    }
  });
};

//修改
const handlerEdit = () => {
  updateRole(role.value).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      addOrEditRoleDialog.value = false;
      getRoleList();
      role.value = {};
    }
  });
};

//角色数据回显
const handleEchoRole = (id) => {
  echoRole(id).then((res) => {
    if (res.code === 200) {
      role.value = res.data;
      addOrEditRoleDialog.value = true;
    }
  });
};

//删除角色弹框
const confirmDeleteRole = (id) => {
  deleteRoleDialog.value = true;
  deleteRoleId.value = id;
};

//删除角色
const handlerDelete = () => {
  if (selecteds.value.length > 0) {
    //批量删除
    //过滤出角色id
    const roleIdList = selecteds.value.map((item) => item.id);
    batchDelete(roleIdList).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getRoleList();
        deleteRoleDialog.value = false;
        selecteds.value = [];
      }
    });
  } else {
    removeRole(deleteRoleId.value).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getRoleList();
        deleteRoleDialog.value = false;
        deleteRoleId.value = null;
      }
    });
  }
};

//修改状态
const handleChangeStatus = (id) => {
  updateRoleStatus(id).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      getRoleList();
    }
  });
};

//分配权限弹框
const confirmAddPermission = (role) => {
  if (role.code === "admin") {
    toast.error("管理员角色不允许修改！");
    return;
  }
  tempRoleName.value = role.name;
  tempRoleId.value = role.id;
  queryRoleMenuList(role.id).then((res) => {
    if (res.code === 200) {
      //封装数据结构
      handlerDataStructure(res.data);
    }
  });
};

//封装数据结构
const handlerDataStructure = (data) => {
  data.forEach((item) => {
    selectedMenuKeys.value[item] = {
      checked: true,
      partialChecked: false,
    };
    expandedKeys.value[item] = true;
  });
  visibleRight.value = true;
};

//获取菜单数据 抽屉树形数据
const getAllMenuData = () => {
  queryMenuList().then((res) => {
    if (res.code === 200) {
      treeData.value = res.data;
    }
  });
};

//保存分配好的权限
const handlerSavePermiss = () => {
  if (Object.keys(selectedMenuKeys.value).length !== 0) {
    saveLoading.value = true;
    //取出键值
    const keysArray = Object.keys(selectedMenuKeys.value);
    //转换为数字类型
    const finalResult = keysArray.map(Number);
    savePermission(tempRoleId.value, finalResult).then((res) => {
      if (res.code === 200) {
        toast.success("分配成功！");
        visibleRight.value = false;
        selectedMenuKeys.value = {};
        tempRoleId.value = null;
        tempRoleName.value = null;
        expandedKeys.value = {};
        saveLoading.value = false;
      } else {
        saveLoading.value = false;
      }
    });
  } else {
    toast.error("请选择权限！");
  }
};

const handlerCancelDialog = () => {
  addOrEditRoleDialog.value = false;
  deleteRoleDialog.value = false;
  visibleRight.value = false;
};

const handlerSetValue = () => {
  role.value = {};
  deleteRoleId.value = null;
  expandedKeys.value = {};
  selectedMenuKeys.value = {};
  tempRoleId.value = null;
  tempRoleName.value = null;
};

const handlerCancel = () => {
  handlerCancelDialog();
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
  width: 26%;
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
  gap: 10px 50px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

:deep(.p-inputtext) {
  width: 250px;
}

.role-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg-one {
  margin-top: 10px;
  line-height: 40px;
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
