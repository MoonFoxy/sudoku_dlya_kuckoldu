<template>
  <div class='home'>
    <img src='@/assets/images/logo.png'/>
    <h1>Welcome to vue-webpack-typescript!</h1>
    <p>
      For a ginterfacede how to get started with this project,<br/> check out the <a href='https://github.com/akoidan/vue-webpack-typescript'>documentation</a>
    </p>
  </div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator';

export default class Home extends Vue {}
</script>

<style lang='sass'>
  .home-page
    margin: auto
    text-align: center

  img
    height: 100px

  p
    margin-top: 16px

</style>
