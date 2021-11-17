<script setup lang="ts">
import CrankiCard from './CrankiCard.vue'
import { profiles } from '../cranki/output'
import { computed, ref } from '@vue/reactivity'

const query = ref('')

const matches = computed(() => {
  const q = query.value.toLowerCase()
  return profiles.filter(([name, imageUrl]) => name.toLowerCase().includes(q))
})

function cleanUrl(imageUrl: string) {
  // Extract the filename from the image URL
  const filename = imageUrl.split('/').pop()
  return `./dump/profiles/${filename}`
}
</script>

<template>
  <div class="max-w-1200px mx-auto">
    <!-- Search form -->
    <div class="form-control p-4 pt-12">
      <div class="relative">
        <input
          v-model="query"
          type="text"
          placeholder="Search"
          class="w-full pr-16 input input-primary input-bordered text-2xl"
        />
        <button
          class="absolute top-0 right-0 rounded-l-none btn btn-primary text-lg"
        >
          New
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="p-4 grid md:grid-cols-3 gap-4">
      <CrankiCard
        v-for="[name, imageUrl] in matches.slice(0, 40)"
        :name="name"
        :image-url="cleanUrl(imageUrl)"
      />
    </div>
  </div>
</template>
