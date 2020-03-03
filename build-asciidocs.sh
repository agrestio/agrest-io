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
    echo "Usage: build-asciidocs.sh git-tag [agrest]"
    exit -1
fi

GIT_TAG="$1"
#VERSION="$GIT_TAG"

# version can be passed as a second parameter
if [ -z "$2" ]; then
    echo "Using git-tag \"$GIT_TAG\" as agrest version"
else
    VERSION="$2"
    echo "Using git-tag \"$GIT_TAG\" and agrest version"
fi

# change dir to one with this script
cd "$( dirname "${BASH_SOURCE[0]}" )"
BASE_DIR=`pwd` # base project dir
echo "Working dir: $BASE_DIR"

# init and check paths
#MAJOR_VERSION="${VERSION:0:3}" # expecting version format as X.Y.something-else, i.e. 4.1.M1 is ok, but 4.12.M1 will fail..
ASCII_DOC_DIR="$BASE_DIR/content/page/docs"     # Asciidoc goes to content, Hugo will process it
AGREST_TMP_DIR="$BASE_DIR/target/tmp"                          # tmp directory to checkout Cayenne

# prepare all directories
clearDir          "$AGREST_TMP_DIR"
checkAndCreateDir "$ASCII_DOC_DIR"

#echo "Building docs for Cayenne $MAJOR_VERSION ($VERSION)"

# clone git repo and checkout requested TAG
git clone https://github.com/KravchenkoAS/agrest.git "$AGREST_TMP_DIR" --branch "$GIT_TAG" --depth 1
# we will need Maven to build only asciidoc modules
cd  "$AGREST_TMP_DIR/agrest-docs/"

# build it
echo "Running Maven build... it can take a while..."
mvn install -Passembly -DskipTests
#mvn install -Passembly -DskipTests -Dcayenne.version=${VERSION} > /dev/null 2>&1
echo "Maven build complete"

# copy everything from ./docs/asciidoc/**/target/site/** directories
for d in */ ; do
    # skip asciidoc extension module
#    if [ "$d" == "cayenne-asciidoc-extension/" ]; then
#        continue
#    fi

    echo "Syncing asciidoc content for ${d}"
    cp -R "./${d}target/tmp/." "$ASCII_DOC_DIR/"
done
