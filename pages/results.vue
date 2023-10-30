<template>
  <BaseLayout>
    <UContainer>
      <UTabs :items="items">
        <template #item="{ item }">
          <div v-if="item.label == viewTypes.local">
            <div class="grid md:grid-cols-6 gap-4">
              <UTabs
                :items="guessersLabels"
                v-model="localSelectedId"
                orientation="vertical"
              />
              <div class="col-span-5">
                <ResultsLocalView
                  :guesser-id="localSelectedGuesser.id"
                ></ResultsLocalView>
              </div>
            </div>
          </div>
          <div v-if="item.label == viewTypes.global">
            <ResultsGlobalView></ResultsGlobalView>
          </div>
        </template>
      </UTabs>
    </UContainer>
  </BaseLayout>
</template>

<script lang="ts" setup>
enum viewTypes {
  global = "Global",
  local = "Local",
}

const items = [{ label: viewTypes.global }, { label: viewTypes.local }];

const localSelectedId = ref(0);
const localSelectedGuesser = computed(() => {
  return guessers.value?.[localSelectedId.value];
});

const { data: guessers } = useLazyFetch("/api/guessers", { method: "get" });
const guessersLabels = computed(() => {
  return guessers.value?.map((guesser: any) => {
    return { label: guesser.name };
  });
});
</script>

<style></style>
