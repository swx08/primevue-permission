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
                  <InputText class="input" v-model="searchDictData.type" />
                  <label for="username">字典类型</label>
                </FloatLabel>
                <FloatLabel>
                  <InputText class="input" v-model="searchDictData.label" />
                  <label for="type">字典标签</label>
                </FloatLabel>
                <FloatLabel>
                  <Select
                    class="input"
                    v-model="searchDictData.status"
                    :options="statusData"
                    optionLabel="label"
                    optionValue="value"
                  />
                  <label for="dd-city">字典状态</label>
                </FloatLabel>
              </div>
              <div class="panel-right">
                <Button
                  @click="handleSearch"
                  v-permission="`system:dict_data:query`"
                  label="查询"
                  outlined
                  size="small"
                  icon="pi pi-search"
                  severity="success"
                  :loading="saveLoading"
                />
                <Button
                  @click="handleReset"
                  v-permission="`system:dict_data:reset`"
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
                  v-permission="`system:dict_data:delete`"
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
          header="字典类型"
          sortable
          field="type"
          style="min-width: 15rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.type"></Tag>
          </template>
        </Column>
        <Column
          header="字典标签"
          field="label"
          sortable
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <Tag
              :severity="data.label === '正常' ? 'success' : 'danger'"
              :value="data.label"
              rounded
            ></Tag>
          </template>
        </Column>
        <Column
          header="字典键值"
          field="value"
          sortable
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <Tag severity="info" :value="data.value"></Tag>
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
        <Column field="remark" sortable header="备注" style="min-width: 15rem">
          <template #body="{ data }">
            <Tag severity="info" :value="data.remark"></Tag>
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
        <Column
          header="操作"
          style="min-width: 10rem"
          frozen
          alignFrozen="right"
        >
          <template #body="{ data }">
            <div>
              <Button
                @click="handleEchoDict(data.id)"
                v-permission="`system:dict_data:update`"
                icon="pi pi-pencil"
                outlined
                rounded
                style="margin: 0 10px"
                severity="info"
              />
              <Button
                v-permission="`system:dict_data:delete`"
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

  <!-- 新增、修改字典数据弹框 -->
  <Dialog
    v-model:visible="addOrEditDictDataDialog"
    :style="{ width: '40%' }"
    :modal="true"
    @hide="handlerCancel"
    :header="dictData.id === undefined ? '新增字典数据' : '修改字典数据'"
  >
    <div class="form-container" v-verify="verify">
      <div class="form-group">
        <label class="form-label">字典类型</label>
        <InputText
          verify="required"
          placeholder="字典类型"
          v-model="dictData.type"
          disabled
        />
      </div>
      <div class="form-group">
        <label class="form-label">字典标签</label>
        <InputText
          verify="required"
          placeholder="字典标签"
          v-model="dictData.label"
        />
      </div>
      <div class="form-group">
        <label class="form-label">字典键值</label>
        <InputNumber
          v-model="dictData.value"
          verify="required"
          placeholder="字典键值"
        />
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <Textarea
          verify="required"
          placeholder="备注"
          v-model="dictData.remark"
          autoResize
          rows="5"
          cols="30"
        />
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <Button
          label="确认"
          severity="success"
          icon="pi pi-check"
          @click="handlerAddOrEditDictData"
          size="small"
          outlined
        />
        <Button
          label="取消"
          severity="warn"
          icon="pi pi-times"
          @click="handlerCancel"
          size="small"
          outlined
        />
      </div>
    </template>
  </Dialog>

  <!-- 删除字典字典数据弹框 -->
  <Dialog
    :closable="false"
    v-model:visible="deleteDictDataDialog"
    :style="{ width: '380px' }"
    header="删除字典数据"
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
import { DICT_DATA_CONSTANT } from "@/constant/dictType.js";
import { toast } from "vue3-toastify";
import { create_verify } from "vue-best-verify";
import {
  addDictData,
  updateDict,
  findDictList,
  updateDictStatus,
  removeDict,
  echoDict,
  queryDictLabel,
  batchDelete,
} from "@/api/dict_data";
import { useRoute } from "vue-router";

