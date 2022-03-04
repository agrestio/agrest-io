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
        # shellcheck disable=SC2115
        rm -rf "$1/"
    fi
}

# get script arguments
set -x
args="$@"
echo $args

# no input, so just exit
if [ ! -n "$args" ]; then
    echo "Usage: build-asciidocs.sh git-branch-1 git-branch-2"
    exit 1
fi

# change dir to one with this script
cd "$( dirname "${BASH_SOURCE[0]}" )" || exit 2
BASE_DIR=`pwd` # base project dir
echo "Working dir: $BASE_DIR"

# init and check paths
ASCII_DOC_DIR="$BASE_DIR/content/docs" # Asciidoc goes to content, Hugo will process it
AGREST_TMP_DIR="$BASE_DIR/target/tmp"           # tmp directory to checkout Agrest

# prepare all directories
clearDir          "$AGREST_TMP_DIR"
clearDir          "$ASCII_DOC_DIR"
checkAndCreateDir "$ASCII_DOC_DIR"

for git_tag in ${args[@]}
do
	# clone git repo and checkout requested TAG
  AGREST_TMP_DIR_VERSION="$BASE_DIR/target/tmp/$git_tag"           # tmp directory with defined version to checkout Agrest
  GIT_TAG="$git_tag"
  git clone https://github.com/agrestio/agrest-docs.git "$AGREST_TMP_DIR_VERSION" --branch "$GIT_TAG" || ( echo "Wrong branch : $GIT_TAG" && exit 2)
  cd  "$AGREST_TMP_DIR_VERSION/" || exit 2

  # build it
  echo "Running Maven build... it can take a while..."
  mvn package -q -B -DskipTests > /dev/null 2>&1
  echo "Maven build complete"

  # copy everything from ./target/tmp/**/target/site/** directories
  for d in */ ; do
      # skip asciidoc extension module
      if [ "$d" == "agrest-asciidoc-postprocessor/" ]; then
          continue
      fi

      echo "Syncing asciidoc content for ${d}"
      ASCII_DOC_DIR_VERSION="$ASCII_DOC_DIR/$GIT_TAG"
      cp -R "./${d}target/site/." "$ASCII_DOC_DIR_VERSION/"
  done

  # create _index.html for list.html
  cd $ASCII_DOC_DIR_VERSION || exit 2
  echo $'---\n---' > _index.html
done

# create _index.html for list.html
cd $ASCII_DOC_DIR || exit 2
echo $'---\n---' > _index.html


