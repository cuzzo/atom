#! /usr/bin/env node

var translate = require("../src/atom").translate,
    split = require("../src/atom-sass").split,
    fs = require("fs"),
    fname_atom = process.argv[2],
    fname_molecular_rules = process.argv[3],
    fname_split_molecules = process.argv[4],
    atom = fs.readFileSync(fname_atom, "utf8");


var molecular_rules = translate(atom),
    molecular_js = "window.MOLECULES = " + JSON.stringify(molecular_rules),
    split_molecules_sass = "@import \"_variables\";\n"
        + "@import \"_mixins\";\n"
        + "@import \"atoms\";\n\n"
        + split(molecular_rules).join("\n");

fs.writeFileSync(fname_molecular_rules, molecular_js);
fs.writeFileSync(fname_split_molecules, split_molecules_sass);
