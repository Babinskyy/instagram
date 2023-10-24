<script setup lang="ts">
  import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
  import { onMounted, ref, type Ref } from "vue";
  import { supabase } from "../supabase";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";
  const isLiked: Ref<boolean | null> = ref(null);
  const props = defineProps(["post"]);
  const likesAmount: Ref<number> = ref(0);
  const { VITE_BASE_PHOTO_URL } = import.meta.env;

  const userStore = useUserStore();
  const { user: loggedInUser } = storeToRefs(userStore);

  const unlike = async () => {
    isLiked.value = false;
    likesAmount.value--;
    const userId = loggedInUser.value?.id;
    const likes = props.post.likes || [];

    const updatedLikes = likes.filter((id: number) => id !== userId);

    try {
      await supabase
        .from("posts")
        .update({ likes: updatedLikes })
        .eq("id", props.post.id);
    } catch (err) {
      console.error(err);
    }
  };

  const like = async () => {
    isLiked.value = true;
    likesAmount.value++;
    const userId = loggedInUser.value?.id;
    const likes = props.post.likes || [];

    const updatedLikes = [...likes, userId];
    try {
      await supabase
        .from("posts")
        .update({ likes: updatedLikes })
        .eq("id", props.post.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIsLiked = async () => {
    const { data } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", props.post.id)
      .single();

    if (data?.likes) {
      isLiked.value = data?.likes.includes(loggedInUser.value?.id);
      likesAmount.value = data.likes.length;
    }
  };
  onMounted(() => {
    fetchIsLiked();
  });
</script>

<template>
  <div class="image-container">
    <a-card hoverable style="width: 240px" class="card">
      <template #cover>
        <a-image alt="post-image" :src="`${VITE_BASE_PHOTO_URL}${props.post.url}`" />
      </template>

      <a-card-meta>
        <template #title></template>
        <template #description>
          <span class="description" style="color: rgba(0, 0, 0, 1)">
            <span>{{ props.post.caption }}</span>

            <span>
              <HeartOutlined v-if="!isLiked" class="heart-icon" @click="like" />
              <HeartFilled v-else class="heart-icon" style="color: red" @click="unlike" />
              {{ likesAmount ? likesAmount : "" }}
            </span>
          </span>
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<style scoped>
  .image-container {
    margin: 30px 10px 0px 0px;
  }
  .description {
    display: flex;
    justify-content: space-between;
  }
  .heart-icon {
    cursor: pointer;
    margin-right: 5px;
    transition: 0.2s;
  }
  .heart-icon:hover {
    color: red;
    transform: scale(1.1);
  }
</style>
