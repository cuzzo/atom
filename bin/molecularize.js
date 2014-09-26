#! /usr/bin/env node

var translate = require("../src/atom").translate,
    fs = require("fs"),
    fname = process.argv[2],
    atom = fs.readFileSync(fname, "utf8");

console.log(JSON.stringify(translate(atom)));
