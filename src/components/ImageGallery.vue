<script setup lang="ts">
  import { nextTick, ref, watch } from "vue";
  import Card from "../components/Card.vue";

  const props = defineProps(["posts", "deletePost"]);
</script>

<template>
  <div class="image-gallery-container">
    <Card
      v-for="post in props.posts"
      :key="post.id"
      :post="post"
      :deletePost="props.deletePost"
    />
  </div>
</template>

<style scoped>
  .image-gallery-container {
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
</style>
