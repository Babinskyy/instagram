<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import UploadPhotoModal from "./UploadPhotoModal.vue";
  import { useUserStore } from "../stores/users";
  import { useRoute } from "vue-router";
  import { supabase } from "../supabase";
  import { CheckOutlined } from "@ant-design/icons-vue";

  const emit = defineEmits(["post-created"]);
  const route = useRoute();
  const userStore = useUserStore();

  const { username: profileUsername } = route.params;

  const { user } = storeToRefs(userStore);
  const props = defineProps(["user", "userInfo", "isFollowing", "updateIsFollowing"]);
  const followUser = async () => {
    props.updateIsFollowing(true);
    if (user.value) {
      await supabase.from("followers_following").insert({
        follower_id: user.value.id,
        following_id: props.user.id,
      });
    }
  };
  const unfollowUser = async () => {
    props.updateIsFollowing(false);

    if (user.value) {
      await supabase
        .from("followers_following")
        .delete()
        .eq("follower_id", user.value.id)
        .eq("following_id", props.user.id);
    }
  };

  const handlePostCreated = () => {
    emit("post-created");
  };
</script>

<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <a-typography-title :level="2" class="user-info">
        {{ props.user.username }}
      </a-typography-title>
      <div v-if="user">
        <UploadPhotoModal
          v-if="profileUsername === user.username"
          @post-created="handlePostCreated"
        />
        <div v-else>
          <a-button ghost v-if="!props.isFollowing" @click="followUser">Follow</a-button>
          <a-button v-else @click="unfollowUser">
            Following
            <CheckOutlined />
          </a-button>
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <a-typography-title :level="5" class="user-info post-info">
        {{ props.userInfo.posts }} posts
      </a-typography-title>
      <a-typography-title :level="5" class="user-info post-info">
        {{ props.userInfo.followers }} followers
      </a-typography-title>
      <a-typography-title :level="5" class="user-info post-info">
        {{ props.userInfo.following }} following
      </a-typography-title>
    </div>
  </div>
  <div v-else class="userbar-container">
    <div class="top-content">
      <a-typography-title :level="2" class="user-info">
        User not found.
      </a-typography-title>
    </div>
  </div>
</template>

<style scoped>
  .user-info {
    color: var(--color-text);
  }
  .userbar-container {
    width: 100%;
  }
  .bottom-content {
    display: flex;
  }
  .bottom-content h5 {
    margin: 0;
    padding: 0;
    margin-right: 30px;
  }
  .userbar-container {
    padding-bottom: 35px;
  }
  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    .user-info {
      font-size: 22px;
    }
    .post-info {
      font-size: 18px;
    }
    .bottom-content {
      margin-top: 15px;
    }
  }
</style>
