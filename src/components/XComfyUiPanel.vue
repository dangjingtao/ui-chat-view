<template>
  <div class="flex flex-col gap-3" v-if="!!workflowJSON">
    <div
      v-for="(node, key) in workflowJSON"
      :key="key"
      class="border-primary-3 mb-5 rounded border bg-white"
    >
      <h3
        class="bg-primary-1 text-primary rounded-t p-2 text-sm leading-4 font-bold"
      >
        #{{ key }} [{{ node.class_type }}] {{ node._meta.title }}
      </h3>

      <div class="p-3" v-if="node.inputs">
        <!-- <h4>Inputs:</h4> -->
        <ul class="flex flex-col gap-3">
          <li
            class="flex text-sm leading-8 text-gray-700"
            v-for="(value, inputKey) in node.inputs"
            :key="inputKey"
          >
            <div class="min-w-[100px]">{{ inputKey }}:</div>
            <div class="flex-1">
              <x-input
                v-if="typeof value === 'string'"
                v-model="node.inputs[inputKey]"
              />
              <x-input
                v-else-if="typeof value === 'number'"
                v-model="node.inputs[inputKey]"
                type="number"
              />
              <x-checkbox
                v-else-if="typeof value === 'boolean'"
                type="checkbox"
              />
              <x-input
                v-else-if="Array.isArray(value)"
                disabled
                :placeholder="getJoinedArray(value)"
                type="text"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <x-result v-else type="404" />
</template>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  workflowJSON: any;
}>();

const workflowJSON = ref(props.workflowJSON);
const getJoinedArray = (array) => {
  return array.join(",");
};
</script>
