<template>
  <x-subpage-wrapper
    :title="t('dialogAdvancedSettings')"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <div>
          <h3 class="mt-1.5 text-sm leading-8 text-gray-700">
            {{ t("systemPrompt") }}
          </h3>
          <x-textarea
            v-model="conversationConfig.systemPrompt"
            :rows="10"
            :placeholder="t('systemPromptPlaceholder')"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>{{ t("temperature") }}</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              :text="t('temperatureTooltip')"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.temperature"
            :min="0"
            :max="2"
            :step="0.01"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>{{ t("context") }}</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              :text="t('contextTooltip')"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.context"
            :min="1"
            :max="100"
            :step="1"
          />
        </div>

        <div class="mt-6 border-t border-gray-300 pt-3">
          <h3 class="flex justify-between text-sm leading-8 text-gray-700">
            <div class="flex gap-3">
              <div>{{ t("plugins") }}</div>
              <x-tooltip
                position="right"
                class="flex items-center"
                :text="t('pluginsTooltip')"
                ><i-mdi-help-circle-outline
              /></x-tooltip>
            </div>
            <!-- <x-switch /> -->
          </h3>

          <div class="flex justify-between py-2">
            <div class="text-gray-700">Tavily搜索</div>
            <x-switch
              v-model="
                conversationConfig.conversationPluginSettings.tavilySearch
              "
            />
          </div>

          <!-- <div class="flex justify-between py-2">
            <div class="text-gray-700">Web Reader</div>
            <x-switch
              v-model="
                conversationConfig.conversationPluginSettings.tavilySearch
              "
            />
          </div> -->

          <!-- <div class="flex justify-between py-2">
            <div class="text-gray-700">翻译</div>
            <x-switch />
          </div> -->

          <!-- <div class="flex justify-between py-2">
            <div class="text-gray-700">文生图</div>
            <x-switch />
          </div> -->

          <div class="flex justify-between py-2">
            <div class="text-gray-700">保存到Notion</div>
            <x-switch
              v-model="conversationConfig.conversationPluginSettings.notion"
            />
          </div>
        </div>
      </div>
    </template>
  </x-subpage-wrapper>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useChatStore, ConversationConfig } from "@/store/chat";
import _ from "lodash";
import { useNamespace, loadModuleTranslations } from "@/i18n";
loadModuleTranslations("pages/ConversationAdvanceSetting");
const { t } = useNamespace("ConversationAdvanceSetting");

const chatStore = useChatStore();

const conversationConfig = ref<ConversationConfig>(
  chatStore.conversationConfig,
);

const { updateConversationAdvanceSetting } = chatStore.$service;

const debouncedWatchHandler = _.debounce(updateConversationAdvanceSetting, 300);

watch(conversationConfig, debouncedWatchHandler, { deep: true });

const props = defineProps<{
  isFullWidth?: boolean;
  onClose?: () => void;
}>();
</script>

<style scoped></style>
