<script setup lang="ts">
  import { supabase } from "../supabase";
  import Card from "./Card.vue";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";
  import { ref, watch, type Ref } from "vue";
  import type { Post } from "../types/types";
  import Observer from "./Observer.vue";

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const posts: Ref<Post[]> = ref([]);
  const unfollowedPosts: Ref<Post[]> = ref([]);
  const lastCardIndex = ref(0);
  const ownerIds: Ref<number[]> = ref([]);
  const reachEnd = ref(false);
  const loading = ref(true);

  const fetchPostsSet = async () => {
    const { data: followings } = await supabase
      .from("followers_following")
      .select("following_id")
      .eq("follower_id", user.value?.id);

    if (followings) ownerIds.value = followings?.map((f) => f.following_id);

    if (!reachEnd.value) {
      const { data } = await supabase
        .from("posts")
        .select()
        .in("owner_id", ownerIds.value)
        .range(lastCardIndex.value, lastCardIndex.value + 2)
        .order("created_at", { ascending: false });

      if (data) {
        posts.value = [...posts.value, ...data];
        if (data.length <= 2) {
          reachEnd.value = true;
        }
      }

      lastCardIndex.value = lastCardIndex.value + 3;

      if (!data?.length) {
        reachEnd.value = true;
      }
    }
    loading.value = false;
  };

  const fetchUnfollowedPosts = async () => {
    const transformedString = `(${ownerIds.value.join(", ")})`;

    const query = supabase
      .from("posts")
      .select()
      .not("owner_id", "in", transformedString)
      .not("owner_id", "eq", user.value?.id)
      .range(0, 5);

    const { data: notFollowedData } = await query;
    if (notFollowedData) {
      const idSet = new Set();
      const uniqueArray = notFollowedData.filter((post) => {
        if (!idSet.has(post.owner_id)) {
          idSet.add(post.owner_id);
          return true;
        }
        return false;
      });
      unfollowedPosts.value = uniqueArray.slice(0, 3);
    }
  };

  watch(reachEnd, () => {
    fetchUnfollowedPosts();
  });
</script>

<template>
  <div>
    <div v-if="!loading">
      <div class="timeline-container">
        <div>
          <Card v-for="post in posts" :key="post.id" :post="post" />
        </div>
        <div v-if="reachEnd" class="more-users-container">
          <h1 v-if="unfollowedPosts.length">Explore more posts!</h1>
          <Card v-for="post in unfollowedPosts" :key="post.id" :post="post" />
        </div>
      </div>
    </div>
    <div v-else class="spinner">
      <a-spin />
    </div>
    <Observer @intersect="fetchPostsSet" class="observer" />
  </div>
</template>

<style scoped>
  .spinner {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h1 {
    margin-bottom: 20px;
  }
  .observer {
    margin: 0 auto;
    width: 1px;
    height: 1px;
    /* background-color: antiquewhite; */
  }
  .more-users-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
