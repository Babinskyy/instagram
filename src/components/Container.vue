<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style scoped>
  .container {
    width: 1200px;
    margin: 0 auto;
  }

  @media screen and (max-width: 1350px) {
    .container {
      width: 1000px;
    }
  }
  @media screen and (max-width: 1050px) {
    .container {
      width: 750px;
    }
  }
  @media screen and (max-width: 800px) {
    .container {
      width: 355px;
    }
  }
</style>
