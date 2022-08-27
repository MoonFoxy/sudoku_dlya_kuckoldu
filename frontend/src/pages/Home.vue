<template>
  <div class='home'>
    <div class="jumbotron m-0 p-0 jumbotron-fluid">
      <h2 class="display-4">Sudoku</h2>
      <div class="container">
        <div class="row">
          <div class="col">
            <p class="lead">
              Размер поля:
            </p>
            <b-form-select v-model="selectedSize" v-on:change="onOptionChange" :options="optionsSize" size="lg" class="col mt-3"></b-form-select>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b-button v-on:click="checkSolutionsCount(selectedSize, grid)" block variant="light" class="col mt-3">{{
            solutionsCount ? (solutionsCount > 100 ? 'Более 100 решений' : (0 >= solutionsCount ? 'Не имеет решений' : `${solutionsCount} решений`)) : 'Узнать кол-во решений'
            }}</b-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <div class="col">
            <p class="lead">
              Сложность:
            </p>
            <b-form-select v-model="selectedDifficulty" v-on:change="onOptionChange" :options="optionsDifficulty" size="lg" class="col mt-3"></b-form-select>
          </div>
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
      <a href="https://foxy.moe" class="lead m-0 p-0">
        foxy.moe
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
  public selectedSize = 3;

  public selectedDifficulty = 4;

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

  onOptionChange(): void {
    this.$store.dispatch({
      type: 'INIT_SUDOKU', size: this.selectedSize, difficulty: this.selectedDifficulty, vm: this,
    });
  }

  mounted(): void {
    if (localStorage.getItem('grid') && localStorage.getItem('gridSettings')) {
      try {
        const gridSettings: {
          size: number;
          difficulty: number;
        } = JSON.parse(localStorage.getItem('gridSettings') ?? `{size: "${this.selectedSize}",difficulty: "${this.selectedDifficulty}"}`);
        const grid: Cell[][] = JSON.parse(localStorage.getItem('grid') ?? '[]');
        this.selectedSize = gridSettings.size;
        this.selectedDifficulty = gridSettings.difficulty;
        this.$store.dispatch({
          type: 'INIT_SUDOKU', size: this.selectedSize, difficulty: this.selectedDifficulty, grid, vm: this,
        });
      } catch (error) {
        localStorage.removeItem('gridSettings');
        localStorage.removeItem('grid');
        if (error instanceof Error) {
          this.$bvToast.toast(`${error.name} | ${error.message}`, {
            title: 'Error',
            variant: 'danger',
            solid: true,
          });
          console.error(error);
        }
        this.$store.dispatch({
          type: 'INIT_SUDOKU', size: this.selectedSize, difficulty: this.selectedDifficulty, vm: this,
        });
      }
    } else {
      this.$store.dispatch({
        type: 'INIT_SUDOKU', size: this.selectedSize, difficulty: this.selectedDifficulty, vm: this,
      });
    }
  }
}
</script>
