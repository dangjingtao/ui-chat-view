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

      <x-message
        :type="workspaceInfo.id ? 'info' : 'warning'"
        :dismissible="false"
      >
        {{ workspaceInfo.id ? "UIChat 已配置notion" : "请检查链接" }}
        <x-button
          size="small"
          v-if="workspaceInfo.id"
          @click="(e) => (visible = true)"
          type="ghost"
          class="ml-4"
          >写文章</x-button
        >
      </x-message>

      <div class="w-full">
        <x-list
          :title="'Page列表'"
          @select="onSelectPage"
          :items="pageList"
          class="my-3 h-[630px] w-full"
        />
        <!-- <x-input
          :disabled="loading || !workspaceInfo.id"
          v-model="testArticleTitle"
          class="mb-3 w-full"
          placeholder="标题"
        />
        <x-textarea
          :disabled="loading || !workspaceInfo.id"
          :rows="24"
          v-model="articleContent"
          placeholder="给Notion发送一段测试知识"
        /> -->
      </div>
    </template>
    <template #pluginConsoleOperation>
      <!-- <x-button
        :disabled="loading || !workspaceInfo.id"
        @click="execute"
        class="w-full"
        >创建一个新的Notion Page</x-button
      > -->
    </template>

    <template #pluginDebugger>
      <div class="flex h-full w-full flex-col gap-0">
        <div
          class="w-full max-w-full flex-1 overflow-auto rounded-md border border-gray-300 p-10 transition-all duration-300 ease-in-out"
        >
          <x-spin v-if="loading" class="mt-[25%]" />
          <x-markdown
            v-if="!loading && pageContent"
            class="max-w-[790px]"
            :content="pageContent"
          />
          <x-result v-if="!loading && !pageContent" type="404" />
        </div>
      </div>
    </template>
  </plugin-page-wrapper>

  <x-dialog :visible="visible" @cancel="visible = false" @confirm="execute">
    <template #header>写一篇Page</template>
    <template #body>
      <x-input
        :disabled="loading || !workspaceInfo.id"
        v-model="testArticleTitle"
        class="mb-3 w-full"
        placeholder="标题"
      />
      <x-textarea
        :disabled="loading || !workspaceInfo.id"
        :rows="24"
        v-model="articleContent"
        placeholder="给Notion发送一段测试知识"
      />
    </template>
  </x-dialog>
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

const visible = ref(false);
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
    visible.value = false;
  }
};

const onSelectPage = async (item) => {
  setLoading(true);
  try {
    pageContent.value = "";
    const { id } = item;
    const pageData = await getPage(id);
    pageContent.value = pageData;
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
</script>
