<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div class="mb-3 flex gap-2">
        <x-button
          :disabled="loading"
          class="flex w-full items-center justify-center gap-1"
          @click="checkState"
          type="base"
          ><i-mdi-connection />&nbsp;{{ t("checkState") }}</x-button
        >
      </div>
      <div
        class="mb-3 flex h-26 w-full items-center justify-center rounded-md border border-gray-200 bg-white p-3"
      >
        <div v-if="workspaceInfo.id" class="flex h-full w-full gap-3">
          <img :src="workspaceInfo.avatar_url" alt="notion" class="h-20 w-20" />
          <div class="flex-1">
            <div class="ml-2 text-xl leading-6 font-semibold text-gray-700">
              Bot: {{ workspaceInfo.name }}
            </div>
            <div class="text-md ml-2 leading-6 text-gray-400">
              Work Space:&nbsp;{{ workspaceInfo.workspace_name }}
            </div>
            <div class="text-primary ml-2 text-sm leading-6">
              UIChat 已成功配置到 Notion！
            </div>
          </div>
        </div>
        <x-spin v-else-if="!workspaceInfo.id && loading" />
        <x-result v-else class="w-[30%]" type="404" />
      </div>

      <div class="w-full">
        <x-input
          :disabled="loading || !workspaceInfo.id"
          v-model="testArticleTitle"
          class="mb-3 w-full"
          placeholder="给Notion发送一段测试知识"
        />
        <x-textarea
          :disabled="loading || !workspaceInfo.id"
          class="h-full"
          :rows="28"
          v-model="articleContent"
          placeholder="给Notion发送一段测试知识"
        />
      </div>
    </template>
    <template #pluginConsoleOperation>
      <x-button
        :disabled="loading || !workspaceInfo.id"
        @click="execute"
        class="w-full"
        >创建一个新的Notion Page</x-button
      >
    </template>

    <template #pluginDebugger>
      <div class="flex h-full w-full flex-col gap-0">
        <x-list
          :title="'Page列表'"
          @select="onSelectPage"
          :items="pageList"
          :class="{
            'h-[25%]': !!pageContent,
            'h-full': !pageContent,
          }"
          class="mb-3 w-full"
        />

        <div
          :class="{
            'flex-1 p-10': !!pageContent,
            'h-0': !pageContent,
          }"
          class="w-full max-w-full overflow-auto rounded-md border border-gray-300 transition-all duration-300 ease-in-out"
        >
          <x-markdown class="max-w-[790px]" :content="pageContent" />
        </div>
      </div>
    </template>
  </plugin-page-wrapper>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import copy from "@/lib/textProcessor/copy";
import { useNamespace } from "@/i18n";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import request from "@/lib/request";
import dayjs from "dayjs";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";
import testArticle from "../../asset/honey.md?raw";
import {
  getBot,
  retrieveDataBase,
  getPage,
  createPageWithContent,
} from "../../apis/notion.api";

const workspaceInfo = ref({});
const articleContent = ref(testArticle);
const loading = ref(false);
const testArticleTitle = ref("Cindy的测试文章");
const pageList = ref([]);
const pageContent = ref("");
const { t } = useNamespace("PluginsViews.Notion");

const setLoading = (value) => {
  loading.value = value;
};

const getPageList = async () => {
  const response = await retrieveDataBase();
  pageList.value = response.map((item) => ({
    id: item.id,
    name: `[${dayjs(item.last_edited_time).format("YYYY-MM-DD HH:mm:ss")}]     ${item.properties.Name.title[0].plain_text}`,
  }));
};

const checkState = async () => {
  try {
    setLoading(true);
    const response = await getBot();
    const { id, avatar_url, bot, name } = response;
    const { workspace_name } = bot;
    workspaceInfo.value = { workspace_name, avatar_url, id, name };
    await getPageList();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const execute = async () => {
  try {
    setLoading(true);

    const response = await createPageWithContent(
      testArticleTitle.value,
      articleContent.value,
    );

    await getPageList();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const onSelectPage = async (item) => {
  try {
    pageContent.value = "";
    const { id } = item;
    const pageData = await getPage(id);
    pageContent.value = pageData;
  } catch (error) {
    console.error(error);
  }
};
</script>
