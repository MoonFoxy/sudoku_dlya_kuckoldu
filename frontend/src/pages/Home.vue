<template>
  <div class='home'>
    <div class="jumbotron m-0 p-0 jumbotron-fluid">
      <h2 class="display-4">Sudoku</h2>
      <div class="container">
        <div class="row">
          <div class="col">
            <Grid/>
          </div>
          <div class="col">
            <p class="lead">Да это</p>
            <div class="row mb-4 no-gutters justify-content-center">
              <img width="130px" height="auto" src="/img/simple.jpg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="lead m-0 p-0">
        tsukiko.tech
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import Grid from '@/components/Grid.vue';

@Component({
  name: 'Home',
  components: {
    Grid,
  },
})
export default class Home extends Vue {
  created(): void {
    this.$store.dispatch({ type: 'INIT_SUDOKU' });
  }
}
</script>
