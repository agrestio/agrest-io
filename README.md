# agrest-io

[![Build Status](https://travis-ci.org/agrestio/agrest-io.svg?branch=master)](https://travis-ci.org/agrestio/agrest-io)

[Live Agrest Site](https://agrest.io/)


## Run in dev mode

1. Setup env: npm, Java, Hugo

2. Run npm to generate JS/CSS assets:

        $ cd ./app && npm run build:watch
        
3. Run `build-asciidocs.sh` script to update documentation (if needed):

        $ ./build-asciidocs.sh master

4. Run Hugo in dev mode:

        $ hugo server

5. Navigate to http://localhost:1313/


## Publish to agrest.io

To publish your changes to the website, commit them to the `master` branch and push to GitHub. Travis will pick them up, buid and publish to the live site in just a few minutes. Documentation changes coming from Agrest will also be picked up. If you only have documentation changes, login to Travis and start a build manually.

This site is published by Travis CI, see `.travis.yml` for details.
