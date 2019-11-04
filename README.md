Moosic is a gh-pages hosted, mobile-ready, ReactJS, LESS powered HTML5 webpage complete with a music player.

  - Responsive
  - IE 9 Compatible
  - Light - create-react-app was not used

# New Features!

  - Skip forward or skip reverse songs in the music player
  - 30s trial over audio sample notifies you when your free music play is over


You can also:
  - View number of songs and total playlist duration
  - Pause and Play

Moosic is a lightweight app complete with CSS3 animations and pre-loaded fonts from Google.

Features to come:
> Sort playlist by Album, Artist, Duration, or Title

### Tech

Moosic uses a number(10) of npm packages to work properly:

* [ReactJS] - HTML enhanced for web apps!
* [Babel] - ES6 transpilation
* [Webpack] - Built with Webpack
* [LESS] - quick and easy CSS3 pre-processor

And of course Moosic itself is open source, check out the [github repository](https://www.github.com/spanishiwa).

### Installation

Moosic requires [Node.js](https://nodejs.org/) to run.

Pull the repository and delete `node_modules`. Install the dependencies and devDependencies and start the server.

```sh
$ cd Moosic
$ npm install
$ npm run webpack
```

### Commands

```sh
$ less-watch-compiler
$ npm run webpack
```

`less-watch-compiler` will compile your `.less` styles into `.css` and will automatically compile when it detects changes to your `.less` file, typically through saving the file.

`npm run webpack` runs a script `"webpack": "webpack --mode=development --watch"` that builds your app.
