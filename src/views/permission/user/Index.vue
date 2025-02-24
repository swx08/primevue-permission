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
                    v-model="searchUser.username"
                  />
                  <label for="username">用户名</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText
                    class="input"
                    id="phone"
                    v-model="searchUser.phone"
                  />
                  <label for="phone">手机号</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchUser.status"
                    inputId="dd-city"
                    :options="statusData"
                    optionLabel="label"
                    optionValue="value"
                  />
                  <label for="dd-city">用户状态</label>
                </FloatLabel>
              </div>
              <div class="panel-right">
                <Button
                  @click="handleSearch"
                  v-permission="`permission:user:query`"
                  label="查询"
                  outlined
                  size="small"
                  icon="pi pi-search"
                  severity="success"
                  :loading="saveLoading"
                />
                <Button
                  @click="handleReset"
                  v-permission="`permission:user:reset`"
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
                  v-permission="`permission:user:delete`"
                  size="small"
                  icon="pi pi-trash"
                  severity="danger"
                  @click="deleteDialog"
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
          style="min-width: 6rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.id"></Tag>
          </template>
        </Column>
        <Column
          header="用户名"
          sortable
          field="username"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.username"></Tag>
          </template>
        </Column>
        <Column header="手机号" field="phone" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <Tag severity="info" :value="data.phone"></Tag>
          </template>
        </Column>
        <Column field="email" header="邮箱" sortable style="min-width: 15rem">
          <template #body="{ data }">
            <Tag severity="info" :value="data.email"></Tag>
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
        <Column header="操作" style="min-width: 12rem" frozen alignFrozen="right">
          <template #body="{ data }">
            <div>
              <Button
                v-permission="`permission:user:more`"
                icon="pi  pi-ellipsis-h"
                @click="moreToggle($event, data)"
                outlined
                rounded
                severity="success"
              />
              <Menu ref="moreMenu" id="config_menu" :model="moreItems" popup>
                <template #item="{ item, props }">
                  <a @click="handlerMoreOption(item)" v-bind="props.action">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                  </a>
                </template>
              </Menu>
              <Button
                @click="handleEchoUser(data.id)"
                v-permission="`permission:user:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                severity="info"
                style="margin: 0 10px"
              />
              <Button
                v-permission="`permission:user:delete`"
                @click="confirmDeleteUser(data.id)"
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

  <!-- 新增、修改用户弹框 -->
  <Dialog
    v-model:visible="addOrEditUserDialog"
    :style="{ width: '41%' }"
    :modal="true"
    @hide="handlerCancel"
    :header="user.id === undefined ? '新增用户' : '修改用户'"
  >
    <div class="form-container" v-verify="verify">
      <div class="form-group">
        <label class="form-label">用户名</label>
        <InputText
          verify="required"
          placeholder="用户名"
          v-model="user.username"
        />
      </div>
      <div class="form-group" v-if="user.id === undefined">
        <label class="form-label">密码</label>
        <Password
          placeholder="密码"
          promptLabel="密码强度"
          weakLabel="轻"
          mediumLabel="中"
          strongLabel="强"
          v-model="user.password"
          inputId="password"
          verify="required"
        />
      </div>
      <div class="form-group">
        <label class="form-label">手机号</label>
        <InputText
          verify="required,phone"
          placeholder="手机号"
          id="phone"
          v-model="user.phone"
        />
      </div>
      <div class="form-group">
        <label class="form-label">邮箱</label>
        <InputText
          verify="required,email"
          id="email"
          placeholder="邮箱"
          v-model="user.email"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handlerAddOrEditUser"
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

  <!-- 删除用户弹框 -->
  <Dialog
    :closable="false"
    v-model:visible="deleteUserDialog"
    :style="{ width: '380px' }"
    header="删除用户"
    :modal="true"
  >
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除用户数据 ? </span>
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

  <!-- 重置密码 -->
  <Dialog
    v-model:visible="resetPwdDialog"
    :style="{ width: '20%' }"
    :modal="true"
    header="重置密码"
    @hide="handlerCancel"
  >
    <div class="form-container" v-verify="verify">
      <div class="form-group">
        <label class="form-label">密码</label>
        <Password
          verify="required"
          promptLabel="密码强度"
          weakLabel="轻"
          mediumLabel="中"
          strongLabel="强"
          v-model="resetUserObj.password"
          placeholder="新密码"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handleResetPwd"
          outlined
          size="small"
        />
        <Button
          label="取消"
          severity="warn"
          icon="pi pi-check"
          @click="handlerCancel"
          outlined
          size="small"
        />
      </div>
    </template>
  </Dialog>

  <!-- 分配角色 -->
  <Drawer
    @hide="handlerCancel"
    v-model:visible="visibleRight"
    style="width: 30%"
    position="right"
  >
    <template #header>
      <div class="header">
        <span>用户分配角色</span>
      </div>
    </template>

    <template #default>
      <div class="role-container">
        <Message style="line-height: 40px; margin-top: 10px">
          <template #icon>
            <label>用户名称：</label>
          </template>
          <span style="font-weight: bold; font-size: 18px">
            {{ tempUserName }}
          </span>
        </Message>
        <Message>
          <label>角色列表：</label>
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
      </div>
    </template>
    <template #footer>
      <div class="permiss-footer">
        <Button
          size="small"
          severity="success"
          @click="handlerSaveRoleList"
          label="确认"
          icon="pi fill-transparent pi-check"
          outlined
          :disabled="!selectedRoleList || !selectedRoleList.length"
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
  findUserList,
  batchDelete,
  deleteUser,
  updateUserStatus,
  resetPwd,
  saveUser,
  queryEchoUserInfo,
  updateUserInfo,
  saveRoles,
  queryRoles,
} from "@/api/user";
import { queryRoleList } from "@/api/role";
import { USER_CONSTANT } from "@/constant/dictType.js";
import { queryDictLabel } from "@/api/dict_data";
import { toast } from "vue3-toastify";
import { create_verify } from "vue-best-verify";