const route = useRoute();
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
const searchDictData = ref({
  type: "",
  label: "",
  status: null,
});
searchDictData.value.type = route.query.type;
const saveLoading = ref(false);
const optionItems = ref([
  {
    label: "新增",
    icon: "pi pi-plus",
    command: () => {
      dictData.value.type = route.query.type;
      addOrEditDictDataDialog.value = true;
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
const addOrEditDictDataDialog = ref(false);
const deleteDictDataDialog = ref(false);

const dictData = ref({});
const deleteDictDataId = ref(null);

onMounted(() => {
  getDictDataList();
  getDictTypeStatus();
});

//获取字典类型分页数据
const getDictDataList = () => {
  findDictList(pageNo.value, pageSize.value, searchDictData.value).then(
    (res) => {
      if (res.code === 200 && res.data !== null) {
        tableData.value = res.data.data;
        total.value = res.data.total;
        loading.value = false;
      } else {
        loading.value = false;
        tableData.value = [];
      }
    }
  );
};

//监听分页变化
const handlePaginationChange = (event) => {
  pageNo.value = event.page + 1;
  pageSize.value = event.rows;
  getDictDataList();
};

//查询字典状态
const getDictTypeStatus = () => {
  queryDictLabel(DICT_DATA_CONSTANT).then((res) => {
    if (res.code === 200) {
      statusData.value = res.data;
    }
  });
};

//重置
const handleReset = () => {
  searchDictData.value = {
    type: "",
    label: "",
    status: null,
  };
  getDictDataList();
};

//查询
const handleSearch = () => {
  if (
    searchDictData.value.label !== "" ||
    searchDictData.value.type !== "" ||
    searchDictData.value.status !== null
  ) {
    getDictDataList();
  }
};

//新增、修改字段数据
const handlerAddOrEditDictData = () => {
  if (verify.do_verify()) {
    if (dictData.value.id === undefined) {
      handlerAdd();
    } else {
      handlerEdit();
    }
  }
};

//新增
const handlerAdd = () => {
  addDictData(dictData.value).then((res) => {
    if (res.code === 200) {
      toast.success("新增成功！");
      addOrEditDictDataDialog.value = false;
      getDictDataList();
      dictData.value = {};
    }
  });
};

//修改
const handlerEdit = () => {
  updateDict(dictData.value).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      getDictDataList();
      addOrEditDictDataDialog.value = false;
      dictData.value = {};
    }
  });
};

//修改字典状态
const handleChangeStatus = (id) => {
  updateDictStatus(id).then((res) => {
    if (res.code === 200) {
      toast.success("修改成功！");
      getDictDataList();
    }
  });
};

//修改字典数据回显
const handleEchoDict = (id) => {
  echoDict(id).then((res) => {
    if (res.code === 200) {
      dictData.value = res.data;
      addOrEditDictDataDialog.value = true;
    }
  });
};

//删除字典数据确认
const confirmDeleteDict = (id) => {
  deleteDictDataDialog.value = true;
  deleteDictDataId.value = id;
};

//删除字典数据
const handlerDelete = () => {
  if (selecteds.value.length > 0) {
    //批量删除
    const dictIdList = selecteds.value.map((item) => item.id);
    batchDelete(dictIdList).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        getDictDataList();
        deleteDictDataDialog.value = false;
        selecteds.value = [];
      }
    });
  } else {
    removeDict(deleteDictDataId.value).then((res) => {
      if (res.code === 200) {
        toast.success("删除成功！");
        deleteDictDataDialog.value = false;
        getDictDataList();
      }
    });
  }
};

//添加菜单数据
const toggle = (event) => {
  menu.value.toggle(event);
};

const handlerCancelDialog = () => {
  addOrEditDictDataDialog.value = false;
  deleteDictDataDialog.value = false;
};

const handlerSetValue = () => {
  dictData.value = {};
  deleteDictDataId.value = null;
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

:deep(.p-textarea) {
  width: 250px;
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>