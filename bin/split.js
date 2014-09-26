#! /usr/bin/env node

var split = require("../src/atom-sass").split,
    fs = require("fs"),
    fname = process.argv[2],
    molecules = JSON.parse(fs.readFileSync(fname, "utf8"));

console.log(split(molecules).join("\n"));
