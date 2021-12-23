<template>
<div id="nav">
  <b-navbar variant="dark" type="dark" toggleable="sm">
    <b-navbar-brand href="#">Sudoku</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <router-link to="/" tag="b-nav-item" right>Играть</router-link>
        <router-link to="/about" tag="b-nav-item" right>Об игре</router-link>
        <router-link to="/howtoplay" tag="b-nav-item" right>Как играть?</router-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class NavigationDrawer extends Vue {}
</script>

<style scoped lang='sass'>

</style>
