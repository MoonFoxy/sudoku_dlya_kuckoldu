<template>
  <div id="app" class="text-center p-0 m-0 container-fluid">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Navbar from '@/components/Navbar.vue';

@Component({
  name: 'App',
  components: {
    Navbar,
  },
})
export default class App extends Vue {
}
</script>
