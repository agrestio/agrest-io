# agrest-io

[![Build Status](https://travis-ci.org/agrestio/agrest-io.svg?branch=master)](https://travis-ci.org/agrestio/agrest-io)

[Live Agrest Site](https://agrest.io/)

## How to run in dev mode

1. Setup env: npm, Java, Hugo

2. Run npm to generate JS/CSS assets:

        $ cd ./app && npm run build:watch
        
3. Run `build-asciidocs.sh` script to update documentation (if needed):

        $ ./build-asciidocs.sh master

4. Run Hugo in dev mode:

        $ hugo server

5. Navigate to http://localhost:1313/

<!--
## How to publish

This site is published by Travis CI, see `.travis.yml` for details.
-->