<template>
  <Card>
    <template #content>
      <DataTable scrollable scrollHeight="430px" stripedRows v-model:selection="selecteds" :value="tableData"
        dataKey="id" :loading="loading">
        <template #header>
          <Panel toggleable header="查询">
            <template #icons>
              <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
              <Menu ref="menu" id="config_menu" :model="optionItems" popup />
            </template>
            <div class="panel-container">
              <div class="panel-left">
                <FloatLabel>
                  <InputText class="input" id="username" v-model="searchUser.username" />
                  <label for="username">用户名</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText class="input" id="phone" v-model="searchUser.phone" />
                  <label for="phone">手机号</label>
                </FloatLabel>
                <FloatLabel>
                  <Select class="input" v-model="searchUser.status" inputId="dd-city" :options="statusData"
                    optionLabel="label" optionValue="value" showClear />
                  <label for="dd-city">用户状态</label>
                </FloatLabel>
              </div>
              <div class="panel-right">
                <Button @click="handleSearch" v-permission="`permission:user:query`" label="查询" outlined size="small"
                  icon="pi pi-search" severity="success" :loading="saveLoading" />
                <Button @click="handleReset" v-permission="`permission:user:reset`" label="重置" outlined size="small"
                  icon="pi pi-refresh" severity="secondary" />
                <Button :disabled="!selecteds || !selecteds.length" label="批量删除" outlined size="small"
                  icon="pi pi-trash" severity="danger" @click="deleteDialog" />
              </div>
            </div>
          </Panel>
        </template>
        <template #empty>
          <div class="empty">
            <svg-icon name="empty" width="110px" height="110px" />
          </div>
        </template>
        <Column selectionMode="multiple" style="width: 3rem" frozen :exportable="false"></Column>
        <Column field="id" header="编号" sortable frozen style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column header="用户名" sortable field="username" style="min-width: 10rem">
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
            <ToggleSwitch @change="handleChangeStatus(data.id)" v-model="data.checked" />
          </template>
        </Column>
        <Column field="createTime" sortable header="创建时间" style="min-width: 15rem">
          <template #body="{ data }">
            {{ data.createTime }}
          </template>
        </Column>
        <Column header="操作" style="min-width: 12rem" frozen>
          <template #body="{ data }">
            <ConfirmPopup></ConfirmPopup>
            <div>
              <Button v-permission="`permission:user:update`" icon="pi pi-pencil" outlined rounded />
              <Button v-permission="`permission:user:delete`" @click="confirmDeleteUser(data.id)" icon="pi pi-trash"
                outlined rounded severity="danger" style="margin: 0 10px;" />
              <Button v-permission="`permission:user:more`" icon="pi  pi-ellipsis-h"
                @click="moreToggle($event, data.id)" outlined rounded severity="info" />
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
      </DataTable>

      <!-- 分页 -->
      <Paginator @page="handlePaginationChange" :rows="pageSize" :totalRecords="total"
        :rowsPerPageOptions="[10, 20, 30, 40]">
      </Paginator>
    </template>
  </Card>

  <!-- 新增、修改用户弹框 -->
  <Dialog v-model:visible="addOrEditUserDialog" :style="{ width: '360px' }" :modal="true">
    <template #closeicon>
      <i class="pi pi-times" @click="cancelDelete"></i>
    </template>
    <template #header>
      <div class="form-header">
        <span>新增用户</span>
      </div>
    </template>
    <div class="form-body">
      <div>
        <label>用户名</label>
        <InputText v-model="user.username" />
        <small v-if="validate.username" id="small-help">{{ validate.username }}</small>
      </div>
      <div>
        <label for="password">密码</label>
        <Password promptLabel="密码强度" weakLabel="轻" mediumLabel="中" strongLabel="强" v-model="user.password"
          inputId="password" />
        <small v-if="validate.password" id="small-help">{{ validate.password }}</small>
      </div>
      <div>
        <label for="phone">手机号</label>
        <InputText id="phone" v-model="user.phone" />
        <small v-if="validate.phone" id="small-help">{{ validate.phone }}</small>
      </div>
      <div>
        <label for="email">邮箱</label>
        <InputText id="email" v-model="user.email" />
        <small v-if="validate.email" id="small-help">{{ validate.email }}</small>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button label="确认" severity="success" icon="pi pi-check" @click="handlerAddOrEditUser" />
      </div>
    </template>
  </Dialog>

  <!-- 批量删除用户弹框 -->
  <Dialog :closable="false" v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="用户删除" :modal="true">
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除用户数据 ? </span>
    </div>
    <template #footer>
      <Button label="取消" outlined size="small" icon="pi pi-times" text @click="cancelDelete" />
      <Button label="确认" severity="danger" outlined size="small" icon="pi pi-check" text @click="handlerBatchDelete" />
    </template>
  </Dialog>

  <!-- 删除用户弹框 -->
  <Dialog :closable="false" v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="用户删除" :modal="true">
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除用户数据 ? </span>
    </div>
    <template #footer>
      <Button label="取消" outlined size="small" icon="pi pi-times" text @click="cancelDelete" />
      <Button label="确认" severity="danger" outlined size="small" icon="pi pi-check" text @click="handlerDelete" />
    </template>
  </Dialog>

  <!-- 重置密码 -->
  <Dialog :closable="false" v-model:visible="resetPwdDialog" :style="{ width: '450px' }" header="重置密码" :modal="true">
    <div style="display: flex;justify-content: center;align-items: center">
      <FloatLabel>
        <Password promptLabel="密码强度" weakLabel="轻" mediumLabel="中" strongLabel="强" v-model="resetUserObj.password"
          toggleMask inputId="password" />
        <label for="password">密码</label>
      </FloatLabel>
    </div>
    <template #footer>
      <Button label="取消" severity="info" outlined size="small" icon="pi pi-times" text @click="cancelDelete" />
      <Button label="确认" severity="success" outlined size="small" icon="pi pi-check" text @click="handleResetPwd" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { findUserList, batchDelete, deleteUser, updateUserStatus, resetPwd, register } from "@/api/user";
