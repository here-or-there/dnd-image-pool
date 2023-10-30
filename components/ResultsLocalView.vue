<template>
  <div>
    <div
      class="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-7 p-2"
    >
      <h1
        class="mb-4 text-4xl text-gray-900 md:text-5xl lg:text-6xl dark:text-white font-semibold"
      >
        {{ `${getCorrectGuesses()}/${guesser?.Guess.length}` }}
        <span class="text-gray-600">({{ correctGuessesPercentage }}%)</span>
        guesses correct
      </h1>
      {{ getEnding() }}
    </div>
    <template v-for="guess in guesser?.Guess" :key="guess.id" v-if="guesser">
      <GuessCard :src="guess.guessedImage.path">
        <template #title>
          <template v-if="guess.person.name == guess.guessedImage.Person?.name">
            <p class="text-green-200">✓ Your guess: {{ guess.person.name }}</p>
          </template>
          <template v-else>
            <p class="text-red-200">
              ✗ Your guess: {{ guess.person.name }} | Submitter:
              {{ guess.guessedImage.Person?.name }}
            </p>
          </template>
        </template>
        <template #description>
          <UCard>
            <blockquote class="relative">
              <svg
                class="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100 dark:text-gray-700"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                  fill="currentColor"
                />
              </svg>

              <div class="relative z-10 ml-10">
                <p class="text-gray-800 sm:text-xl dark:text-white">
                  <em>
                    {{ guess.description || "No description provided." }}
                  </em>
                </p>
              </div>
            </blockquote>
          </UCard>
        </template>
      </GuessCard>
    </template>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const props = defineProps({
  guesserId: {
    type: String,
    required: true,
  },
});
const { data: guesser } = useLazyFetch(
  () => `/api/guessers/${props.guesserId}/guesses`,
  { method: "get" }
);

const getCorrectGuesses = () => {
  return guesser.value?.Guess.filter((guess: any) => {
    return guess.person.name == guess.guessedImage.Person?.name;
  }).length;
};

const correctGuessesPercentage = computed(() => {
  if (!guesser.value?.Guess.length) return 0;

  return Math.round((getCorrectGuesses() / guesser.value?.Guess.length) * 100);
});

const seededRandomNumber = (seed: number) => {
  // Convert seed string into number to be used with Math.random()

  let x = Math.sin(seed) * 10000;
  return;
};

const getEnding = () => {
  if (!guesser.value) return;

  const correctGuesses = getCorrectGuesses();
  const totalGuesses = guesser.value?.Guess.length;
  const percentage = (correctGuesses / totalGuesses) * 100;
  const seed: number = new Date(guesser.value?.createdAt).getTime();
  const randomNumber = Math.abs(Math.sin(seed));
  console.log(seed);
  console.log(randomNumber);

  if (percentage >= 65) {
    return perfectEndings.value[
      Math.floor(randomNumber * perfectEndings.value.length)
    ];
  } else if (percentage >= 30) {
    return okayEndings.value[
      Math.floor(randomNumber * okayEndings.value.length)
    ];
  } else {
    return badEndings.value[Math.floor(randomNumber * badEndings.value.length)];
  }
};

const perfectEndings = ref([
  "The evidence you submitted was crucial in cracking the case. The police followed the clues and uncovered a web of lies and secrets. The criminal was finally caught and faced the consequences of their actions.",
  "The evidence you submitted was undeniable in proving the guilt of the criminal. The police found a video of the criminal confessing to the murder. The criminal was a psychopath who killed for fun.",
  "You did a great job with the submitted evidence. The police identified a blood stain that belonged to the criminal. The criminal was quickly arrested the poor residents of Halloween Street are at peace once again.",
  "You helped the police a lot by with your conclusive evidence. The police unraveled a complex plot that involved multiple suspects and motives. The criminal was a mastermind who'd almost have gotten away with it if it weren't for you meddling kid.",
  "The evidence you submitted was a breakthrough in the investigation. The police exposed a hidden connection between the victim and the criminal. The criminal was a close friend who betrayed them for money",
]);

const okayEndings = ref([
  "You provided some evidence to the police. The evidence was helpful but not enough. The police narrowed down the list of suspects but could not identify the killer. The criminal is still at large and planning their next move.",
  "You offered the forensic experts. While unreliable at parts, it proved to contain a key lead. The police used this to identify a unique feature of the criminal. The criminal had a rare genetic condition that made them easy to spot and arrest.",
  "Your handed evidence was interesting but confusing. The police found it contradicted other pieces of evidence. The criminal had planted false evidence to mislead the investigation and confuse the police. The criminal remains at large.",
  "You handed over some evidence to the authorities. The evidence was crucial but clouded with doubtful risks. The police used it to lure the criminal into a trap. The criminal fell for it and was captured after a chase.",
  "You revealed some evidence to the media. The evidence was interesting but confusing. The police found it contradicted other pieces of evidence. The criminal had planted false evidence to mislead the investigation and confuse the police. However the media attention caused the criminal to make a mistake and they were caught.",
  "You gave some evidence to the detectives. The evidence was important but controversial. The police presented it in court as proof of the guilt of the criminal. The criminal hired a clever lawyer (whose last name rhymed with 'Right') who challenged the validity of the evidence and created reasonable doubt. With no other evidence the alleged criminal was found not guilty.",
  "You showed some evidence to the jury. The evidence was while not conclusive by its own, the police also had other leads to use. After a while the police manages to capture the alleged culprit. They were sentenced to life imprisonment but still proclaim their innocence to this day.",
  "You disclosed some evidence to the witness protection program. The evidence was surprising but enlightening. The police discovered it revealed a hidden motive for the murder. The criminal had a personal grudge against the victim and killed them for revenge.",
  "After investigation your evidence turned out to be intriguing but not related. The police ignored it to focus on other leads. However, with not much to go on they were unable to pinpoint any suspects. The criminal remains at large.",
]);

const badEndings = ref([
  "The evidence you submitted was insufficient. The police could not link it to the crime scene. The criminal covered their tracks well and left no other clues behind.",
  "Your submitted evidence ended up being destroyed. The criminal sabotaged the investigation and vanished without a trace. The police lost their only chance to catch the killer.",
  "The evidence you submitted was outdated. The police followed a lead that was no longer valid. The criminal changed their identity and location, dissapearing completely off the radar.",
  "The evidence you submitted was inconclusive. The police could not find any solid proof. The criminal remained a mystery and the case went cold.",
  "The evidence you submitted was tampered with. The police were misled by false clues. The criminal framed an innocent person and got away with the murder.",
  "The evidence you submitted was inconclusive. The police could not find any solid proof. The criminal remained a mystery and the case went cold.",
  "The evidence you submitted was insufficient. The police could not link it to the crime scene. The criminal covered their tracks well and left no other clues behind.",
  "The evidence you submitted was stolen. The police never received it in time. The criminal had an inside accomplice who intercepted the evidence and helped them escape.",
  "The evidence you submitted was controversial. The police used it to accuse a powerful figure of the murder. The criminal used their influence and resources to discredit the evidence and escape justice.",
  "The evidence you submitted was incomplete. The police found a partial match to the DNA of the criminal. The criminal was a relative of the victim and had a strong alibi.",
]);
</script>

<style></style>
