#!/usr/bin/env bash

function checkAndCreateDir() {
    if [ ! -d "$1" ]; then
        echo "Creating doc dir: $1"
        mkdir "$1"
    fi
}

function clearDir() {
    if [ -d "$1" ]; then
        echo "Clearing dir: $1"
        rm -rf "$1/"
    fi
}

# no input, so just exit
if [ -z "$1" ]; then
    echo "Usage: build-asciidocs.sh git-tag"
    exit -1
fi

GIT_TAG="$1"
echo "Using tag \"$GIT_TAG\""

# change dir to one with this script
cd "$( dirname "${BASH_SOURCE[0]}" )"
BASE_DIR=`pwd` # base project dir
echo "Working dir: $BASE_DIR"

# init and check paths
ASCII_DOC_DIR="$BASE_DIR/content/page/docs"     # Asciidoc goes to content, Hugo will process it
AGREST_TMP_DIR="$BASE_DIR/target/tmp"           # tmp directory to checkout Agrest

# prepare all directories
clearDir          "$AGREST_TMP_DIR"
checkAndCreateDir "$ASCII_DOC_DIR"

# clone git repo and checkout requested TAG
git clone https://github.com/agrestio/agrest.git "$AGREST_TMP_DIR" --branch "$GIT_TAG" --depth 1
# we will need Maven to build only asciidoc modules
cd  "$AGREST_TMP_DIR/agrest-docs/"

# build it
echo "Running Maven build... it can take a while..."
mvn package -q -B -DskipTests
echo "Maven build complete"

# copy everything from ./docs/asciidoc/**/target/site/** directories
for d in */ ; do
    # skip asciidoc extension module
    if [ "$d" == "agrest-asciidoc-postprocessor/" ]; then
        continue
    fi

    echo "Syncing asciidoc content for ${d}"
    cp -R "./${d}target/site/." "$ASCII_DOC_DIR/"
done
