<template>
  <div class='home'>
    <div class="jumbotron m-0 p-0 jumbotron-fluid">
      <h2 class="display-4">Sudoku</h2>
      <div class="container">
        <div class="row">
          <b-form-select v-model="selectedSize" :options="optionsSize" size="lg" class="col mt-3"></b-form-select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b-button v-on:click="checkSolutionsCount(selectedSize, grid)" block variant="light" class="col mt-3">{{
            solutionsCount ? (solutionsCount > 100 ? 'Более 100 решений' : (0 >= solutionsCount ? 'Не имеет решений' : `${solutionsCount} решений`)) : 'Узнать кол-во решений'
            }}</b-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b-form-select v-model="selectedDifficulty" :options="optionsDifficulty" size="lg" class="col mt-3"></b-form-select>
        </div>
      </div>
      <br>
      <div class="container">
        <Grid/>
      </div>
      <br>
      <p class="lead">Да это</p>
      <div class="row mb-4 no-gutters justify-content-center">
        <img width="130px" height="auto" src="/img/simple.jpg" />
      </div>
    <br>
    </div>
    <br>
    <div class="container">
      <a href="https://tsukiko.tech" class="lead m-0 p-0">
        tsukiko.tech
      </a>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Grid from '@/components/Grid.vue';

interface Cell {
  selected: boolean;
  locked: boolean;
  error: boolean;
  value: number | '';
}

@Component({
  name: 'Home',
  components: {
    Grid,
  },
  computed: mapState([
    'size',
    'difficulty',
    'grid',
    'solutionsCount',
  ]),
})
export default class Home extends Vue {
  private readonly size!: number;

  public selectedSize = this.size ?? 3;

  private readonly difficulty!: number;

  public selectedDifficulty = this.difficulty ?? 4;

  public readonly solutionsCount!: number;

  public readonly grid!: Cell[][];

  public optionsSize: { value: number, text: string }[] = [
    { value: 2, text: '2 x 2' },
    { value: 3, text: '3 x 3' },
    { value: 4, text: '4 x 4' },
    { value: 5, text: '5 x 5' },
  ];

  public optionsDifficulty: { value: number, text: string }[] = [
    { value: 0, text: 'CUSTOM' },
    { value: 1, text: 'EASY' },
    { value: 2, text: 'MEDIUM' },
    { value: 3, text: 'HARD' },
    { value: 4, text: 'EXPERT' },
    { value: 5, text: 'INSANE' },
    { value: 6, text: 'GOOD_LUCK' },
  ];

  checkSolutionsCount(size: number, grid: Cell[][]): void {
    this.$store.dispatch({
      type: 'GET_SOLUTIONS_COUNT', size, grid, vm: this,
    });
  }

  @Watch('selectedSize')
  @Watch('selectedDifficulty')
  onOptionChange(): void {
    this.$store.dispatch({
      type: 'INIT_SUDOKU', size: this.selectedSize, difficulty: this.selectedDifficulty, vm: this,
    });
  }

  created(): void {
    this.$store.dispatch({
      type: 'INIT_SUDOKU', size: 3, difficulty: 4, vm: this,
    });
  }
}
</script>
