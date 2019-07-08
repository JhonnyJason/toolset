const basePackage = {
    "name": "website-thingy",
    "version": "0.0.1",
    "description": "website-thingy",
    "scripts": {
      "build-styl": "stylus sources/source/index/index.styl -o toolset/compiled/css/",
      "watch-styl": "stylus sources/source/index/index.styl -o toolset/compiled/css/ -w",
      "build-index-pug": "pug -o output/ sources/source/index/index.pug",
      "watch-index-pug": "pug -o output/ sources/source/index/index.pug -w",
      "build-coffee": "coffee -o toolset/compiled/js/ -c sources/source/*/*.coffee",
      "watch-coffee": "coffee -o toolset/compiled/js/ -cw sources/source/*/*.coffee",
      "bundle": "webpack-cli --config webpack.config.js",
      "watch-bundle": "webpack-cli --config webpack-watch.config.js",
      "build-js": "run-s -ns build-coffee bundle",
      "watch-js": "run-p -nsr watch-coffee watch-bundle",
      "build": "run-s -ns build-styl build-js build-index-pug",
      "watch": "run-p -nsr watch-js watch-styl watch-index-pug ui-sync",
      "ui-sync": "browser-sync start --server 'output/' --files 'output/index.html' --no-open",
      "test": "run-s -ns build watch",
      "initialize-project": "run-s -ns patch-stuff create-compile-folders build copyscript",
      "patch-stuff": "synced-misfits/patch-stuff.sh",
      "copyscript": "synced-misfits/copyscript.sh",
      "create-compile-folders": "synced-misfits/create-compile-folders.sh",
      "push": "synced-misfits/add-commit-and-push-all-repos.sh",
      "pull": "synced-misfits/pull-all.sh",
      "postinstall": "npm run initialize-project"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/JhonnyJason/repo.git"
    },
    "author": "Lenard Frommelt",
    "license": "Unlicense",
    "bugs": {
      "url": "https://github.com/JhonnyJason/repo/issues"
    },
    "homepage": "https://github.com/JhonnyJason/repo#readme",
    "dependencies": {
      "browser-sync": "^2.26.3",
      "coffeescript": "^2.3.2",
      "npm-run-all": "^4.1.5",
      "pug-cli": "^1.0.0-alpha6",
      "stylus": "^0.54.5",
      "webpack": "^4.29.0",
      "webpack-cli": "^3.2.1"
    }
  }
// also produce webpack config
module.exports = {
    type: "website",
    getScripts: () => {

    },
    getDependencies: () => {

    },
    produceConfigFiles: (path) => {

    }
}