var Splitter = function() {
  this.split = function(molecules) {
    var rules = {};
    for (var molecule_name in molecules) {
      if (molecule_name.indexOf(":") === -1) continue;
      rules[molecule_name] = molecules[molecule_name];
    }
    return rules;
  };

  this.rewrite = function(split_molecules) {
    var rules = [];
    for (var molecule_name in split_molecules) {
      var atoms = split_molecules[molecule_name].map(function(atom) {
        return "@extend ." + atom + ";";
      });
      var rule = "." + molecule_name + " { " + atoms.join(" ") + " }";
      rules.push(rule);
    }
    return rules;
  };
};

module.exports.Splitter = Splitter;
