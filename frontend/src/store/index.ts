import Vue from 'vue';
import Vuex from 'vuex';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
import sudokuModule from './sudoku.js'; // TODO: Delete this shit

Vue.use(Vuex);

/**
 * DIFFICULTIES:
 *    CUSTOM: 0,
 *    MIN: 1,
 *    EASY: 2,
 *    MEDIUM: 3,
 *    HARD: 4,
 *    EXPERT: 5,
 *    INSANE: 6,
 *    GOOD_LUCK: 7,
 */
interface Cell {
  selected: boolean;
  locked: boolean;
  error: boolean;
  candidates?: number[];
  solution?: number;
  value: number | '';
}

interface State {
  size: 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  grid: Cell[][];
  gridString: string | null;
  selected: { x: number, y: number } | null;
  gameWon: boolean;
}

export default new Vuex.Store<State>({
  state: {
    size: 3,
    difficulty: 4,
    grid: Array(9).map(() => Array(9).fill({
      selected: false,
      locked: true,
      error: false,
      value: 0,
    } as Cell)),
    gridString: null,
    selected: null,
    gameWon: false,
  },

  mutations: {
    NEW_GAME(state) {
      state.gameWon = false;
    },

    SET_SUDOKU_DIFFICULTY(state, { difficulty }: { difficulty: State['difficulty'] }) {
      state.difficulty = difficulty;
    },

    SET_GRID_ROW(state, { y, row }: { y: number, row: Cell[] }) {
      state.grid[y] = row;
    },

    SET_CELL_VALUE(state, { value }: { value: number }) {
      if (!state.selected || !(value >= 1 && value <= state.size ** 2)) return;
      const row = state.grid[state.selected.y];
      row[state.selected.x].value = value;

      /**
       * Error checking & highlighting
       */
      if (value !== row[state.selected.x].solution) {
        row[state.selected.x].error = true;
      } else {
        row[state.selected.x].error = false;
      }
      console.log(row[state.selected.x].solution);
      Vue.set(state.grid, state.selected.y, row);

      /**
       * Check if the game is won
       */
      let won = true;
      for (let y = 0; y < state.grid.length; y += 1) {
        for (let x = 0; x < state.grid[y].length; x += 1) {
          if (state.grid[y][x].value !== state.grid[y][x].solution) won = false;
        }
      }
      if (won) state.gameWon = true;
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
    INIT_SUDOKU: async ({ commit }, { difficulty }: { difficulty?: State['difficulty'] | undefined }) => {
      commit({
        type: 'NEW_GAME',
      });

      const gameDifficulty = difficulty ?? 4;
      commit({
        type: 'SET_SUDOKU_DIFFICULTY',
        gameDifficulty,
      });

      const gridString: State['gridString'] = sudokuModule.sudoku.generate(difficulty);
      console.log(gridString);

      const candidates = sudokuModule.sudoku.get_candidates(gridString);
      const grid = sudokuModule.sudoku.board_string_to_grid(gridString);

      const solution = sudokuModule.sudoku.solve(gridString);
      const solvedGrid = sudokuModule.sudoku.board_string_to_grid(solution);

      /**
       * Change . to "", also store a ob instead of just numbers
       */
      for (let y = 0; y < grid.length; y += 1) {
        for (let x = 0; x < grid[y].length; x += 1) {
          const newValue: Cell = {
            selected: false,
            locked: true,
            error: false,
            candidates: candidates[y][x],
            solution: parseInt(solvedGrid[y][x], 10),
            value: parseInt(grid[y][x], 10),
          };

          if (grid[y][x] === '.') {
            newValue.value = '';
            newValue.locked = false;
          }

          grid[y][x] = newValue;
        }
        commit({
          type: 'SET_GRID_ROW',
          y,
          row: grid[y],
        });
      }
    },

    // No need
    SET_CELL_VALUE: async ({ commit }, { value }: { value: number }) => {
      commit({
        type: 'SET_CELL_VALUE',
        value,
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
