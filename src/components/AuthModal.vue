<script lang="ts" setup>
  import { ref, reactive } from "vue";
  import { useUserStore } from "@/stores/users";
  import { storeToRefs } from "pinia";

  const userStore = useUserStore();
  const { errorMessage, loading, user } = storeToRefs(userStore);

  const open = ref<boolean>(false);
  const props = defineProps(["isLogin"]);

  const credentials = reactive({
    username: "",
    email: "",
    password: "",
  });

  const clearCredentialsInput = () => {
    credentials.password = "";
    credentials.email = "";
    credentials.username = "";
    userStore.clearErrorMessage();
  };

  const handleOk = async () => {
    if (props.isLogin) {
      await userStore.handleLogin({
        email: credentials.email,
        password: credentials.password,
      });
    } else {
      await userStore.handleSignup(credentials);
    }
    if (user.value) {
      open.value = false;
      clearCredentialsInput();
    }
  };

  const showModal = () => {
    open.value = true;
  };

  const handleCancel = () => {
    open.value = false;
    clearCredentialsInput();
  };

  const title = props.isLogin ? "Log in" : "Sign up";
</script>

<template>
  <div>
    <a-button type="primary" @click="showModal" class="button">{{ title }}</a-button>
    <a-modal v-model:open="open" :title="title" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </a-button>
      </template>
      <a-input
        v-if="!isLogin"
        v-model:value="credentials.username"
        placeholder="Username"
        class="input"
      />
      <a-input v-model:value="credentials.email" placeholder="Email" class="input" />
      <a-input
        v-model:value="credentials.password"
        placeholder="Password"
        class="input"
        type="password"
      />
      <a-typography-text v-if="errorMessage" type="danger">
        {{ errorMessage }}
      </a-typography-text>
    </a-modal>
  </div>
</template>

<style scoped>
  .button {
    margin-left: 10px;
  }
  .input {
    margin-top: 15px;
  }
</style>
