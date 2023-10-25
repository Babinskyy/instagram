<script setup lang="ts">
  import { onMounted, ref, type Ref } from "vue";
  import Container from "./Container.vue";
  import AuthModal from "./AuthModal.vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";
  import instagram from "@/assets/Instagram_logo_white.png";
  import { supabase } from "../supabase";

  const userStore = useUserStore();

  const { user, loading, loadingUser } = storeToRefs(userStore);
  const router = useRouter();
  const autocompleteValue: any = ref("");
  const options: Ref<{ value: string; text: string }[]> = ref([]);
  let filteredOptions: Ref<{ value: string; text: string }[]> = ref([]);

  const onSelect = (option: string) => {
    if (option) {
      router.push(`/profile/${option}`);
    }
  };

  const onSearch = (query: string) => {
    filteredOptions.value = options.value.filter(
      (option) =>
        option.text.toLowerCase().includes(query.toLocaleLowerCase()) && query.length >= 2
    );
  };

  const handleLogout = async () => {
    await userStore.handleLogout();
    router.push("/");
  };
  const goToUserProfile = () => {
    router.push(`/profile/${user.value?.username}`);
  };

  const fetchUsernames = async () => {
    const { data } = await supabase.from("users").select("username");
    if (data) {
      for (const user of data) {
        options.value.push({ value: user.username, text: user.username });
      }
    }
  };

  const clearAutoCompleteInput = () => {
    autocompleteValue.value = ""; // Clear the input value
    filteredOptions.value = [];
  };

  onMounted(() => {
    fetchUsernames();
  });
</script>

<template>
  <div class="nav">
    <Container>
      <div class="nav-container">
        <div class="left-content">
          <RouterLink to="/" @click="clearAutoCompleteInput">
            <img :src="instagram" alt="instagram-logo" />
          </RouterLink>
          <a-auto-complete
            class="autocomplete"
            placeholder="Search..."
            @select="onSelect"
            @search="onSearch"
            :options="filteredOptions"
            allow-clear
            v-model:value="autocompleteValue"
          />
        </div>
        <div v-if="!loadingUser" class="buttons-panel">
          <div class="right-content" v-if="!user">
            <AuthModal :isLogin="false" />
            <AuthModal :isLogin="true" />
          </div>
          <div class="right-content" v-else>
            <a-button type="primary" @click="goToUserProfile">Profile</a-button>
            <a-button type="primary" danger @click="handleLogout" :loading="loading">
              Log out
            </a-button>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
  .nav {
    width: 100%;
    background-color: rgb(0, 17, 72);
    padding: 15px;
    /* position: fixed; */
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .nav-container {
    display: flex;
    justify-content: space-between;
  }
  .left-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left-content a {
    display: flex;
    text-decoration: none;
    color: white;
    margin-right: 10px;
  }
  .left-content a img {
    width: 150px;
    margin-right: 10px;
    transform: translate(0, 2px);
  }
  .autocomplete {
    width: 250px;
  }
  .buttons-panel {
    display: flex;
    justify-content: center;
  }
  .right-content {
    display: flex;
    align-items: center;
  }
  .right-content button {
    margin-left: 10px;
  }

  @media screen and (max-width: 800px) {
    .nav-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .autocomplete {
      width: 185px;
    }
    .buttons-panel {
      margin-top: 10px;
      width: 100%;
    }
  }
</style>