//表单校验
const verify = create_verify({
  border_hint: false,
});
const statusData = ref([]);
const menu = ref(null);
const moreMenu = ref(null);
const loading = ref(true);
const tableData = ref([]);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchUser = ref({
  username: "",
  phone: "",
  status: null,
});
const saveLoading = ref(false);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
      addOrEditUserDialog.value = true;
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
const moreItems = ref([
  {
    label: "重置密码",
    icon: "pi pi-lock",
  },
  {
    label: "分配角色",
    icon: "pi pi-key",
  },
]);
const selecteds = ref([]);
const deleteUsersDialog = ref(false);
const deleteUserDialog = ref(false);
const resetPwdDialog = ref(false);
const addOrEditUserDialog = ref(false);
const visibleRight = ref(false);
const userId = ref(null);
const resetUserObj = ref({
  id: null,
  password: "",
});
const user = ref({});
const selectedRoleList = ref([]);
const roleList = ref([]);
const tempUserName = ref("");

onMounted(() => {
  getUserList();
  getAllRoleList();
  getDictTypeStatus();
});

//获取用户分页数据
const getUserList = () => {
  findUserList(pageNo.value, pageSize.value, searchUser.value).then((res) => {
    if (res.code === 200 && res.data !== null) {
      tableData.value = res.data.data;
      total.value = res.data.total;
      loading.value = false;
    } else {
      loading.value = false;
      tableData.value = [];
      total.value = 0;
    }
  });
};

//获取所有角色数据
const getAllRoleList = () => {
  queryRoleList().then((res) => {
    if (res.code === 200) {
      roleList.value = res.data;
    }
  });
};

//保存用户角色
const handlerSaveRoleList = () => {
  saveRoles(tempUserName.value, selectedRoleList.value).then((res) => {
    if (res.code === 200) {
      toast.success("角色分配成功！");
      visibleRight.value = false;
      selectedRoleList.value = [];
    }
  });
};

