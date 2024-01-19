<template>
  <div class="app">
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'



export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}

html,
body,
.app {
  width: 100%;
  height: 100%;
}
</style>
