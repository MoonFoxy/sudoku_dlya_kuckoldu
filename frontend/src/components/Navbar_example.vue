<template>
  <div class="sticky top-0 z-20">
    <header class="bg-discord-blurple-560">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 md:flex md:justify-between lg:px-8">
        <nav class="hidden md:flex md:py-2 md:space-x-4 lg:space-x-8" aria-label="Global navigation">
          <router-link
            to="/"
            class="
              text-gray-200
              hover:bg-discord-blurple-630 hover:text-white
              rounded-md
              py-2
              px-3
              inline-flex
              items-center
              text-sm
              font-semibold
              focus:outline-none
              focus-visible:ring-1 focus-visible:ring-white
            "
            active-class="bg-discord-blurple-600"
          >
            discord.js
          </router-link>

          <router-link
            to="/docs"
            class="
              text-gray-200
              hover:bg-discord-blurple-630 hover:text-white
              rounded-md
              py-2
              px-3
              inline-flex
              items-center
              text-sm
              font-semibold
              focus:outline-none
              focus-visible:ring-1 focus-visible:ring-white
            "
            active-class="bg-discord-blurple-600"
          >
            Documentation
          </router-link>

          <a
            :href="`https://github.com/${repository}`"
            class="
              text-gray-200
              hover:bg-discord-blurple-630 hover:text-white
              rounded-md
              py-2
              px-3
              inline-flex
              items-center
              text-sm
              font-semibold
              focus:outline-none
              focus-visible:ring-1 focus-visible:ring-white
            "
            target="_blank"
            rel="noopener"
          >
            <span class="mr-2">GitHub</span><heroicons-outline-external-link class="h-5 w-5" />
          </a>

          <a
            href="https://discordjs.guide"
            class="
              text-gray-200
              hover:bg-discord-blurple-630 hover:text-white
              rounded-md
              py-2
              px-3
              inline-flex
              items-center
              text-sm
              font-semibold
              focus:outline-none
              focus-visible:ring-1 focus-visible:ring-white
            "
            target="_blank"
            rel="noopener"
          >
            <span class="mr-2">Guide</span><heroicons-outline-external-link class="h-5 w-5" />
          </a>
        </nav>

        <div class="relative h-16 flex md:max-w-md md:w-full lg:max-w-lg">
          <div class="relative z-10 flex items-center md:hidden">
            <button
              class="
                rounded-md
                p-2
                inline-flex
                items-center
                justify-center
                hover:bg-discord-blurple-630
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white focus:bg-discord-blurple-630
              "
              :aria-label="`Switch to ${isDarkMode ? 'light theme' : 'dark theme'}`"
              @click="toggleDarkMode()"
            >
              <heroicons-outline-sun
                v-if="!isDarkMode"
                class="fill-current text-gray-200 hover:text-white h-6 w-6"
                aria-hidden="true"
              />
              <heroicons-outline-moon
                v-else
                class="fill-current text-gray-200 hover:text-white h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div class="relative z-0 flex-1 px-2 flex lg:gap-2 items-center justify-center md:justify-end">
            <button
              class="
                hidden
                md:block
                rounded-md
                p-2
                hover:bg-discord-blurple-630
                focus:outline-none focus:ring-1 focus:ring-inset focus:ring-white
              "
              :aria-label="`Switch to ${isDarkMode ? 'light theme' : 'dark theme'}`"
              @click="toggleDarkMode()"
            >
              <heroicons-outline-sun
                v-if="!isDarkMode"
                class="fill-current text-gray-200 hover:text-white h-6 w-6"
                aria-hidden="true"
              />
              <heroicons-outline-moon
                v-else
                class="fill-current text-gray-200 hover:text-white h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <div class="relative z-10 flex items-center md:hidden">
            <button
              type="button"
              class="
                rounded-md
                p-2
                inline-flex
                items-center
                justify-center
                text-gray-200
                hover:bg-discord-blurple-630 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
              "
              aria-controls="mobile-menu"
              :aria-expanded="isOpen"
              @click="isOpen = !isOpen"
            >
              <span class="sr-only">Open menu</span>
              <heroicons-outline-menu :class="{ hidden: isOpen, block: !isOpen }" aria-hidden="true" />
              <heroicons-outline-x :class="{ block: isOpen, hidden: !isOpen }" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <transition
        enter-active-class="transition transform-gpu duration-300 ease-out"
        enter-from-class="translate-x-12 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
      >
        <nav v-if="isOpen" id="mobile-menu" class="md:hidden" aria-label="Global navigation">
          <div class="pt-2 pb-3 px-2 space-y-1">
            <router-link
              to="/"
              class="
                text-gray-200
                hover:bg-discord-blurple-630 hover:text-white
                block
                rounded-md
                py-2
                px-3
                text-base
                font-semibold
              "
              @click="isOpen = !isOpen"
              >discord.js</router-link
            >

            <router-link
              to="/docs"
              class="
                text-gray-200
                hover:bg-discord-blurple-630 hover:text-white
                block
                rounded-md
                py-2
                px-3
                text-base
                font-semibold
              "
              @click="isOpen = !isOpen"
              >Documentation</router-link
            >

            <a
              :href="`https://github.com/${repository}`"
              class="
                text-gray-200
                hover:bg-discord-blurple-630 hover:text-white
                block
                rounded-md
                py-2
                px-3
                text-base
                font-semibold
              "
              target="_blank"
              rel="noopener"
              @click="isOpen = !isOpen"
              ><span class="mr-2">Github</span><heroicons-outline-external-link class="h-5 w-5 inline-block"
            /></a>

            <a
              href="https://discordjs.guide"
              class="
                text-gray-200
                hover:bg-discord-blurple-630 hover:text-white
                block
                rounded-md
                py-2
                px-3
                text-base
                font-semibold
              "
              target="_blank"
              rel="noopener"
              @click="isOpen = !isOpen"
              ><span class="mr-2">Guide</span><heroicons-outline-external-link class="h-5 w-5 inline-block"
            /></a>
          </div>
        </nav>
      </transition>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  useBreakpoints, breakpointsTailwind, whenever, onClickOutside,
} from '@vueuse/core';
import { useStore } from '~/store';
import { isDarkMode, toggleDarkMode } from '~/util/darkMode';
import { search } from '~/util/search';

const store = useStore();
const searchInput = ref('');
const searchScrollPosition = ref(-1);
const repository = computed(() => store.state.source?.repo);
// eslint-disable-next-line vue/no-side-effects-in-computed-properties
</script>

<style>
#search::-webkit-search-cancel-button {
  display: none;
}
</style>
