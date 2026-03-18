<template>
  <header class="app-header">
    <h1>Tarefas</h1>
    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/about">Sobre</router-link>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 2px solid #fc0398;
  margin-bottom: 24px;
}

.app-header h1 {
  font-size: 1.4rem;
  color: #fc0398;
}

nav {
  display: flex;
  gap: 16px;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

nav a.router-link-active {
  color: #fc0398;
}
</style>