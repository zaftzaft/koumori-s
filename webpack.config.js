'use strict';

const path = require("path");

module.exports = {
  entry: "./src/js/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  cache: true,
  target: "atom"

};

