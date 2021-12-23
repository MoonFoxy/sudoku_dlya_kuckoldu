<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';

@Component({
  components: { Navbar },
})
export default class App extends Vue {
}
</script>

<style lang="sass">

</style>
