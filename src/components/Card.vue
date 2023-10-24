<script setup lang="ts">
  import {
    HeartOutlined,
    HeartFilled,
    CloseOutlined,
    CheckOutlined,
  } from "@ant-design/icons-vue";
  import router from "../router/index";
  import { supabase } from "../supabase";
  import { onMounted, ref, watch, type Ref } from "vue";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";
  import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

  const userStore = useUserStore();
  const { user: loggedInUser } = storeToRefs(userStore);
  const { VITE_BASE_PHOTO_URL } = import.meta.env;
  const props = defineProps(["post", "fetchIsLiked", "deletePost"]);
  const isLiked: Ref<boolean> = ref(false);
  const likesAmount: Ref<number> = ref(0);
  const isImageLoaded = ref(false);
  const isEditing = ref(false);
  const isLoading = ref(false);
  const captionEditValue: Ref<string> = ref(props.post.caption);
  const postCaption = ref(props.post.caption);

  const goToUserProfile = (user: string) => {
    router.push(`/profile/${user}`);
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

  const deletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await supabase.from("posts").delete().eq("id", props.post.id);
        await supabase.storage.from("images").remove([props.post.url]);
      } catch (err) {
        console.error(err);
      }
      props.deletePost(props.post.id);
    }
  };
  const confirmEdit = async () => {
    await supabase
      .from("posts")
      .update({ caption: captionEditValue.value })
      .eq("id", props.post.id);

    isEditing.value = false;
    postCaption.value = captionEditValue.value;
  };

  const cancelEdit = () => {
    captionEditValue.value = props.post.caption;
    isEditing.value = false;
  };

  const visible = ref<boolean>(false);
  const setVisible = (value: boolean): void => {
    visible.value = value;
  };

  onMounted(() => {
    fetchIsLiked();
  });
</script>

<template>
  <a-card hoverable style="width: 350px" class="card">
    <template #cover>
      <div v-show="!isImageLoaded" class="image-spinner">
        <a-spin />
      </div>
      <img
        :src="`${VITE_BASE_PHOTO_URL}${props.post.url}`"
        alt="post-photo"
        @load="isImageLoaded = true"
        v-show="isImageLoaded"
        @click="() => setVisible(true)"
        class="post-image"
      />
    </template>
    <template v-if="props.post.owner_id === loggedInUser?.id" v-slot:actions #actions>
      <EditOutlined key="edit" @click="isEditing = true" v-if="!isEditing" />
      <DeleteOutlined key="delete" @click="deletePost" v-if="!isEditing" />

      <CloseOutlined key="cancel" @click="cancelEdit" v-if="isEditing" />
      <CheckOutlined key="confirm" @click="confirmEdit" v-if="isEditing" />
    </template>
    <a-card-meta>
      <template #title>
        <span class="title">
          <span class="username" @click="goToUserProfile(props.post.owner_username)">
            {{ props.post.owner_username }}
          </span>

          <span>
            <HeartOutlined v-if="!isLiked" class="heart-icon" @click="like" />
            <HeartFilled v-else class="heart-icon" style="color: red" @click="unlike" />
            {{ likesAmount ? likesAmount : "" }}
          </span>
        </span>
      </template>

      <template #description>
        <span v-if="!isEditing">{{ postCaption }}</span>

        <a-input v-else v-model:value="captionEditValue" placeholder="Caption..." />
      </template>
    </a-card-meta>
  </a-card>
  <div class="image-container">
    <a-image
      :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
      :src="`${VITE_BASE_PHOTO_URL}${props.post.url}`"
    />
  </div>
</template>

<style scoped>
  .card {
    cursor: default;
    margin-bottom: 20px;
  }
  .img {
    cursor: pointer;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .username {
    cursor: pointer;
    transition: 0.2s;
  }
  .username:hover {
    color: #4096ff;
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
  .spinner {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-spinner {
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .post-image {
    transition: 0.2s;
  }
  .post-image:hover {
    cursor: pointer;
    opacity: 0.9;
  }
  .image-container {
    display: none;
  }
</style>
