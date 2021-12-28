<template>
  <div class="container">
    <table>
      <tbody>
      <tr v-for="(row, idy) in grid" :key="idy">
        <td v-for="(cell, idx) in row" :key="idx"
        :class="{
          locked: grid[idy][idx].locked,
          error: grid[idy][idx].error,
          selected: grid[idy][idx].selected,
          }"
        v-on:click="setSelected(grid[idy][idx], idx, idy)"> {{ grid[idy][idx].value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState } from 'vuex';

interface Cell {
  selected: boolean;
  locked: boolean;
  error: boolean;
  candidates?: number[];
  solution?: number;
  value: number | '';
}

@Component(
  {
    name: 'Grid',
    computed: mapState([
      'grid',
    ]),
  },
)
export default class Grid extends Vue {
  public grid!: Cell[][];

  setSelected(cell: Cell, x: number, y: number): void {
    if (cell.locked) return;
    this.$store.commit({ type: 'SET_CELL_SELECTED', x, y });
  }

  pickNumber(ev: { keyCode: number }): void {
    const value = parseInt(String.fromCharCode(ev.keyCode), 10);
    // If it was NaN, split out
    if (!value) return;
    console.log(value);
    this.$store.commit({ type: 'SET_CELL_VALUE', value });
  }

  mounted(): void {
    window.addEventListener('keypress', this.pickNumber);
  }

  destroyed(): void {
    window.removeEventListener('keypress', this.pickNumber);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  table
    border-collapse: collapse
    border: 2px solid
    background-color: snow

  td
    border: 1px solid
    text-align: center
    height: 40px
    width: 40px
    cursor: pointer
    color: royalblue
    border-color: darkgray
    &.locked
      cursor: not-allowed
      color: black
    &.selected
      background-color: lightskyblue
    &.error
      background-color: lightcoral

  table tbody tr td:nth-child(3), table tbody tr td:nth-child(6)
    border-right: 2px solid black

  table tbody tr:nth-child(3), table tbody tr:nth-child(6)
    border-bottom: 2px solid black
</style>
