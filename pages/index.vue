<script setup lang="ts">
import Grid, { DragSortGetter, Item, ItemDragPlaceholder } from "muuri";
const router = useRouter();
interface chosenImage {
  id: number;
}

interface imageComment {
  id: number;
  comment: string;
}

const modalData = ref([]);
const submitterName = ref("");
const { data: submittedImagesData } = await useFetch("/api/images");

// Random images
// const submittedImagesData = ref(
//   Array.from({ length: 10 }).map((_, index) => {
//     return {
//       id: index,
//       path: `https://picsum.photos/seed/${index}/1000/3000`,
//     };
//   })
// );

const submittedImages = computed(() => {
  if (submittedImagesData.value == null) {
    return [];
  }
  return submittedImagesData.value.map((image, index) => {
    return {
      id: image.id,
      path: image.path,
    };
  });
});

let imagesCollection = reactive(
  submittedImages.value.map((image, index) => {
    return {
      id: image.id,
      src: image.path,
      comment: "",
      chosenPersonId: null,
    };
  })
);

// const houseImagesArray: Ref<{ id: string; chosenImages: chosenImage[] }> = ref(
//   Array.from({ length: 10 }).map((_, index) => {
//     return { id: index };
//   })
// );
const { data: houseImagesArray } = await useFetch("/api/people");

let isOpen = ref(false);
const isSubmissionOpen = ref(false);
const canUserSubmit = computed(() => {
  return (
    imagesCollection.filter((image) => image.chosenPersonId != null).length ==
    imagesCollection.length
  );
});

const submitGuess = async () => {
  console.log(toRaw(imagesCollection));
  await $fetch("/api/guesses", {
    method: "put",
    body: {
      submitterName: submitterName.value,
      guesses: toRaw(imagesCollection),
    },
  })
    .then(() => {
      console.log("success");
    })
    .catch(() => {
      console.log("error");
    });
  router.push("/results");
};

const initiliazeGrid = () => {
  let getSortableGrids: DragSortGetter = (item) => {
    let sortableGrids = houseGrids.filter((grid) => {
      return grid.getItems().length < 2;
    });
    sortableGrids.push(grid1);
    return sortableGrids;
  };

  const grid1: Grid = new $muuri(".grid-1", {
    dragEnabled: true,
    dragSort: getSortableGrids,
    dragHandle: ".item-image",
    dragContainer: document.getElementById("dragContainerFor"),
    dragAutoScroll: {
      targets: () => {
        return [document.getElementById("test")];
      },
      handle: null,
      threshold: 50,
      safeZone: 0.2,
      speed: $muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
      sortDuringScroll: true,
      smoothStop: false,
      onStart: null,
      onStop: null,
    },
  });

  let houseGrids: Grid[] = houseImagesArray.value.map((houseImages) => {
    return new $muuri(`.griddy${houseImages.id}`, {
      dragEnabled: true,
      dragSort: getSortableGrids,
      dragHandle: ".item-image",
      dragContainer: document.getElementById("dragContainerFor"),
      dragAutoScroll: {
        targets: () => {
          return [document.getElementById("test")];
        },
        handle: null,
        threshold: 50,
        safeZone: 0.2,
        speed: $muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
        sortDuringScroll: true,
        smoothStop: false,
        onStart: null,
        onStop: null,
      },
    });
  });

  const refreshChosenImages = () => {
    // Clear 'chosenPersonId' prpoperty from all images
    imagesCollection = imagesCollection.map((image) => {
      image.chosenPersonId = null;
      return image;
    });

    houseGrids.forEach((grid: Grid, index: any) => {
      grid.getItems().forEach((item) => {
        const imageId = item.getElement()?.id;
        const gridId = grid.getElement()?.id;
        let imageinGridIndex = imagesCollection.findIndex(
          (image) => image.id == imageId
        );
        imagesCollection[imageinGridIndex].chosenPersonId = gridId;
      });
    });
  };

  houseGrids.forEach((grid: Grid, index: any) => {
    grid.on("dragReleaseEnd", function (item) {
      refreshChosenImages();
    });

    grid.on("dragEnd", function (item) {
      refreshChosenImages();
    });
  });
};

let openModal = (image: any) => {
  modalData.value = image;
  isOpen.value = true;
};

const { $muuri } = useNuxtApp();

// Only run if process in browser and div with classes grid-1 and grid-2 exist
if (process.browser) {
  onMounted(() => {
    initiliazeGrid();
  });
}
</script>

