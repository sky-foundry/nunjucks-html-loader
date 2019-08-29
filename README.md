# SkyFoundry Nunjucks (Webpack) HTML Loader

Nunjucks template loader for Webpack to generate static HTML files.

[![NPM version][npm-image]][npm-url]
[![Github stars][github-image]][github-url]

## Setup

You should already have a webpack project setup and a webpack config file in your project.

### HTML Webpack Plugin

You should first setup [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) with `inject: 'body'` and `template: 'nunjucks-html-loader!./src/pages/index.njk'` (your entry nunjucks template).

```js
plugins: [
  new HtmlWebpackPlugin({
    inject: 'body',
    template: 'nunjucks-html-loader!./src/pages/index.njk',
  }),
]
```

### Webpack Copy Plugin

For images and other assets, the [CopyPlugin](https://github.com/webpack-contrib/copy-webpack-plugin) is best suited for this.

The recommended options are:

```js
plugins: [
  // ... (html webpack plugin and others)
  new CopyPlugin([
    {
      from: '**/*.{jpg,png,gif,svg,woff,eot,ttf}',
      context: 'src',
    },
  ]),
]
```

TO-DO...

[npm-url]: https://www.npmjs.com/package/@sky-foundry/nunjucks-html-loader
[npm-image]: https://img.shields.io/npm/v/@sky-foundry/nunjucks-html-loader.svg
[github-url]: https://github.com/sky-foundry/nunjucks-html-loader
[github-image]: https://img.shields.io/github/stars/sky-foundry/nunjucks-html-loader.svg?style=social&label=Star
