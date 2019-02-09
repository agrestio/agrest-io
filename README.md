# agrest-io

[Live Site](https://agrest.io/)


## Dev & Build

from project root in bash

install dev dependencies
```shell
npm i
npm run hljs-custom-build
```

expanded styles for dev
```shell
npm run sass-dev
```

compressed styles
```shell
npm run sass-build
```

minimize and concate js files (commands from `install dev dependencies` should executed before minimizing and concatenating)
```shell
npm run uglify-concat
```