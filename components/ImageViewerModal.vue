<script lang="ts" setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
    required: true,
  },
  modalData: {
    type: Object,
    default: {},
    required: false,
  },
  comment: {
    type: String,
    default: "",
    required: true,
  },
});

const isImageOpen = ref(false);
const hasUserOpenedImageVIewer = ref(false);

const { data: suspectsData } = await useFetch("/api/people");
const getSuspectData = (id: string) => {
  return suspectsData.value?.find((suspect: any) => suspect.id == id);
} 


watch(
  () => props.isOpen,
  (val) => {
    const paperSlideAudio = new Audio("/sounds/paper-slide.ogg");
    paperSlideAudio.volume = 0.7;
    paperSlideAudio.play();
  },
  { deep: true }
);

const seededRandomNumber = (seed: number) => {
  // Convert seed string into number to be used with Math.random()

  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

function hashCode(string: string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}


const playWriteSound = () => {
  const hitSounds = ["hit00", "hit01", "hit02"];
  const hitSound = hitSounds[Math.floor(Math.random() * hitSounds.length)];
  const hit = document.getElementById(hitSound) as HTMLAudioElement;
  const newAudio = hit.cloneNode() as HTMLAudioElement;
  newAudio.volume = 0.2;
  newAudio.play();
}

const playReturnSound = () => {
  const returnSound = document.getElementById("return") as HTMLAudioElement;
  const newAudio = returnSound.cloneNode() as HTMLAudioElement;
  newAudio.volume = 0.2;
  newAudio.play();
}

const lineBreaksInComment = computed(() => {
  if (!props.comment) {
    return 0;
  }
  const lineBreaks = props.comment.split("\n").length
  return lineBreaks;
})

watch(lineBreaksInComment, (val) => {
  if (!val) return;


  if (val > 1) playReturnSound();
})

const emit = defineEmits(["close", "update:comment"]);
</script>

<template>
  
  <UModal
    v-model="props.isOpen"
    @close="(e) => emit('close', e)"
    :ui="{ base: 'relative text-left rtl:text-right overflow-hidden w-full flex flex-col min-w-[800px]'}"
  >
  <audio src="/sounds/typewriter/hit00.ogg" id="hit00"></audio>
  <audio src="/sounds/typewriter/hit01.ogg" id="hit01"></audio>
  <audio src="/sounds/typewriter/hit02.ogg" id="hit02"></audio>
  <audio src="/sounds/typewriter/return.ogg" id="return"></audio>
    <div class="letter">
      <div>
        
        <div>
          <div
          @click="isImageOpen = true; hasUserOpenedImageVIewer = true"
          class="w-1/4 max-w-xs flex absolute -right-20 -top-5 rotate-12 cursor-pointer hover:scale-125 transition-all duration-500"
        >
        <div v-if="!hasUserOpenedImageVIewer" class=" absolute -right-2 top-10 -rotate-12 rounded bg-amber-400 border border-black bold animate-bounce pr-2" >
          ⬅️ Click me!
        </div>
          <img
            class="absolute w-1/3 -top-9 left-2"
            src="/media/paper_clip.png"
            alt=""
            style="max-width: 3rem"
          />
          <img
            :src="modalData.src"
            alt=""
            class="border-white border-2 border-b-8 shadow-2xl border-spacing-5 w-40 h-40 object-cover"
          />
        </div>
        </div>
        
        <p style="font-family: typewriter; font-size: 5vh; text-align: center">
          POLICE REPORT
        </p>

        <table class="border-collapse border border-slate-500 w-full ">
          <!-- <tr>
            <td colspan="3" class="td border border-slate-500">
              Police Department Incident Report
            </td>
          </tr> -->
          <tr>
            <td class="justify-self-start rotate-90 w-10 h-20 border border-slate-500">Case Summary</td>
            <td class="td border border-slate-500 justify-self-auto px-1">
              <span class="inline-block align-top">Case No:</span>
              <span class="inline-block typewriter-font">4444</span>
            </td>
            <td class="td border border-slate-500 justify-self-auto px-1">
              <div class="align-top">Crime place:</div>
              <p class="align-top typewriter-font">Halloween Street</p>
            </td>
            <td class="td border border-slate-500 justify-self-auto px-1">
              <span>Date:</span>
              <span class="typewriter-font">31st October 2023</span>
            </td>
            <td class="td border border-slate-500 justify-self-auto px-1">
              <div class="align-top">Crime time:</div>
              <p class="align-top typewriter-font">02:00 AM</p>
            </td>
          </tr>
          <tr>
            <td>
              <td class=" rotate-90 w-10 h-20 justify-self-start">Evidence</td>
            </td>
            <td class="border border-slate-500">
              <div>
                Evidence No:
              </div>
              <div class="typewriter-font">
                {{ hashCode(modalData.id.substr(3,3)) }}
              </div>
            </td>
            <td class="border border-slate-500">
              <div>
                Suspect:
              </div>
              <div class="typewriter-font font-extrabold text-red-800">
                {{ getSuspectData(modalData.chosenPersonId)?.name ?? 'Undecided' }}
              </div>
            </td>
            <td class="border border-slate-500">
              <div>
                Evidence description:
              </div>
              <div class="typewriter-font">
                Candy
              </div>
            </td>
            
            <td class="border border-slate-500">
              <div>
                Evidence type:
              </div>
              <div class="typewriter-font">
                Physical
              </div>
            </td>
            
          </tr>
          <tr>
            <td></td>
            <td colspan="4" rowspan="3" class="border border-slate-500">
              <div>
                Description: <span v-show="comment.length == 0" class="text-red-800 font-bold"> WRITE YOUR DESCRIPTION ON THE BOX BELOW </span>
              </div>
              <textarea
                class="bg-transparent w-full bg-slate-200 rounded  typewriter-font h-20 italic"
                type="textarea"
                :value="comment"
                @keydown="playWriteSound()"
                @input="$emit('update:comment', $event.target.value)"
              />
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
        </table>
        <div
          class=" over-flow-hidden max-h-[20vh]"
        >
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
          Cum socii this natoque penatibus et magnis dis parturient montes,
          nascetur ridiculus mus. Phasellus facilisis erat in nibh auctor at
          aliquet velit vestibulum. Curabitur turpis diam, malesuada eu
          consequat eget, ultricies sed nunc. Aenean sed odio massa. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Vestibulum ornare
          vulputate congue. Quisque leo metus, condimentum nec molestie et,
          egestas luctus libero.
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
    </div>
    <ImageFullScreen
      v-model:is-image-open="isImageOpen"
      :src="props.modalData.src"
    />
  </UModal>
</template>

<style>
.typewriter-font {
  font-family: typewriter;
}

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
