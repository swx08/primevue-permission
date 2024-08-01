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
                    id="name"
                    v-model="searchDict.name"
                  />
                  <label for="username">字典名称</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchDict.type"
                    inputId="dd-city"
                    :options="typeData"
                    optionLabel="label"
                    optionValue="value"
                  />
                  <label for="type">字典类型</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchDict.status"
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
                  @click="confirmDeleteDict"
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
          style="min-width: 6rem"
        >
        </Column>
        <Column
          header="字典名称"
          sortable
          field="name"
          style="min-width: 12rem"
        >
        </Column>
        <Column
          header="字典类型"
          field="type"
          sortable
          style="min-width: 15rem"
        >
          <template #body="{ data }">
            <Button text link :label="data.type" @click="handlerToData(data)" />
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
        <Column field="remark" sortable header="备注" style="min-width: 15rem">
        </Column>
        <Column
          field="createTime"
          sortable
          header="创建时间"
          style="min-width: 15rem"
        >
        </Column>
        <Column
          header="操作"
          style="min-width: 12rem"
          frozen
          alignFrozen="right"
        >
          <template #body="{ data }">
            <div>
              <Button
                @click="handleEchoDict(data.id)"
                v-permission="`permission:role:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                style="margin: 0 10px"
                severity="info"
              />
              <Button
                v-permission="`permission:role:delete`"
                @click="confirmDeleteDict(data.id)"
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

  <!-- 新增、修改字典弹框 -->
  <Dialog
    v-model:visible="addOrEditDictDialog"
    :style="{ width: '380px' }"
    :modal="true"
    :closable="false"
  >
    <template #header>
      <div class="form-header">
        <div class="header">
          <span>{{ dict.id === undefined ? "新增字典" : "修改字典" }}</span>
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
        <label>字典名称</label>
        <InputText
          verify="required"
          placeholder="字典名称"
          v-model="dict.name"
        />
      </div>
      <div class="form-row">
        <label>字典类型</label>
        <InputText
          verify="required"
          placeholder="字典类型"
          v-model="dict.type"
        />
      </div>
      <div class="form-row">
        <label>备注</label>
        <Textarea
          verify="required"
          placeholder="备注"
          v-model="dict.remark"
          autoResize
          rows="5"
          cols="30"
        />
      </div>
    </div>
    <template #footer>
      <div class="add-footer">
        <Button
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handlerAddOrEditDict"
        />
      </div>
    </template>
  </Dialog>

  <!-- 删除字典弹框 -->
  <Dialog
    :closable="false"
    v-model:visible="deleteDictDialog"
    :style="{ width: '380px' }"
    header="删除字典"
    :modal="true"
  >
    <div>
      <i class="pi pi-exclamation-triangle icon" />
      <span>您确认要删除字典数据 ? </span>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { queryDictLabel } from "@/api/dict_data";
import { DICT_TYPE_CONSTANT } from "@/constant/dictType.js";
import { toast } from "vue3-toastify";
import { create_verify } from "vue-best-verify";
import {
  addDictType,
  findDictList,
  queryAllTypeData,
  updateDictStatus,
  removeDict,
  echoDict,
  updateDict,
  batchDelete,
} from "@/api/dict";
import router from "@/router";

//表单校验
const verify = create_verify({
  border_hint: false,
});
const typeData = ref([]);
const statusData = ref([]);
const menu = ref(null);
const loading = ref(true);
const tableData = ref([]);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchDict = ref({
  name: "",
  type: "",
  status: null,
});
const saveLoading = ref(false);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
      addOrEditDictDialog.value = true;
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
const addOrEditDictDialog = ref(false);
const deleteDictDialog = ref(false);

const dict = ref({});
const deleteDictId = ref(null);

onMounted(() => {
  getDictList();
  getDictType();
  getDictTypeStatus();
});

//获取字典类型分页数据
const getDictList = () => {
  findDictList(pageNo.value, pageSize.value, searchDict.value).then((res) => {
    if (res.code === 200 && res.data !== null) {
      tableData.value = res.data.data;
      total.value = res.data.total;
      loading.value = false;
    } else {
      loading.value = false;
      tableData.value = [];
    }
  });
};

//监听分页变化
const handlePaginationChange = (event) => {
  pageNo.value = event.page + 1;
  pageSize.value = event.rows;
  getDictList();
};

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(DICT_TYPE_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  });
};

//查询字段类型数据
const getDictType = () => {
  queryAllTypeData().then((res) => {
    if (res.code === 200) {
      res.data.forEach((item) => {
        typeData.value.push({
          label: item,
          value: item,
        });
      });
    }
  });
};

//重置
const handleReset = () => {
  searchDict.value = {
    name: "",
    type: "",
    status: null,
  };
  getDictList();
};

//查询
const handleSearch = () => {
  if (
    searchDict.value.name !== "" ||
    searchDict.value.type !== "" ||
    searchDict.value.status !== null
  ) {
    getDictList();
  }
};

//新增、修改字段
const handlerAddOrEditDict = () => {
  if (verify.do_verify()) {
    if (dict.value.id === undefined) {
      handlerAdd();
    } else {
      handlerEdit();
    }
  }
};

//新增
const handlerAdd = () => {
  addDictType(dict.value).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      getDictList();
      addOrEditDictDialog.value = false;
      dict.value = {};
    }
  });
};

//修改
const handlerEdit = () => {
  updateDict(dict.value).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      getDictList();
      addOrEditDictDialog.value = false;
      dict.value = {};
    }
  });
};

//修改字典状态
const handleChangeStatus = (id) => {
  updateDictStatus(id).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      getDictList();
    }
  });
};

//数据回显
const handleEchoDict = (id) => {
  echoDict(id).then((res) => {
    if (res.code === 200) {
      dict.value = res.data;
      addOrEditDictDialog.value = true;
    }
  });
};

//删除字典数据确认
const confirmDeleteDict = (id) => {
  deleteDictDialog.value = true;
  deleteDictId.value = id;
};

//删除字典数据
const handlerDelete = () => {
  if (selecteds.value.length > 0) {
    //批量删除
    const dictIdList = selecteds.value.map((item) => item.id);
    batchDelete(dictIdList).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getDictList();
        deleteDictDialog.value = false;
        selecteds.value = [];
      }
    });
  } else {
    removeDict(deleteDictId.value).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getDictList();
        deleteDictDialog.value = false;
        deleteDictId.value = null;
      }
    });
  }
};

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

const handlerCancelDialog = () => {
  addOrEditDictDialog.value = false;
  deleteDictDialog.value = false;
};

const handlerSetValue = () => {
  dict.value = {};
  deleteRoleId.value = null;
};

const handlerCancel = () => {
  handlerCancelDialog();
  handlerSetValue();
};

//跳转到字典数据
const handlerToData = (data) => {
  router.push({ name: "DictData", query: { id: data.id, type: data.type } });
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

:deep(.p-textarea) {
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
  display: flex;
  justify-content: space-between;
}

.add-footer {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.add-footer button {
  width: 250px;
  margin-bottom: 20px;
}
</style>