import { USER_CONSTANT } from "@/constant/dictType.js";
import { queryDictLabel } from "@/api/dict_data";
import { toast } from 'vue3-toastify';

const statusData = ref([]);
const menu = ref(null);
const moreMenu = ref(null);
const loading = ref(true);
const tableData = ref([]);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchUser = ref({
  username: '',
  phone: '',
  status: null
});
const saveLoading = ref(false);
const optionItems = ref([
  {
    label: '新增',
    icon: 'pi pi-plus',
    command: () => {
      addOrEditUserDialog.value = true;
    }
  },
  {
    label: '导入',
    icon: 'pi pi-file-import'
  },
  {
    label: '导出',
    icon: 'pi pi-file-export'
  },
]);
const moreItems = ref([
  {
    label: '重置密码',
    icon: 'pi pi-lock'
  },
  {
    label: '分配角色',
    icon: 'pi pi-key'
  },
]);
const selecteds = ref([]);
const deleteUsersDialog = ref(false);
const deleteUserDialog = ref(false);
const resetPwdDialog = ref(false);
const addOrEditUserDialog = ref(false);
const userId = ref(null);
const resetUserObj = ref(
  {
    id: null,
    password: ''
  }
);
const user = ref({
  id: null,
  username: '',
  password: '',
  phone: '',
  email: ''
});
const validate = ref({
  username: '',
  phone: '',
  email: '',
  password: ''
});


onMounted(() => {
  getUserList();
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

//监听分页变化
const handlePaginationChange = (event) => {
  pageNo.value = event.page + 1;
  pageSize.value = event.rows;
  getUserList();
}

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(USER_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  })
}

//重置
const handleReset = () => {
  searchUser.value = {
    username: '',
    phone: '',
    status: null
  }
  getUserList();
}

//查询
const handleSearch = () => {
  if ((searchUser.value.username !== "") || (searchUser.value.phone !== "") || (searchUser.value.status !== null)) {
    saveLoading.value = true;
    getUserList();
    saveLoading.value = false;
  }
}

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

const moreToggle = (event, id) => {
  resetUserObj.value.id = id;
  moreMenu.value.toggle(event);
};

//更多操作（重置密码、分配角色）
const handlerMoreOption = (item) => {
  if (item.label === '重置密码') {
    resetPwdDialog.value = true;
  } else if (item.label === '分配角色') {
    console.log("分配角色");
  }
}

//重置密码
const handleResetPwd = () => {
  resetPwd(resetUserObj.value).then((res) => {
    if (res.code === 200) {
      toast.success("密码重置成功！");
      resetPwdDialog.value = false;
      resetUserObj.value.id = null;
      resetUserObj.value.password = '';
    }
  })
}

//新增、修改用户
const handlerAddOrEditUser = () => {
  user.value.username = user.value.username.trim();
  user.value.phone = user.value.phone.trim();
  user.value.email = user.value.email.trim();
  user.value.password = user.value.password.trim();
  register(user.value).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      addOrEditUserDialog.value = false;
      getUserList();
    } else {
      if (res.data !== null) {
        validate.value = res.data;
      }
    }
  })
}

//修改用户状态
const handleChangeStatus = (id) => {
  updateUserStatus(id).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
    }
  })
}

const deleteDialog = () => {
  deleteUsersDialog.value = true;
}

// 批量删除用户
const handlerBatchDelete = () => {
  if (selecteds.value.length > 0) {
    //过滤出用户id
    const userIdList = selecteds.value.map((item) => item.id);
    batchDelete(userIdList).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getUserList();
        deleteUsersDialog.value = false;
      }
    })
  }
}
const cancelDalog = () => {
  deleteUsersDialog.value = false;
  deleteUserDialog.value = false;
  resetPwdDialog.value = false;
  addOrEditUserDialog.value = false;
}

const handlerSetValue = () => {
  user.value.id = null
  user.value.username = '';
  user.value.password = '';
  user.value.phone = '';
  user.value.email = '';
  resetUserObj.value.id = null;
  resetUserObj.value.password = '';
  validate.value.username = '';
  validate.value.password = '';
  validate.value.phone = '';
  validate.value.email = '';
}
//取消删除用户
const cancelDelete = () => {
  cancelDalog();
  handlerSetValue();
}

//删除用户
const confirmDeleteUser = (id) => {
  deleteUserDialog.value = true;
  userId.value = id;
}

const handlerDelete = () => {
  deleteUser(userId.value).then((res) => {
    if (res.code === 200) {
      toast.success("删除成功！");
      getUserList();
      deleteUserDialog.value = false;
    }
  })
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
  height: 33px;
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
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.form-header span {
  font-size: 1.2rem;
}

.form-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.form-body div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-body input {
  width: 250px;
}

:deep(.p-inputtext) {
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
  margin: 10px 0 10px 0;
}

#small-help{
  color: red;
  font-size: 12px;
}
</style>
