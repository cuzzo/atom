var split = function(molecules) {
  var rules = [];
  for (var molecule_name in molecules) {
    if (molecule_name.indexOf(":") === -1) continue;
    var atoms = molecules[molecule_name];
    var rule = molecule_to_sass(molecule_name, atoms);
    rules.push(rule);
  }
  return rules;
};

var molecule_to_sass = function(molecule_name, atoms) {
  atoms = atoms.map(function(atom) {
    return "@extend " + atom + ";";
  });
  return "." + molecule_name + " { " + atoms.join(" ") + " }";
};

module.exports.split = split;
