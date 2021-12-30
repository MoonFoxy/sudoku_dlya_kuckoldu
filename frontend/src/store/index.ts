import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

const URL = process.env.VUE_APP_API_URL ?? '';

/**
 * DIFFICULTIES:
 *    CUSTOM: 0,
 *    EASY: 1,
 *    MEDIUM: 2,
 *    HARD: 3,
 *    EXPERT: 4,
 *    INSANE: 5,
 *    GOOD_LUCK: 6,
 */
interface Cell {
  selected: boolean;
  locked: boolean;
  error: boolean;
  value: number;
}

interface State {
  size: 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6;
  grid: Cell[][];
  gridString: string;
  solutionsCount: number;
  selected: { x: number, y: number } | null;
  input: number | null;
  gameWon: boolean;
}

export default new Vuex.Store<State>({
  state: {
    size: 3,
    difficulty: 4,
    grid: Array(9).fill(Array(9).fill({
      selected: false,
      locked: true,
      error: false,
      value: 0,
    } as Cell)),
    gridString: '',
    solutionsCount: 0,
    selected: null,
    input: null,
    gameWon: false,
  },

  mutations: {
    SET_INPUT(state, { value }: { value: number }) {
      let changedValue = value;
      if (state.size ** 2 >= 10 && state.input) {
        const formedValue: number = parseInt(`${state.input}${changedValue}`, 10);
        if (state.size ** 2 >= formedValue) {
          changedValue = formedValue;
        }
      }

      state.input = changedValue;
    },

    NEW_GAME(state) {
      state.gameWon = false;
    },

    GAME_WON(state) {
      state.gameWon = true;
    },

    CHECK_GAME(state) {
      let won = true;
      for (let y = 0; y < state.grid.length && won; y += 1) {
        for (let x = 0; x < state.grid[y].length && won; x += 1) {
          if (state.grid[y][x].error || state.grid[y][x].value === 0) won = false;
        }
      }

      if (won) state.gameWon = true;
    },

    SET_SUDOKU_DIFFICULTY(state, { difficulty }: { difficulty: State['difficulty'] }) {
      state.difficulty = difficulty;
    },

    SET_GRID_SIZE(state, { size }: { size: State['size'] }) {
      const size2 = size ** 2;
      state.grid = Array(size2).fill(Array(size2).fill({
        selected: false,
        locked: true,
        error: false,
        value: 0,
      } as Cell));
      state.size = size;
    },

    SET_GRID(state, { matrix, gridString }: { matrix: number[][], gridString: string }) {
      state.gridString = gridString;
      for (let y = 0; y < matrix.length; y += 1) {
        const row: Cell[] = [];
        for (let x = 0; x < matrix[y].length; x += 1) {
          const newCell = {
            selected: false,
            locked: matrix[y][x] !== 0,
            error: false,
            value: matrix[y][x],
          };
          row.push(newCell);
        }
        Vue.set(state.grid, y, row);
      }
    },

    SET_SOLUTIONS_COUNT(state, { count }: { count: number }) {
      state.solutionsCount = count;
    },

    SET_CELL_VALUE(state) {
      const value = state.input;
      if (!value) return;

      const size2 = state.size ** 2;
      if (!state.selected || !(value >= 1 && value <= size2)) return;

      state.grid[state.selected.y][state.selected.x].value = value;

      const nonErrorGrid = [...state.grid];
      for (let y = 0; y < size2; y += 1) {
        for (let x = 0; x < size2; x += 1) {
          nonErrorGrid[y][x].error = false;
        }
      }

      /**
       * Error checking & highlighting
       */
      for (let i = 0; i < size2; i += 1) {
        // Check the lines
        const row = _.filter(_.map(nonErrorGrid[i], (el) => el.value),
          (val, j, arr) => _.includes(arr, val, j + 1));
        if (row.length !== 0) {
          for (let x = 0; x < size2; x += 1) {
            if (row.includes(nonErrorGrid[i][x].value) && nonErrorGrid[i][x].value !== 0) {
              nonErrorGrid[i][x].error = true;
            }
          }
        }

        // Check the column
        const column = _.filter(_.map(_.map(nonErrorGrid, (el) => el[i]),
          (el) => el.value), (val, j, arr) => _.includes(arr, val, j + 1));
        if (column.length !== 0) {
          for (let y = 0; y < size2; y += 1) {
            if (row.includes(nonErrorGrid[y][i].value) && nonErrorGrid[y][i].value !== 0) {
              nonErrorGrid[y][i].error = true;
            }
          }
        }

        // Check the square
        const { size } = state;
        let square: number[] = [];
        const startX = size * Math.floor(i % size);
        const startY = size * Math.floor(i / size);

        for (let x = startX; x < startX + size; x += 1) {
          for (let y = startY; y < startY + size; y += 1) {
            square.push(nonErrorGrid[y][x].value);
          }
        }

        square = _.filter(square, (val, j, arr) => _.includes(arr, val, j + 1));
        if (square.length !== 0) {
          for (let x = startX; x < startX + size; x += 1) {
            for (let y = startY; y < startY + size; y += 1) {
              if (square.includes(nonErrorGrid[y][x].value) && nonErrorGrid[y][x].value !== 0) {
                nonErrorGrid[y][x].error = true;
              }
            }
          }
        }
      }
    },

    SET_CELL_SELECTED(state, { x: posX, y: posY }: { x: number, y: number }) {
      if (state.grid[posY][posX].locked) return;
      for (let y = 0; y < state.grid.length; y += 1) {
        const row = state.grid[y];
        for (let x = 0; x < row.length; x += 1) {
          if ((x !== posX || y !== posY) && row[x].selected) {
            row[x].selected = false;
          }
          if (x === posX && y === posY) {
            row[x].selected = true;
            state.selected = { x: posX, y: posY };
          }
        }
        Vue.set(state.grid, y, row);
      }
    },
  },

  actions: {
    INIT_SUDOKU: async ({ commit }, { size, difficulty }: { size?: State['size'], difficulty?: State['difficulty'] }) => {
      commit({
        type: 'NEW_GAME',
      });

      const gameDifficulty = difficulty ?? 4;
      commit({
        type: 'SET_SUDOKU_DIFFICULTY',
        difficulty: gameDifficulty,
      });

      const gameSize = size ?? 3;
      commit({
        type: 'SET_GRID_SIZE',
        size,
      });

      let response: { data: { matrix: number[][], matrixString: string } } = {
        data: {
          matrix: [],
          matrixString: '',
        },
      };
      try {
        response = await axios.post(`${URL}/sudoku/generate`, {
          size: gameSize,
          dif: gameDifficulty,
        });
      } catch (error) {
        console.error(error);
      }

      const gridString: State['gridString'] = `${gameSize}${gameDifficulty}${response.data.matrixString}`;
      console.log(gridString); // TODO: Save String in cache

      /**
       * Change 0 to "", also store a ob instead of just numbers
       */

      commit({
        type: 'SET_GRID',
        matrix: response.data.matrix,
        gridString,
      });
    },

    GET_SOLUTIONS_COUNT: async ({ commit }, { size, grid }: { size: State['size'], grid: Cell[][] }) => {
      let response: { data: { sol: number } } = {
        data: {
          sol: 0,
        },
      };
      let solutions = -1;
      const matrix = _.map(grid, (row) => _.map(row, (el) => el.value));
      try {
        response = await axios.post(`${URL}/sudoku/numsol`, {
          size,
          matrix,
        });
        solutions = response.data.sol;
      } catch (error) {
        console.error(error);
      }

      commit({
        type: 'SET_SOLUTIONS_COUNT',
        count: solutions,
      });
    },

    SET_CELL_VALUE: async ({ commit }, { value }: { value: number }) => {
      commit({
        type: 'SET_INPUT',
        value,
      });
      commit({
        type: 'SET_CELL_VALUE',
      });
      commit({
        type: 'CHECK_GAME',
      });
    },

    // No need
    SET_CELL_SELECTED: async ({ commit }, { x, y }: { x: number, y: number }) => {
      commit({
        type: 'SET_CELL_SELECTED',
        x,
        y,
      });
    },
  },
});
