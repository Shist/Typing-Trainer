"use strict";

let path = require("path");

module.exports = {
  mode: "production",
  entry: {
    mainPage: "./assets/scripts/main/index.js",
    typingTechniquePage: {
      import: "./assets/scripts/typing-technique/index.js",
      filename: "otherBundles/[name].js",
    },
    aboutPage: {
      import: "./assets/scripts/about-project/index.js",
      filename: "otherBundles/[name].js",
    },
    signInPage: {
      import: "./assets/scripts/sign-in/index.js",
      filename: "otherBundles/[name].js",
    },
    signUpPage: {
      import: "./assets/scripts/sign-up/index.js",
      filename: "otherBundles/[name].js",
    },
    personalAreaPage: {
      import: "./assets/scripts/personal-area/index.js",
      filename: "otherBundles/[name].js",
    },
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/js",
  },
  watch: true,

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage",
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
