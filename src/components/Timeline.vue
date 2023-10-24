<script setup lang="ts">
  import Container from "./Container.vue";
  import Cards from "./Cards.vue";
  import LoginMessage from "./LoginMessage.vue";
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
    padding: 45px 0px 20px 0px;
  }
  .timeline-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
  }
  @media screen and (max-width: 800px) {
    .timeline-container {
      padding-top: 65px;
    }
  }
</style>
