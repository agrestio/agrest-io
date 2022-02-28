# agrest-io

[![deploy site](https://github.com/agrestio/agrest-io/workflows/deploy%20site/badge.svg)](https://github.com/agrestio/agrest-io/actions)

[Live Agrest Site](https://agrest.io/)


## Run in dev mode

1. Setup env: npm, Java 11, Hugo 0.92.2, Node 8.9.4

2. Run npm to generate JS/CSS assets:

        $ cd ./app && npm run build:watch
        
3. Run `build-asciidocs.sh` script to update documentation (if needed):

        $ cd .. && ./build-asciidocs.sh master

4. Run Hugo in dev mode:

        $ hugo server

5. Navigate to http://localhost:1313/


## Publish to agrest.io

To publish your changes to the website, commit them to the `master` branch and push to GitHub. 
GitHub Actions workflow will pick them up, build and publish to the live site in just a few minutes. 
Documentation changes coming from Agrest will also be picked up.
Additionally, GitHub Actions will run build once a week to pick up any changes in the documentation.

See `.github/workflows/site.yml` for publishing details.
