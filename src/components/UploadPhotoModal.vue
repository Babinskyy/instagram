<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { supabase } from "../supabase";
  import { storeToRefs } from "pinia";
  import { useUserStore } from "@/stores/users";

  const userStore = useUserStore();

  const { user } = storeToRefs(userStore);
  const open = ref<boolean>(false);
  const caption = ref("");
  const uploadedFile = ref<File | null>(null);
  const loading = ref(false);
  const errorMessage = ref("");
  const fileInput = ref<null | HTMLInputElement>(null);
  const emit = defineEmits(["post-created"]);

  const showModal = () => {
    open.value = true;
  };

  const emitPostCreated = () => {
    emit("post-created");
  };

  const handleSubmit = async () => {
    loading.value = true;
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000000);
    const fileName = `${timestamp}-${random}`;
    let filePath;
    if (uploadedFile.value) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload("public/" + fileName, uploadedFile.value);

      if (error) {
        loading.value = false;
        return (errorMessage.value = "Unable to upload your image.");
      }
      filePath = data.path;
      await supabase.from("posts").insert({
        url: filePath,
        caption: caption.value,
        owner_id: user.value?.id,
        owner_username: user.value?.username,
      });
      emitPostCreated();
    }
    loading.value = false;
    open.value = false;
    caption.value = "";
    handleUploadChange(null);
  };

  const handleUploadChange = (event: Event | null) => {
    let files;
    if (event) {
      files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        uploadedFile.value = files[0];
      } else {
        clearFileInput();
      }
    } else {
      clearFileInput();
    }
  };

  const clearFileInput = () => {
    uploadedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  const handleCancel = () => {
    open.value = false;
    clearFileInput();
  };
</script>

<template>
  <div>
    <a-button @click="showModal">Upload Photo</a-button>
    <a-modal v-model:open="open" title="Upload Photo" @ok="handleSubmit">
      <input
        type="file"
        accept=".jpeg, .jpg, .png"
        @change="handleUploadChange"
        ref="fileInput"
      />
      <a-input v-model:value="caption" placeholder="Caption..." :maxLength="50" />
      <a-typography-text v-if="errorMessage" type="danger">
        {{ errorMessage }}
      </a-typography-text>
      <template #footer>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          :disabled="!uploadedFile && caption"
        >
          Submit
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
  input {
    margin-top: 10px;
  }
</style>
