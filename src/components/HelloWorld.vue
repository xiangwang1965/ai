<template>
  <div class="main">
    <router-link to="login">{{ msg }}</router-link>
  </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
    background: rgba(9,9,9,0.50);
    border: 1px solid #979797;
    box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
    width:100%;
    height:100%;
}
</style>
