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
    proxy: 'http://localhost:5000/',
    historyApiFallback: true,
    /*
    proxy: {
      '/api*': {
        // Forward frontend dev server request for /api to flask dev server
        target: 'http://backend:5000/'
      }
    } */
  },
};
