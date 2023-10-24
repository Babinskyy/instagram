<script setup lang="ts">
import Profile from "@/components/Profile.vue";
</script>

<template>
  <main>
    <Profile :key="($route.params.username as string)" />
  </main>
</template>
