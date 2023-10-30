<template>
  <div
    class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-7"
  >
    <img
      class="rounded-t-lg object-contain w-full h-80 mt-5"
      :src="src"
      alt=""
    />
    <div class="p-5">
      <div href="#">
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          <slot name="title"></slot>
        </h5>
      </div>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        <slot name="description"></slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Props } from "nuxt/dist/head/runtime/types";

const props = defineProps({
  src: {
    type: String,
  },
});
</script>

<style></style>
