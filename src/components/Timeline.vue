<script setup lang="ts">
  import Container from "./Container.vue";
  import Cards from "./Cards.vue";
  import { useUserStore } from "../stores/users";
  import { storeToRefs } from "pinia";
  import RandomCards from "./RandomCards.vue";
  const userStore = useUserStore();
  const { user, loadingUser } = storeToRefs(userStore);
</script>

<template>
  <Container>
    <div v-if="!loadingUser" class="timeline-container">
      <Cards v-if="user" />
      <RandomCards v-else />
    </div>
    <div v-else class="timeline-spinner">
      <a-spin />
    </div>
  </Container>
</template>

<style>
  .timeline-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }
  .timeline-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }
</style>
