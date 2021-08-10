# trees

## Pre-install

You'll need janet (for the backend) and jpm, node (for the frontend), and esbuild (via `npm install -g esbuild`).


## Installing

Run `jpm deps` at the top level, and `npm install` in the `js` folder.

## Up and running

Start by running `jpm run bundle` to create the the bundle. Then run `janet trees.janet --dbfile tree.db` to start the server on port 9005. 