//监听分页变化
const handlePaginationChange = (event) => {
  pageNo.value = event.page + 1;
  pageSize.value = event.rows;
  getUserList();
};

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(USER_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  });
};

//重置
const handleReset = () => {
  searchUser.value = {
    username: "",
    phone: "",
    status: null,
  };
  getUserList();
};

//查询
const handleSearch = () => {
  if (
    searchUser.value.username !== "" ||
    searchUser.value.phone !== "" ||
    searchUser.value.status !== null
  ) {
    saveLoading.value = true;
    getUserList();
    saveLoading.value = false;
  }
};

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

const moreToggle = (event, data) => {
  moreMenu.value.toggle(event);
  tempUserName.value = data.username;
  resetUserObj.value.id = data.id;
  queryRoles(data.id).then((res) => {
    if (res.code === 200) {
      selectedRoleList.value = res.data;
    }
  });
};

//更多操作（重置密码、分配角色）
const handlerMoreOption = (item) => {
  if (item.label === "重置密码") {
    resetPwdDialog.value = true;
  } else if (item.label === "分配角色") {
    visibleRight.value = true;
  }
};

//重置密码
const handleResetPwd = () => {
  if (verify.do_verify()) {
    resetPwd(resetUserObj.value).then((res) => {
      if (res.code === 200) {
        toast.success("密码重置成功！");
        resetPwdDialog.value = false;
        resetUserObj.value.id = null;
        resetUserObj.value.password = "";
      }
    });
  }
};

//新增、修改用户
const handlerAddOrEditUser = () => {
  if (verify.do_verify()) {
    user.value.username = user.value.username.trim();
    user.value.phone = user.value.phone.trim();
    user.value.email = user.value.email.trim();
    if (user.value.password) {
      user.value.password = user.value.password.trim();
    }
    if (user.value.id === undefined) {
      addUser(user.value);
    } else {
      editUser(user.value);
    }
  }
};

//新增用户提交
const addUser = (item) => {
  saveUser(item).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      addOrEditUserDialog.value = false;
      getUserList();
      user.value = {};
    }
  });
};

//修改用户提交
const editUser = (item) => {
  updateUserInfo(item).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      addOrEditUserDialog.value = false;
      getUserList();
      user.value = {};
    }
  });
};

//用户数据回显
const handleEchoUser = (id) => {
  queryEchoUserInfo(id).then((res) => {
    if (res.code === 200) {
      user.value = res.data;
      addOrEditUserDialog.value = true;
    }
  });
};

//修改用户状态
const handleChangeStatus = (id) => {
  updateUserStatus(id).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
    }
  });
};

const deleteDialog = () => {
  deleteUserDialog.value = true;
};

const cancelDalog = () => {
  deleteUsersDialog.value = false;
  deleteUserDialog.value = false;
  resetPwdDialog.value = false;
  addOrEditUserDialog.value = false;
  visibleRight.value = false;
};

const handlerSetValue = () => {
  user.value = {};
  resetUserObj.value.id = null;
  resetUserObj.value.password = "";
  selectedRoleList.value = [];
  tempUserName.value = "";
};
//取消删除用户
const handlerCancel = () => {
  cancelDalog();
  handlerSetValue();
};

//删除用户弹框确认
const confirmDeleteUser = (id) => {
  deleteUserDialog.value = true;
  userId.value = id;
};

//删除用户
const handlerDelete = () => {
  if (selecteds.value.length > 0) {
    //过滤出用户id
    const userIdList = selecteds.value.map((item) => item.id);
    batchDelete(userIdList).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getUserList();
        deleteUserDialog.value = false;
        selecteds.value = [];
      }
    });
  } else {
    deleteUser(userId.value).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getUserList();
        deleteUserDialog.value = false;
        userId.value = null;
      }
    });
  }
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

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.role-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.role-content {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
}

.role-content > div {
  display: flex;
  margin: 0 30px 20px 0;
}

.permiss-footer {
  display: flex;
  justify-content: space-between;
}
</style>
