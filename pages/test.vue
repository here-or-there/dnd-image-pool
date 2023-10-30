<script lang="ts" setup></script>

<template>
  <div class="parallax">
    <div class="parallax__layer parallax__layer--back">
      <div
        src="/media/forest.png"
        alt=""
        class="w-[300vw] bg-repeat-x -translate-x-1/2 scale-150"
        style="background-image: url('/media/forest.png'); height: 100vh"
      />
    </div>
    <div class="parallax__layer parallax__layer--base">13242342</div>
  </div>
</template>

<style>
.parallax {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.parallax__layer {
  position: absolute;
  padding: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.parallax__layer--base {
  transform: translateZ(0);
  transform: translateY(100vh);
}
.parallax__layer--back {
  transform: translateZ(-0.5px);
}
</style>
