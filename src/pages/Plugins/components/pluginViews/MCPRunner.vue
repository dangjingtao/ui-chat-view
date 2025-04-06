<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div class="mb-3">
        <div class="flex gap-2">
          <x-input class="flex-1" v-model="url" :disabled="true" />
          <x-button @click="checkState" type="base" size="small"
            ><i-mdi-connection
          /></x-button>
        </div>
      </div>
      <x-list class="h-137" title="MCP 集成" :items="mcpServersList">
        <template #item="{ item, selected }">
          <div
            class="flex cursor-pointer border-gray-200 text-sm leading-tight text-gray-700 dark:border-gray-300"
          >
            <div class="flex-1">{{ item.name }}</div>
            <div class="flex w-[90px] gap-1">
              <x-button
                size="small"
                @click="() => openDetailModal(item)"
                type="text"
                >编辑</x-button
              >
              <x-button
                size="small"
                @click="() => deleteMCPServer(item)"
                :type="'danger'"
                >删除</x-button
              >
            </div>
          </div>
        </template>
      </x-list>
    </template>
    <template #pluginConsoleOperation>
      <x-button class="w-full" type="primarily" @click="() => (visible = true)"
        >添加MCP服务器</x-button
      >
    </template>

    <template #pluginDebugger>
      <x-textarea
        v-model="prompt"
        placeholder="需要我帮什么忙？(ctrl + enter发送)"
        @keydown.enter="handleKeyDown"
        :rows="5"
        class="rounded-2xl"
      />
      <x-robot class="mt-10" :inputting="typing" :message="result" />
    </template>
  </plugin-page-wrapper>

  <!-- addMCP -->
  <x-dialog :visible="visible" @confirm="addMCP" @cancel="clearFormValue">
    <template #header>添加MCP服务器</template>
    <template #body>
      <x-input
        v-model="formValue.name"
        class="mb-4 w-full"
        placeholder="名称"
      />

      <x-model-select
        placeHolder="命令"
        v-model="formValue.command"
        class="mb-4 w-full max-w-full"
        :options="commandOptions"
      />

      <x-textarea
        v-model="formValue.description"
        class="mb-3"
        :rows="5"
        placeholder="描述"
      />
      <x-textarea v-model="formValue.args" :rows="5" placeholder="参数" />
    </template>
  </x-dialog>

  <!-- detailModel -->
  <x-dialog
    @confirm="confirmDetailModel"
    @cancel="cancelDetailModel"
    :visible="detailModelVisible"
  >
    <template #header>{{ currentMCPServer?.name }}</template>
    <template #body>
      <div class="mb-5">
        <div class="flex items-center">
          <div class="text-md mb-2 leading-8 text-gray-700">健康检查</div>
          <x-button
            @click="checkPackageState"
            type="base"
            size="small"
            class="ml-auto"
          >
            检查
          </x-button>
        </div>
        <x-message type="warning"> 需要验证本地安装状态 </x-message>
        <!-- <x-progress /> -->
      </div>
      <x-input
        v-model="currentMCPServer.command"
        class="mb-4 w-full"
        :disabled="true"
        placeholder="命令"
      />

      <x-textarea
        v-model="currentMCPServer.description"
        class="mb-3"
        :rows="5"
        placeholder="描述"
      />
      <x-textarea
        v-model="currentMCPServer.args"
        :rows="5"
        placeholder="参数"
      />
    </template>
  </x-dialog>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import request from "@/lib/request";
import cachePlugin from "@/plugins/cachePlugin";
import _ from "lodash";
import message from "@/lib/message";

const { t } = useNamespace("PluginsViews.MCPRunner");
const route = useRoute();

const commandOptions = [
  {
    id: "npx",
    name: "npx",
  },
  { id: "node", name: "node" },
];

const visible = ref(false);
const defaultFormValue = {
  name: "@executeautomation/playwright-mcp-server",
  command: "",
  description: "浏览器自动化工具",
  args: "-y\n@executeautomation/playwright-mcp-server",
};

