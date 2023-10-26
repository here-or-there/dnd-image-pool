<script setup lang="ts">
import Grid, { DragSortGetter, Item, ItemDragPlaceholder } from "muuri";

interface chosenImage {
  id: number;
}

interface imageComment {
  id: number;
  comment: string;
}

// const { data: submittedImages } = await useFetch("/api/images");

// random images
const submittedImages = ref(
  Array.from({ length: 10 }).map((_, index) => {
    return {
      id: index,
      path: `https://picsum.photos/200?random=${index}`,
    };
  })
);

let imagesCollection = reactive(
  submittedImages.value.map((image, index) => {
    return {
      id: image.id,
      src: image.path,
    };
  })
);
const imageComments = ref<Array<imageComment>>([]);

let firstHalf = ref(imagesCollection);
let firstHalfCopy: any = ref([]);
const houseImagesArray: Ref<{ id: string; chosenImages: chosenImage[] }> = ref(
  Array.from({ length: 10 }).map((_, index) => {
    return { id: index, chosenImages: [] };
  })
);
let isOpen = ref(false);

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
  });

  let houseGrids: Grid[] = houseImagesArray.value.map((houseImages) => {
    return new $muuri(`.griddy${houseImages.id}`, {
      dragEnabled: true,
      dragSort: getSortableGrids,
      dragHandle: ".item-image",
    });
  });
  const allGrids: globalThis.Ref<Grid[]> = ref([grid1, ...houseGrids]);
  console.log(houseGrids);

  grid1.on("layoutEnd", function (event) {
    //event.item.getElement()?.id;
    //firstHalfCopy.value = sync(grid1);
  });

  houseGrids.forEach((grid: Grid, index: any) => {
    grid.on("dragReleaseEnd", function (item) {
      houseGrids.forEach((grid: Grid, index: any) => {
        houseImagesArray.value[index].chosenImages.length = 0;
        grid.getItems().forEach((item) => {
          let imageId = item.getElement()?.id;
          let chosenImage: chosenImage = {
            id: imageId,
            comment: "",
          };
          houseImagesArray.value[index].chosenImages.push(chosenImage);
        });
      });
    });

    grid.on("dragEnd", function (item) {});
  });

  function sync(grid: Grid) {
    houseGrids.forEach((houseGrid) => {
      houseGrid.synchronize();
    });
  }
};

let openModal = () => {
  isOpen.value = true;
};

const route = useRoute();
const { $muuri } = useNuxtApp();

const commentText = ref("");

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
    @close="isOpen = false"
  ></ImageViewerModal>
  <div class="grid grid-1">
    <div
      class="item"
      v-for="image in firstHalf"
      :key="image.id"
      v-if="imagesCollection"
      :id="image.id"
      :src="image.src"
    >
      <div class="item-content">
        <!-- Safe zone, enter your custom markup -->
        <div class="item-viewer">
          <button @click="openModal">
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
          <img :src="image.src" alt="" style="overflow: hidden" />
        </div>
        <!-- Safe zone ends -->
      </div>
    </div>
  </div>
  <div class="houses-grid">
    <div v-for="item in houseImagesArray" class="grid-test">
      <div :key="item" style="">
        <div
          :key="item.id + '2'"
          style=""
          :class="'griddy' + item.id"
          class="grid grid-houses"
        ></div>
      </div>
    </div>
  </div>
  <div>
    <ul>
      <li v-for="houseImages in houseImagesArray" :key="2">
        <template v-if="houseImages.chosenImages.length > 0">
          House {{ houseImages.id }}:
          <ul>
            <li v-for="image in houseImages.chosenImages" :key="image.id">
              {{ image }}
            </li>
          </ul>
        </template>
      </li>
    </ul>
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
  grid-gap: 16px;
  padding: 16px;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-flow: column;
  grid-auto-columns: 300px;
  overflow-x: auto;
  user-select: none;
}
.item {
  display: block;
  position: absolute;

  width: 100px;
  height: 100px;
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
  background-image: url("https://image.freepik.com/free-vector/cartoon-halloween-house_23-2148658717.jpg");
  background-size: auto 100%;
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
}

.grid-houses {
  border: 5px solid orange;
  border-radius: 10px;
  height: 30%;
  width: 75%;
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

.griddy1 > .item {
  width: 50px;
  height: 50px;
}

.griddy1 {
  height: 70px;
}
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
