<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Entrar</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="field">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="payload.email"
          type="email"
          placeholder="seu@email.com"
          required
          autocomplete="email"
          class="text-input"
        />
      </div>
      <div class="field">
        <label for="password">Senha:</label>
        <input
          id="password"
          v-model="payload.password"
          type="password"
          placeholder="••••••••"
          required
          autocomplete="current-password"
          class="text-input"
        />
      </div>
      <button type="submit" :disabled="loading" class="submit-button">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const payload = reactive({
  email: '',
  password: '',
});
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(payload);
    router.push('/');
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail ??
      'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
.text-input{
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #ccc;
  width:100%;
}
.text-input:focus {
  border-color: #4a90d9;
  outline: none;
}
.submit-button {
  padding: 12px 20px;
  background-color: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.field{
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

label{
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>
