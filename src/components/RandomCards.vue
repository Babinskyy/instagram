<script setup lang="ts">
  import { onMounted, ref, type Ref } from "vue";
  import Card from "./Card.vue";
  import { supabase } from "@/supabase";
  import type { Post } from "@/types/types";

  const posts: Ref<Post[]> = ref([]);

  const randomizeArray = (array: Post[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select().limit(10);
    if (data) {
      posts.value = randomizeArray(data).slice(0, 3);
    }
  };

  onMounted(() => {
    fetchPosts();
  });
</script>

<template>
  <div class="random-cards-container">
    <h1>Log in to follow users and like their posts!</h1>
    <Card v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<style scoped>
  .random-cards-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0px 20px 0px;
  }
  h1 {
    padding: 20px 0px 40px 0px;
    text-align: center;
  }
</style>
