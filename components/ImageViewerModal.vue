<script lang="ts" setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
});
watch(props, (val) => {
  let audio = new Audio("/sounds/paper-slide.ogg");
  audio.volume = 0.7;
  audio.play();
});

const emit = defineEmits(["close"]);
</script>

<template>
  <UModal
    v-model="props.isOpen"
    @close="(e) => emit('close', e)"
    style="max-width: 100vh"
  >
    <div class="letter">
      <div>
        <div class="w-1/4 max-w-xs flex absolute -right-20 -top-5 rotate-12">
          <img
            class="absolute w-1/3 -top-9 left-2"
            src="/media/paper_clip.png"
            alt=""
          />
          <img
            src="https://picsum.photos/150"
            alt=""
            class="border-white border-2 border-b-8 shadow-2xl border-spacing-5 w-1/1"
          />
        </div>
        <p style="font-family: typewriter; font-size: 10vh; text-align: center">
          POLICE REPORT
        </p>

        <table>
          <tr>
            <td class="justify-self-start rotate-90 w-10">Case Summary</td>
            <td class="td outline outline-1 justify-self-auto px-1">
              Case No:
              <span>4444444dasdas</span>
            </td>
            <td class="td outline outline-1 justify-self-auto px-1">
              Crime place: <span>Halloween Street</span>
            </td>
            <td class="td outline outline-1 justify-self-auto px-1">
              Date: <span>31st October 2023</span>
            </td>
            <td class="td outline outline-1 justify-self-auto px-1">
              Case No. 13-2000
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="4" rowspan="3">
              <UTextarea></UTextarea>
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
        </table>
        <div
          class="grid grid-flow-col outline outline-1 justify-items-stretch auto-rows-max"
        ></div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          euismod porta tempor. Donec pulvinar turpis nec velit pellentesque
          quis rhoncus sapien facilisis. Mauris quis massa dui, rhoncus viverra
          quam. Nulla tempus, augue ut consectetur facilisis, arcu elit
          pellentesque arcu, sed rutrum orci turpis pulvinar augue. Donec eget
          arcu mauris. Vestibulum tristique consequat lacus eget laoreet.
          Integer sed nisl sed nibh pulvinar ornare quis nec quam. Aenean
          rhoncus ligula ut lectus placerat a commodo quam vulputate. In eu
          metus turpis.
        </p>
        <p>
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Phasellus facilisis erat in nibh auctor at aliquet
          velit vestibulum. Curabitur turpis diam, malesuada eu consequat eget,
          ultricies sed nunc. Aenean sed odio massa. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Vestibulum ornare vulputate congue.
          Quisque leo metus, condimentum nec molestie et, egestas luctus libero.
        </p>
        <p>
          Mauris porta odio augue. Nam turpis dui, volutpat id feugiat vitae,
          sagittis a justo. Nam iaculis aliquet erat non varius. Suspendisse
          justo arcu, tincidunt sed auctor sit amet, fermentum id turpis.
          Suspendisse sed enim quis lorem vestibulum fermentum a ut nulla.
        </p>
        <p>
          Nullam tincidunt elit quis nibh blandit interdum. Duis ullamcorper
          pellentesque pretium. Nulla facilisi. Morbi semper nisi et justo
          varius non fermentum metus ornare. Proin vehicula, mi vel volutpat
          accumsan, libero lacus euismod massa, id feugiat velit enim nec
          ligula. Aliquam ipsum est, volutpat aliquam tincidunt id, sagittis et
          velit. Nunc vitae massa vel dui facilisis consectetur vel id sem.
        </p>

        <p>
          Aenean pulvinar, lacus ultrices euismod viverra, nulla diam interdum
          ligula, id mollis mi erat quis lectus. Morbi quis felis ut turpis
          condimentum dictum porttitor id mauris. Nam non tincidunt mauris.
          Donec viverra eleifend pharetra. Nulla eu ipsum et elit consectetur
          rutrum. Integer lorem purus, ultricies ac laoreet quis, feugiat vel
          dolor. Donec eu turpis neque. Nullam molestie sapien eu nibh semper
          sed convallis est pretium.
        </p>
      </div>
    </div>
  </UModal>
</template>

<style>
.letter {
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: 26px auto 0;
  min-height: 300px;
  padding: 24px;
  position: relative;
  width: 80%;
}
.letter > div {
  z-index: 1;
  color: black;
  position: relative;
}

.letter:before,
.letter:after {
  content: "";
  height: 98%;
  position: absolute;
  width: 100%;
  z-index: 0;
}

[id^="headlessui-dialog-panel-"] {
  max-width: 50vw;
  /* background-color: transparent !important; */
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

@font-face {
  font-family: "typewriter";
  src: url("/fonts/XTypewriter-z8oP4.ttf");
}
</style>
