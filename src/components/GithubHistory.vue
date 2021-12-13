<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import { computed, ref } from 'vue'

type UrlDetails = {
  org: string
  repo: string
  branch: string
  path: string
}

// Extract details from a URL like 'https://github.com/akrolsmir/starter-project/blob/main/package.json'
function getDetails(url: string): UrlDetails {
  const [, org, repo, branch, path] = url.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/
  )!
  return { org, repo, branch, path }
}

// Get a list of commits for a Github file from their API
const getCommits = async (githubUrl: string) => {
  const { org, repo, branch, path } = getDetails(githubUrl)
  const url = `https://api.github.com/repos/${org}/${repo}/commits?path=${path}`
  const response = await fetch(url)
  const commits = await response.json()
  return commits
}

// Return an object mapping SHAs to file contents, given a list of Github commits
const getFileContents = async (githubUrl: string, commits: any[]) => {
  const { org, repo, branch, path } = getDetails(githubUrl)
  const fileContents = {} as { [sha: string]: string }
  for (const commit of commits) {
    const { sha } = commit
    // Get the URL from raw.githubusercontent.com instead of the API
    const url = `https://raw.githubusercontent.com/${org}/${repo}/${sha}/${path}`
    fileContents[sha] = await fetch(url).then((r) => r.json())
  }
  return fileContents
}

const url =
  'https://github.com/akrolsmir/starter-project/blob/main/package.json'
const commits = ref([])
const fileContents = ref({})

// Sadly, top-level async isn't working for me for some reason
onMounted(async () => {
  commits.value = await getCommits(url)
  // Sort commits by date
  commits.value.sort((a, b) => {
    const aDate = new Date(a.commit.author.date)
    const bDate = new Date(b.commit.author.date)
    return aDate.getTime() - bDate.getTime()
  })

  fileContents.value = await getFileContents(url, commits.value)
})

const step = ref(0)
const current = computed(() => commits.value[step.value])
const { org, repo, branch, path } = getDetails(url)
const currentUrl = computed(() => {
  return `https://github.com/${org}/${repo}/blob/${current.value?.sha}/${path}`
})
</script>

<template>
  <!-- Tailwind centered column -->
  <div class="flex flex-col items-center justify-center">
    <div class="w-full max-w-2xl">
      <!-- Title: Scrub through history -->
      <h1 class="text-4xl font-bold mb-4">Scrub through history</h1>
      <div class="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <a :href="currentUrl" target="_blank" class="block mt-4">
          {{ current?.commit.message }} @ {{ current?.commit.author.date }}
        </a>

        <!-- Use a range slider to control steps -->
        <input
          class="range"
          type="range"
          min="0"
          :max="commits.length - 1"
          v-model.number="step"
        />
        <pre class="text-left">{{ fileContents[current?.sha] }}</pre>
      </div>
    </div>
  </div>
</template>