const deleteMCPServer = async (item) => {
  const { id } = item;
  await cachePlugin.deleteMCPServer(id);
  message.success("删除成功");
  getMCPServer();
};

// 详情弹窗
const currentMCPServer = ref({});
const detailModelVisible = ref(false);
const openDetailModal = (item) => {
  currentMCPServer.value = { ...item };
  detailModelVisible.value = true;
};
const cancelDetailModel = () => {
  detailModelVisible.value = false;
  currentMCPServer.value = {};
};
const confirmDetailModel = async () => {
  const id = currentMCPServer.value?.id;
  await cachePlugin.updateMCPServer(id, { ...currentMCPServer.value });
  message.success("更新成功");
  getMCPServer();
  cancelDetailModel();
};
// 检查本地安装状态
const checkPackageState = async () => {
  const { data, status } = await request({
    url: `http://127.0.0.1:8462/api/mcp/checkPackage`,
    method: "POST",
    data: {
      packageName: currentMCPServer.value.name,
    },
  });
  if (data.result) {
    message.success("安装成功");
  }
  // console.log("checkPackageState", data);
};

// 添加MCP
const formValue = ref(_.cloneDeep(defaultFormValue));

const url = ref("http://127.0.0.1:8462");

const prompt = ref("打开url https://www.landchina.com/#/resultNotice");
const webLoading = ref(false);

const clearFormValue = async () => {
  formValue.value = _.cloneDeep(defaultFormValue);
  visible.value = false;
};

const mcpServersList = ref([]);

const getMCPServer = async () => {
  const mcpServers = await cachePlugin.getMCPServers();
  console.log("getMCPServer", mcpServers);
  mcpServersList.value = mcpServers;
};

const createMCPServer = async (mcpServer) => {
  console.log("createMCPServer", mcpServer);
  await cachePlugin.addMCPServer(mcpServer);
  getMCPServer();
};

const addMCP = async () => {
  console.log("addMCP", formValue.value);
  await createMCPServer({ ...formValue.value });
  clearFormValue();
};

const checkState = async () => {
  const { data, status } = await request({
    url: `${url.value}/api/mcp/status`,
    method: "GET",
  });
  if (status === 200) {
    message.success(data?.status);
    getMCPServer();
  } else {
    message.error("MCP Client connection was blocked");
  }
};

microChat.useConfig({
  pluginId: route.params.id,
  client: "default",
  memory: 20,
  systemMessageTemplate: (p) =>
    `你是一个会调用工具的智能助手，请使用提供的工具帮用户解决问题。`,
  userMessageTemplate: ({ content }) =>
    `用 MCPTestTool 帮我执行（或搜索） ${content} `,
  advanceOptions: {
    maxTokens: 8192,
    temperature: 0,
  },
  tools: [
    {
      name: "MCPTestTool",
      version: "1.0.0",
      props: {
        onCreated: () => {
          webLoading.value = true;
        },
        onSuccess: (data) => {
          console.log("web browser success", data);
          const { context } = data;
          webLoading.value = false;
        },
        onFailed: (error) => {
          console.error("web browser failed", error);
          webLoading.value = false;
        },
      },
    },
  ],
  onError: (error) => {
    console.error(error);
  },
});

const result = ref("你要来一发吗？");
const typing = ref(false);
const onSend = async (prompt: string) => {
  console.log("onSend", prompt);
  typing.value = true;
  const res = await microChat.invoke({
    content: prompt,
  });
  typing.value = false;
  result.value = res.result;
  console.log(res);
};

const handleKeyDown = async (event: KeyboardEvent) => {
  if (
    (event.ctrlKey && event.key === "Enter") ||
    (event.metaKey && event.key === "Enter")
  ) {
    onSend(prompt.value);
    prompt.value = "";
  }
};
</script>

<style>
/* 你可以在这里添加自定义样式 */
</style>
