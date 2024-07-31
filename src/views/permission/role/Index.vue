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
        </Column>
        <Column
          header="角色名称"
          sortable
          field="name"
          style="min-width: 10rem"
        >
        </Column>
        <Column
          header="角色标识"
          field="code"
          sortable
          style="min-width: 12rem"
        >
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
        </Column>
        <Column header="操作" style="min-width: 12rem" frozen>
          <template #body="{ data }">
            <div>
              <Button
                v-permission="`permission:user:more`"
                icon="pi  pi-lock"
                @click="moreToggle($event, data)"
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
                style="margin: 0 10px"
                severity="info"
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
    :style="{ width: '380px' }"
    :modal="true"
    :closable="false"
  >
    <template #header>
      <div class="form-header">
        <div class="header">
          <span>{{ role.id === undefined ? "新增角色" : "修改角色" }}</span>
          <Button
            @click="handlerCancel"
            icon="pi pi-times"
            rounded
            severity="secondary"
            text
          />
        </div>
      </div>
    </template>
    <div class="form-container" v-verify="verify">
      <div class="form-row">
        <label>角色名称</label>
        <InputText
          verify="required"
          placeholder="角色名称"
          v-model="role.name"
        />
      </div>
      <div class="form-row">
        <label>角色标识</label>
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

  <!-- 分配角色 -->
  <Drawer v-model:visible="visibleRight" style="width: 360px" position="right">
    <template #header>
      <div class="header">
        <span>用户分配角色</span>
      </div>
    </template>

    <template #default>
      <div class="role-container">
        <Message>
          <template #icon>
            <span class="pi pi-user"></span>
          </template>
          <span style="margin-left: 10px">
            {{ tempUserName }}
          </span>
        </Message>
        <Message>
          <label>角色列表</label>
          <div class="role-content">
            <div v-for="(role, index) in roleList" :key="index">
              <Checkbox
                v-model="selectedRoleList"
                :inputId="index"
                name="role"
                :value="role"
              />
              <label style="margin-left: 10px" :for="index">{{ role }}</label>
            </div>
          </div>
        </Message>
        <Button
          size="small"
          severity="success"
          @click="handlerSaveRoleList"
          label="确认"
          style="width: 100%"
          icon="pi fill-transparent pi-check"
          :disabled="!selectedRoleList || !selectedRoleList.length"
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
  updateRoleStatus
} from "@/api/role";
import { queryDictLabel } from "@/api/dict_data";
import { ROLE_CONSTANT } from "@/constant/dictType.js";
import { toast } from "vue3-toastify";
import { create_verify } from "vue-best-verify";

//表单校验
const verify = create_verify({
  border_hint: false,
});
const statusData = ref([]);
const menu = ref(null);
const loading = ref(false);
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
const addOrEditRoleDialog = ref(false);
const deleteRoleDialog = ref(false);
const visibleRight = ref(false);

const role = ref({});
const selectedRoleList = ref([]);
const deleteRoleId = ref(null);

onMounted(() => {
  getRoleList();
  getDictTypeStatus();
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

const handlerCancelDialog = () => {
  addOrEditRoleDialog.value = false;
  deleteRoleDialog.value = false;
};

const handlerSetValue = () => {
  role.value = {
    id: null,
    name: "",
    code: "",
  };
  deleteRoleId.value = null;
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

.form-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-header .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  line-height: 30px;
}

.header span {
  font-size: 1.2rem;
  font-weight: bold;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row input {
  width: 250px;
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer button {
  width: 250px;
  margin: 15px 0 15px 0;
}

#small-help {
  color: red;
  font-size: 12px;
}
</style>
