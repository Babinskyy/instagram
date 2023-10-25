<script setup lang="ts">
  import { UpCircleOutlined } from "@ant-design/icons-vue";
</script>

<template>
  <UpCircleOutlined class="icon" />
</template>

<style scoped>
  .icon {
    position: sticky;
    bottom: 20px;
    left: 20px;
    font-size: 30px;
    transition: 0.2s;
  }
  .icon:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
</style>
