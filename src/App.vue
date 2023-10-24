<script setup lang="ts">
  import Nav from "./components/Nav.vue";
  import BackToTopButton from "./components/BackToTopButton.vue";
  import { RouterView } from "vue-router";
  import { onBeforeUnmount, onMounted, ref } from "vue";
  import { useUserStore } from "./stores/users";

  const userStore = useUserStore();
  const showButton = ref(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    showButton.value = window.scrollY > 400;
  };

  onMounted(() => {
    userStore.getUser();
    window.addEventListener("scroll", handleScroll);
  });
</script>

<template>
  <main>
    <Nav />
    <RouterView />
    <BackToTopButton @click="scrollToTop" v-if="showButton" />
  </main>
</template>

<style scoped></style>
