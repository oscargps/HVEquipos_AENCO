<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo-aenco.png">
    <h3 class="titulo">Hoja de vida de equipos</h3>
     <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.titulo{
  margin: 1em 0;
}
</style>
