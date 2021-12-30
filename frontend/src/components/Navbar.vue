<template>
  <b-navbar toggleable="lg" variant="faded" type="light">
    <router-link to="/">
      <b-navbar-brand>
        <img
          src="/img/bts_leader.png"
          alt="Sudoku"
          width="40px"
          height="auto"
          class="d-inline-block align-top"
        />
        Sudoku
      </b-navbar-brand>
    </router-link>

    <b-navbar-toggle target="nav-collapse">
      <!-- <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template> -->
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <router-link
        to="/"
        v-slot="{ navigate }"
        custom>
          <b-nav-item @click="navigate">Играть</b-nav-item>
        </router-link>
        <router-link
        to="/about"
        v-slot="{ navigate }"
        custom>
          <b-nav-item @click="navigate">Об игре</b-nav-item>
        </router-link>
        <router-link
        to="/howtoplay"
        v-slot="{ navigate }"
        custom>
          <b-nav-item @click="navigate">Как играть?</b-nav-item>
        </router-link>
        <b-nav-item
          href="https://github.com/MoonFoxy/sudoku_dlya_kuckoldu"
          rel="noopener"
          target="_blank"
        >
          GitHub
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'Navbar',
})
export default class Navbar extends Vue {}
</script>
