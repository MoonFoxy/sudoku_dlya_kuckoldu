module.exports = {
  pages: {
    index: {
      // Entry for the page
      entry: 'src/main.ts',
      // The source template
      template: 'public/index.html',
      // Output as dist/index.html
      filename: 'index.html',
      // When using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Sudoku',
    },
  },
  devServer: {
    proxy: {
      '^/sudoku': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
};
