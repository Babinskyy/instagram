import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { SignupCredentials, LoginCredentials, User } from "@/types/types";
import { supabase } from "../supabase";

export const useUserStore = defineStore("users", () => {
  const user: Ref<User> = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    const { email, password } = credentials;

    if (!validateEmail(email)) {
      return (errorMessage.value = "Email is invalid!");
    }
    if (!password.length) {
      return (errorMessage.value = "Password cannot be empty!");
    }

    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    };

    loading.value = false;
    errorMessage.value = "";
  };

  const handleSignup = async (credentials: SignupCredentials) => {
    const { email, username, password } = credentials;

    if (password.length < 6) {
      return (errorMessage.value = "Password length is too short!");
    }
    if (username.length < 4) {
      return (errorMessage.value = "Username length is too short!");
    }
    if (username.includes(" ")) {
      return (errorMessage.value = "Username cannot contain spaces!");
    }
    if (!validateEmail(email)) {
      return (errorMessage.value = "Email is invalid");
    }
    loading.value = true;
    const { data: userWithUsernameExists } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userWithUsernameExists) {
      loading.value = false;
      return (errorMessage.value = "User already registered");
    }
    errorMessage.value = "";
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }
    await supabase.from("users").insert({
      username,
      email,
    });
    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };

    loading.value = false;
  };

  const handleLogout = async () => {
    loading.value = true;
    await supabase.auth.signOut();
    loading.value = false;
    user.value = null;
  };

  const getUser = async () => {
    loadingUser.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user?.email)
      .single();

    user.value = {
      id: userWithEmail.id,
      username: userWithEmail.username,
      email: userWithEmail.email,
    };
    loadingUser.value = false;
  };
  const clearErrorMessage = () => {
    errorMessage.value = "";
  };
  return {
    user,
    errorMessage,
    loading,
    loadingUser,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
    clearErrorMessage,
  };
});
