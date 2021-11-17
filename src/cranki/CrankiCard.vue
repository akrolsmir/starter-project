<script setup lang="ts">
defineProps({
  name: String,
  imageUrl: String,
})
</script>

<template>
  <div class="card bordered">
    <div class="card-body bg-light-100">
      <h2 class="card-title">
        <div class="pr-4 inline-block">
          <img :src="imageUrl" class="rounded-xl w-20 inline-block" />
        </div>
        <span class="text-2xl">{{ name }}</span>
      </h2>
      <p>
        Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
        necessitatibus veritatis sed molestiae voluptates incidunt iure
        sapiente.
      </p>
      <div class="justify-end card-actions">
        <button class="btn btn-secondary">More info</button>
      </div>
    </div>
  </div>
</template>
