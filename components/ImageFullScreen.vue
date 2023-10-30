<template>
  <UModal
    v-model="isOpenImageVariable"
    @close="isOpenImageVariable = !isOpenImageVariable"
    :transition="false"
    :ui="{
      base: '',
      wrapper: 'fixed inset-0 z-50 overflow-y-auto',
    }"
  >
    <img
      :src="src"
      alt=""
      class="object-contain"
      :class="{
        'max-h-none max-w-none ': isFullView,
        'max-h-[95vh] max-w-[95vh]': !isFullView,
      }"
    />
    <div
      class="fixed bottom-0 left-0 w-full margin-autocontent-center text-center font-bold text-2xl"
    >
      <div class="inline-flex rounded-md shadow-sm mb-2" role="group">
        <button
          @click="isFullView = !isFullView"
          type="button"
          class="p-2 m-0 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          {{ isFullView ? "Fit to screen" : "Full view" }}
        </button>
        <button
          @click="isOpenImageVariable = !isOpenImageVariable"
          type="button"
          class="bg-amber-800 hover:bg-amber-600 rounded-r-lg transition-all m-0 p-2 inline-flex items-center justify-center text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <!-- Heroicon name: outline/x -->
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
const props = defineProps({
  isImageOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  src: {
    type: String,
    default: "",
    required: true,
  },
});

const emit = defineEmits(["update:isImageOpen"]);

const isOpenImageVariable = computed({
  get() {
    return props.isImageOpen;
  },
  set: (value: Boolean) => {
    console.log(value);
    emit("update:isImageOpen", value);
  },
});

const isFullView = ref(false);

watch(
  () => props.isImageOpen,
  (val) => {
    const flipCardAudio = new Audio("/sounds/flip-card.ogg");
    flipCardAudio.volume = 0.7;
    flipCardAudio.play();
  },
  { deep: true }
);
</script>

<style></style>
