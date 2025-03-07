<template>
  <x-dialog
    @confirm="confirm"
    :visible="props.isEditModalOpen"
    @update:visible="updateVisible"
    @cancel="cancel"
  >
    <template #header>{{ dialogTitle }}</template>
    <template #body>
      <x-form :model="formData" ref="formRef">
        <x-formItem name="knowledgeBaseName" label="知识库名称">
          <x-input v-model="formData.knowledgeBaseName" />
        </x-formItem>
        <x-formItem name="knowledgeBaseDescription" label="知识库描述">
          <x-textarea
            :rows="6"
            v-model="formData.knowledgeBaseDescription"
            placeholder="详细的描述可以让AI更快访问数据集的内容"
          />
        </x-formItem>
      </x-form>
    </template>
  </x-dialog>
</template>

<script setup lang="ts">
import message from "@/lib/message";
import { shallowRef, computed, watch, ref, toRaw } from "vue";
import _ from "lodash";

const formRef = shallowRef(null);

const props = defineProps<{
  isEditModalOpen: boolean;
  operateMode: null | string;
  defaultFormData: null | Record<string, any>;
}>();

const formData = ref(
  props.defaultFormData || {
    knowledgeBaseName: "",
    knowledgeBaseDescription: "",
  },
);

const dialogTitle = computed(() =>
  props.operateMode === "add" ? "创建知识库" : "编辑知识库",
);

const emit = defineEmits(["confirm", "updateVisible"]);

const initializeFormData = (defaultFormData) => {
  formData.value = defaultFormData || {
    knowledgeBaseName: "",
    knowledgeBaseDescription: "",
  };
};

const validate = () => {
  for (const [name, value] of Object.entries(formData.value)) {
    if (!value) {
      return {
        field: name,
        result: false,
      };
    }
  }
  return {
    field: null,
    result: true,
  };
};

// 不要从外面调用所谓的updateVisible
const updateVisible = (bool) => {
  emit("updateVisible", bool);
  if (!bool) {
    console.log("关闭");
    initializeFormData(null);
  }
};

const beforeConfirm = () => {
  const { result, field } = validate();
  if (!result) {
    message.error(`${field} 不得为空`);
  }

  return result;
};

const confirm = () => {
  const result = beforeConfirm();
  if (result) {
    emit("confirm", {
      _mode: props.operateMode,
      formData: _.cloneDeep(toRaw(formData.value)),
    });
    updateVisible(false);
  }
};

const cancel = () => {
  emit("updateVisible", false);
};

watch(
  () => props.defaultFormData,
  (val) => {
    console.log("更新");
    initializeFormData(val);
  },
);
</script>
