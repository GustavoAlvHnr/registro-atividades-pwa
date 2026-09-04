<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router';

const store = useAuthStore()
const confirmPassword = ref('');
const router = useRouter()

const payload = reactive({
  email: '',
  password: '',
})

function handleCadastro() {
  // Lógica para lidar com o cadastro do usuário
  registro()
  console.log('Cadastro realizado com sucesso!')
  router.push('/login')
}

function validateForm() {
  const errorMessage = ref('');
  if (!payload.email || !payload.password || !confirmPassword.value) {
    errorMessage.value = 'Todos os campos são obrigatórios.';
    return false;
  }
  if (payload.password !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.';
    return false;
  }
  return true;
}

async function registro() {
  if (validateForm){
  await store.register(payload);
  }
}

</script>
<template>
  <div class="cadastro-container">
    <form class="cadastro-form" @submit.prevent="handleCadastro">
      <h1>Cadastro</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="payload.email"
          type="email"
          placeholder="Digite seu email"
        />
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="payload.password"
          type="password"
          placeholder="Digite sua senha"
        />
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword.value"
          type="password"
          placeholder="Confirme sua senha"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>
  </div>
</template>
<style scoped>
.cadastro-container{
  display: flex;
  flex-direction: column;
}
.field{
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
</style>
