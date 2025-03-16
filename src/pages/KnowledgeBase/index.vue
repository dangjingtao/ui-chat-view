<template>
  <x-subpage-wrapper title="知识库详情">
    <template #content>
      <div class="flex h-full flex-col">
        <div class="min-h-[50px] w-full p-1 shadow">
          <div class="flex flex-col sm:flex-row">
            <div class="flex flex-col sm:flex-row">
              <h3
                class="flex gap-3 text-lg font-bold sm:mr-5 sm:min-w-[40px] sm:leading-12"
              >
                {{
                  knowledgeBaseStore.detailMeta?.knowledgeBaseName ||
                  "知识库文档"
                }}
                <x-tooltip
                  class="mt-1 block md:mt-3.5"
                  text="知识库的所有文件都在这里显示，整个知识库都可以链接到 UI Chat
                引用。"
                  ><i-mdi-help-circle-outline
                /></x-tooltip>
              </h3>
            </div>

            <div class="ml-auto flex w-full gap-2 sm:w-auto">
              <x-button class="relative mt-1.5 h-8 w-12"
                ><x-upload
                  @success="onUploadSuccess"
                  @failed="onUploadFailed"
                  @upload="onUpload"
                ></x-upload>
                <div class="absolute top-1.5 left-2.5">上传</div>
              </x-button>

              <!-- <x-button class="mt-1.5 h-8">上传</x-button> -->
              <div class="flex-1">
                <x-input class="mt-1.5 w-full sm:w-auto" type="search" />
              </div>
            </div>
          </div>
          <div class="h-3 sm:h-1"></div>
        </div>
        <div class="flex-1 overflow-auto">
          <x-table
            selectable
            :data="knowledgeBaseStore.detailDocumentList"
            :columns="columns"
            @batchUpgrade="batchUpgrade"
          />
        </div>
      </div>
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
import { useKnowledgeBaseStore } from "@/store/KnowledgeHub";
import _ from "lodash";
import XTableCellRender from "@/components/XTableCellRender.vue";
import dayjs from "dayjs";

const knowledgeBaseStore = useKnowledgeBaseStore();

const {
  initKnowledgeBasePage,
  onUploadSuccess,
  onUploadFailed,
  onUpload,
  batchUpgrade,
} = knowledgeBaseStore.$service;
// detailMeta,
//     detailDocumentList,
initKnowledgeBasePage().then(() => {
  console.log(knowledgeBaseStore.detailDocumentList);
});

XTableCellRender.renderer = (x, y) => {
  const { column, row, content } = x;
  if (column.key === "createTime") {
    return dayjs(content).format("YYYY-MM-DD HH:mm:ss");
  }
  if (column.key === "fileSize") {
    return `${Math.ceil((content / 1000 / 1000) * 100) / 100} MB`;
  }
  if (column.key === "status") {
    const statusMap = {
      enable: "已启用",
      disable: "已禁用",
    };
    return statusMap[content];
  }
};

const columns = [
  {
    title: "名称",
    key: "fileName",
    width: 150,
    fixed: true,
  },
  {
    title: "类型",
    key: "fileType",
    width: 250,
  },
  {
    title: "大小",
    key: "fileSize",
    width: 150,
    render: XTableCellRender,
  },
  {
    title: "上传时间",
    key: "createTime",
    width: 300,
    render: XTableCellRender,
  },
  {
    title: "状态",
    key: "status",
    width: 200,
    render: XTableCellRender,
  },
];
</script>
