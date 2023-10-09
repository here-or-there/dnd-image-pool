<script setup lang="ts">
import Grid, { DragSortGetter, Item } from "muuri";

let imagesCollection = reactive(
  Array.from({ length: 10 }).map((_, index) => {
    return {
      id: index.toString(),
      src: `https://picsum.photos/seed/${index + 1}/200/300`,
    };
  })
);
let firstHalf = ref(imagesCollection);
let firstHalfCopy: any = ref([]);
let houseImagesArray = ref(
  Array.from({ length: 10 }).map((_, index) => {
    return { id: index, imageIds: [] };
  })
);

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
  });

  let houseGrids: Grid[] = houseImagesArray.value.map((houseImages) => {
    return new $muuri(`.griddy${houseImages.id}`, {
      dragEnabled: true,
      dragSort: getSortableGrids,
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
      houseImagesArray.value[index].imageIds = [];
      grid.getItems().forEach((item) => {
        houseImagesArray.value[index].imageIds.push(item.getElement()?.id);
      });
    });
  });

  function sync(grid: Grid) {
    houseGrids.forEach((houseGrid) => {
      houseGrid.synchronize();
    });
  }
};
const route = useRoute();
const { $muuri } = useNuxtApp();

// Only run if process in browser and div with classes grid-1 and grid-2 exist
if (process.browser) {
  onMounted(() => {
    initiliazeGrid();
  });
}
</script>

<template>
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
        <NuxtImg :src="image.src" alt="" />
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
    {{ houseImagesArray }}
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
  width: 50px;
  height: 50px;
  margin: 5px;
  z-index: 1;
  background: #000;
  color: #fff;
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
  overflow: hidden;
}

@keyframes wobble {
  0% {
    transform: rotate(-1deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(1.5deg);
    animation-timing-function: ease-out;
  }
}
</style>
