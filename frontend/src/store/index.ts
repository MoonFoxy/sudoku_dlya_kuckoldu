import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import _ from 'lodash';

Vue.use(Vuex);

const backendURL = process.env.VUE_APP_API_URL ?? '';

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
  difficulty: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  grid: Cell[][];
  solutionsCount: number;
  selected: { x: number, y: number } | null;
  input: number | null;
  gameWon: boolean;
}

const store = new Vuex.Store<State>({
  state: {
    size: 3,
    difficulty: 4,
    grid: Array(9).fill(Array(9).fill({
      selected: false,
      locked: true,
      error: false,
      value: 0,
    } as Cell)),
    solutionsCount: 0,
    selected: null,
    input: null,
    gameWon: false,
  },

  mutations: {
    SET_INPUT(state, { value }: { value: number }) {
      let changedValue = value;
      if (state.size ** 2 >= 10 && state.input !== null) {
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

    SET_GRID_NUMBER(
      state,
      { matrix, custom }: { matrix: number[][], custom?: boolean },
    ) {
      for (let y = 0; y < matrix.length; y += 1) {
        const row: Cell[] = [];
        for (let x = 0; x < matrix[y].length; x += 1) {
          const newCell = {
            selected: false,
            locked: matrix[y][x] !== 0 && !custom,
            error: false,
            value: matrix[y][x],
          };
          row.push(newCell);
        }
        Vue.set(state.grid, y, row);
      }
    },

    SET_GRID_CELL(state, { grid }: { grid: Cell[][] }) {
      for (let y = 0; y < grid.length; y += 1) {
        Vue.set(state.grid, y, grid[y]);
      }
    },

    SET_SOLUTIONS_COUNT(state, { count }: { count: number }) {
      state.solutionsCount = count;
    },

    SET_CELL_VALUE(state) {
      const value = state.input;
      if (value === null) return;

      const size2 = state.size ** 2;
      if (!state.selected || !(value >= 0 && value <= size2)) return;

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
        const row = _.uniq(_.filter(_.map(nonErrorGrid[i], (el) => el.value),
          (val, j, iteratee) => _.includes(iteratee, val, j + 1)));
        if (row.length !== 0) {
          for (let x = 0; x < size2; x += 1) {
            if (row.includes(nonErrorGrid[i][x].value) && nonErrorGrid[i][x].value !== 0) {
              nonErrorGrid[i][x].error = true;
            }
          }
        }

        // Check the column
        const column = _.uniq(_.filter(_.map(_.map(nonErrorGrid, (el) => el[i]),
          (el) => el.value), (val, j, iteratee) => _.includes(iteratee, val, j + 1)));
        if (column.length !== 0) {
          for (let y = 0; y < size2; y += 1) {
            if (column.includes(nonErrorGrid[y][i].value) && nonErrorGrid[y][i].value !== 0) {
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

        square = _.uniq(_.filter(square, (val, j, iteratee) => _.includes(iteratee, val, j + 1)));
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
    GAME_WON: async ({ state, dispatch }, { vm }: { vm: Vue }) => {
      if (state.gameWon) {
        await vm.$bvModal.msgBoxOk('Вы правильно решили судоку! Начать заного?', {
          title: 'Отличная игра!',
          okTitle: 'Новая игра',
          size: 'sm',
          buttonSize: 'lg',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0 justify-content-center',
          footerClass: 'p-2 border-top-0 justify-content-center',
          centered: true,
        })
          .then(() => {
            dispatch({
              type: 'INIT_SUDOKU',
              size: state.size,
              difficulty: state.difficulty,
              vm,
            });
          })
          .catch((error) => {
            if (error instanceof Error) {
              vm.$bvToast.toast(`${error.name} | ${error.message}`, {
                title: 'Error',
                variant: 'danger',
                solid: true,
              });
              console.error(error);
            }
          });
      }
    },

    INIT_SUDOKU: async ({ commit, dispatch }, {
      size, difficulty, vm, grid,
    }: { size?: State['size'], difficulty?: State['difficulty'], grid?: State['grid'], vm: Vue }) => {
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
        size: gameSize,
      });

      if (grid) {
        commit({
          type: 'SET_GRID_CELL',
          grid,
        });
      } else if (gameDifficulty !== 0) {
        await axios.post(`${backendURL}/sudoku/generate`, {
          size: gameSize,
          dif: gameDifficulty - 1,
        })
          .then((res: { data: { matrix: number[][] } } = {
            data: {
              matrix: [],
            },
          }) => {
            commit({
              type: 'SET_GRID_NUMBER',
              matrix: res.data.matrix,
            });
          })
          .catch((error) => {
            if (error instanceof Error) {
              vm.$bvToast.toast(`${error.name} | ${error.message}`, {
                title: 'Error',
                variant: 'danger',
                solid: true,
              });
              console.error(error);
              dispatch({
                type: 'INIT_CUSTOM_SUDOKU',
                size: gameSize,
              });
            }
          });
      } else {
        dispatch({
          type: 'INIT_CUSTOM_SUDOKU',
          size: gameSize,
        });
      }
    },

    INIT_CUSTOM_SUDOKU: async ({ commit }, { size }: { size: State['size'] }) => {
      commit({
        type: 'SET_SUDOKU_DIFFICULTY',
        difficulty: 0,
      });

      const matrix: number[][] = Array(size ** 2).fill(Array(size ** 2).fill(0));
      commit({
        type: 'SET_GRID_NUMBER',
        matrix,
        custom: true,
      });
    },

    GET_SOLUTIONS_COUNT: async ({ commit }, { size, grid, vm }: { size: State['size'], grid: Cell[][], vm: Vue }) => {
      let solutions = -1;
      const matrix = _.map(grid, (row) => _.map(row, (el) => el.value));
      await axios.post(`${backendURL}/sudoku/numsol`, {
        size,
        matrix,
      })
        .then((res: { data: { sol: number } }) => {
          solutions = res.data.sol;
        })
        .catch((error) => {
          if (error instanceof Error) {
            vm.$bvToast.toast(`${error.name} | ${error.message}`, {
              title: 'Error',
              variant: 'danger',
              solid: true,
            });
            console.error(error);
          }
        });
      commit({
        type: 'SET_SOLUTIONS_COUNT',
        count: solutions,
      });
    },

    SET_CELL_VALUE: async ({ commit, dispatch }, { value, vm }: { value: number, vm: Vue }) => {
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
      dispatch({
        type: 'GAME_WON',
        vm,
      });
    },
  },
});

store.subscribe((_mutation, state: State) => {
  localStorage.setItem('grid', JSON.stringify(state.grid));
  localStorage.setItem('gridSettings', JSON.stringify(
    {
      size: state.size,
      difficulty: state.difficulty,
    },
  ));
});

export default store;
