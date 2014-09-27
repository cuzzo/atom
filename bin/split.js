#! /usr/bin/env node

var Splitter = require("../src/atom-sass").Splitter,
    fs = require("fs"),
    fname = process.argv[2],
    molecules = JSON.parse(fs.readFileSync(fname, "utf8")),
    splitter = new Splitter(),
    split_molecules = splitter.split(molecules);

console.log(splitter.rewrite(split_molecules).join("\n"));