<template>
  <ImageViewerModal
    :is-open="isOpen"
    :modal-data="modalData"
    v-model:comment="modalData.comment"
    @close="isOpen = false"
  ></ImageViewerModal>
  <UModal v-model="isSubmissionOpen">
    <UCard>
      <div class="m-2">
        "I solemnly affirm that I am telling the truth, the whole truth, and
        nothing but the truth"
      </div>
      <div class="my-2">
        <div class="my-2">
          Signed By:
          <UInput
            placeholder="Submitter's Name"
            type="text"
            v-model:model-value="submitterName"
          />
        </div>
        <div class="my-2">
          <UButton
            @click="submitGuess()"
            :disabled="!canUserSubmit && submitterName.length == 0"
            >Submit evidence</UButton
          >
        </div>
      </div>
    </UCard>
  </UModal>

  <div>
    <div
      class="pt-96 h-96 houses-grid bg-purple-950"
      style="perspective: 1px"
      id="test"
    >
      <div
        style="transform: translateZ(-1px) scale(2); width: 2800px"
        class="-z-10 fixed overflow-x-hidden float-left h-full bg-[url('/media/forest.png')] left-0 bg-repeat-x"
      ></div>
      <div v-for="item in houseImagesArray" class="grid-test">
        <div :key="item.id" style="">
          <div
            :key="item.id + '2'"
            style=""
            :class="'griddy' + item.id"
            class="grid grid-houses"
            :id="item.id"
          ></div>
          <div
            class="absolute bottom-0 bg-orange-800 m-2 p-5 rounded border-2 border-[orange]"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="h-[50vh] bg-[url('/media/pumpkin_bag.png')] m-x-2 bg-contain bg-no-repeat bg-center bg-gray-950"
      style="
        border: 5px solid orange;
        border-radius: 10px;
        min-height: 100%;
        max-height: 100%;
        border-style: dashed;
      "
    >
      <div class="grid grid-1 flex-col min-w-full min-h-full">
        <div
          class="item"
          v-for="image in imagesCollection"
          :key="image.id"
          v-if="imagesCollection"
          :id="image.id"
          :src="image.src"
        >
          <div class="item-content">
            <!-- Safe zone, enter your custom markup -->
            <div class="item-viewer">
              <button @click="openModal(image)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"
                  />
                </svg>
              </button>
            </div>
            <div class="item-image">
              <img
                :src="image.src"
                alt=""
                class="object-cover"
                style="height: 75px; width: 75px"
              />
            </div>
            <!-- Safe zone ends -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="absolute bottom-0 left-[50%] m-auto"
    style="transform: translate(-50%, -50%)"
    v-if="canUserSubmit"
  >
    <button
      @click="isSubmissionOpen = true"
      class="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded animate-bounce"
    >
      SUBMIT ANSWER
    </button>
  </div>
</template>

<style scoped>
.grid {
  position: relative;
}

img {
  pointer-events: none;
}
.houses-grid {
  display: grid;
  grid-gap: 0px;
  padding: 16px;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-flow: column;
  grid-auto-columns: 300px;
  overflow-x: scroll;
  user-select: none;
}
.item {
  display: block;
  position: absolute;

  width: 75px;
  height: 75px;
  margin: 5px;
  z-index: 1;
  background: #000;
  color: #fff;
}

.item-image {
  cursor: move;
}
.grid-test > div {
  height: 300px;
  background-image: url("media/house.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
}

.grid-houses {
  border: 5px solid orange;
  border-radius: 10px;
  min-height: 30%;
  max-height: 30%;
  width: 200px;
  border-style: dashed;
  background-color: rgb(25, 23, 23);
  align-self: flex-end;
  margin-bottom: 0.5rem;
}

.item-viewer {
  opacity: 0;

  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  position: absolute;
  right: 0rem;
  top: 0rem;
  background: #ffe884;
  color: #ff69ea;
  z-index: 100;
}

.item-content:hover > .item-viewer {
  opacity: 1;
  transform: scale(1, 1);
  transition: transform 0.2s 0.1s ease, opacity 0.2s 0.1s linear;
}

/* .griddy1 > .item {
  width: 50px;
  height: 50px;
}

.griddy1 {
  height: 70px;
} */
.item.muuri-item-dragging > .item-content {
  animation: wobble 0.25s ease-in-out infinite alternate;
}
.item.muuri-item-dragging {
  opacity: 0.5;
  z-index: 3;
}

.item.muuri-item-releasing {
  z-index: 2;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

@keyframes wobble {
  0% {
    transform: rotate(-3deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(4.5deg);
    animation-timing-function: ease-out;
  }
}

.letter:before,
.letter:after {
  content: "";
  height: 98%;
  position: absolute;
  width: 100%;
  z-index: -1;
}
.letter:before {
  background: #fafafa;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  left: -5px;
  top: 4px;
  transform: rotate(-2.5deg);
}
.letter:after {
  background: #f6f6f6;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  right: -3px;
  top: 1px;
  transform: rotate(1.4deg);
}
</style>
