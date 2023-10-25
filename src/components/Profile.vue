<script setup lang="ts">
  import Container from "./Container.vue";
  import ImageGallery from "./ImageGallery.vue";
  import Cards from "./Cards.vue";
  import Userbar from "./Userbar.vue";
  import { ref, type Ref, onMounted, watch, reactive, nextTick } from "vue";
  import type { Post, User, UserInfo } from "../types/types";
  import { supabase } from "../supabase";
  import { useRoute } from "vue-router";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";

  const userStore = useUserStore();
  const { user: loggedInUser } = storeToRefs(userStore);
  const posts: Ref<Post[]> = ref([]);
  const route = useRoute();
  const isFollowing = ref(false);
  const user = ref<User | null>(null);
  const loading = ref(false);
  const { username } = route.params;
  const userInfo: UserInfo = reactive({
    posts: null,
    followers: null,
    following: null,
  });

  const deletePost = (id: number) => {
    const index = posts.value.findIndex((post) => post.id === id);
    posts.value.splice(index, 1);
  };

  const updateIsFollowing = (follow: boolean) => {
    isFollowing.value = follow;
  };

  const fetchData = async () => {
    loading.value = true;
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (!userData) {
      loading.value = false;
      return (user.value = null);
    }

    user.value = userData;

    const { data: postsData } = await supabase
      .from("posts")
      .select()
      .eq("owner_id", user.value?.id)
      .order("created_at", { ascending: false });

    posts.value = postsData as Post[];
    await fetchIsFollowing();
    const followerCount = await fetchFollowersCount();
    const followingCount = await fetchFollowingCount();

    userInfo.followers = followerCount;
    userInfo.following = followingCount;
    userInfo.posts = posts.value.length;
    loading.value = false;
  };

  const fetchFollowersCount = async () => {
    const { count } = await supabase
      .from("followers_following")
      .select("*", { count: "exact" })
      .eq("following_id", user.value?.id);

    return count;
  };
  const fetchFollowingCount = async () => {
    const { count } = await supabase
      .from("followers_following")
      .select("*", { count: "exact" })
      .eq("follower_id", user.value?.id);

    return count;
  };

  const fetchIsFollowing = async () => {
    if (loggedInUser.value && loggedInUser.value.id !== user.value?.id) {
      const { data } = await supabase
        .from("followers_following")
        .select()
        .eq("follower_id", loggedInUser.value?.id)
        .eq("following_id", user.value?.id)
        .single();
      if (data) isFollowing.value = true;
    }
  };

  const reloadImages = () => {
    fetchData();
  };

  watch(loggedInUser, () => {
    fetchIsFollowing();
  });

  onMounted(() => {
    fetchData();
  });
</script>

<template>
  <Container>
    <div class="profile-container" v-if="!loading">
      <Userbar
        :key="($route.params.username as string)"
        :user="user"
        :userInfo="userInfo"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
        @post-created="reloadImages"
      />
      <ImageGallery :posts="posts" :deletePost="deletePost" />
    </div>
    <div v-else class="spinner">
      <a-spin />
    </div>
  </Container>
</template>

<style scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
  }
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh;
  }
</style>
