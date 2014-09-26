var fs = require("fs"),
    glob = require("glob"),
    Q = require("q"),
    _ = require("underscore")._;

    translate = require("../src/atom").translate,
    split = require("../src/atom-sass").split;

MOLECULE_EXT = ".atom";

var readFilePromise = Q.denodeify(fs.readFile.bind(fs));

var compile_split_molecules = function(molecular_rules) {
    return "@import \"_variables\";\n"
        + "@import \"_mixins\";\n"
        + "@import \"atoms\";\n\n"
        + split(molecular_rules).join("\n");
};

var compile_molecular_js = function(molecular_rules) {
  return "window.MOLECULES = " + JSON.stringify(molecular_rules);
};

var compile_molecular_rules = function(atom_files) {
  var molecular_rules = {};
  atom_files.forEach(function(atom_file) {
    molecular_rules = _.extend(molecular_rules, translate(atom_file));
  });
  return molecular_rules;
};

var glob_molecules = function(src_dir, cb) {
  var glob_str =  src_dir + "/**/*" + MOLECULE_EXT;
  glob(glob_str, {}, cb);
};


var compile = function(molecule_path) {
  var deferred = Q.defer();
  glob_molecules(molecule_path, function(err, matches) {
    if (err) return deferred.reject(err);
    Q.all(
        matches.map(function(molecule) {
          return readFilePromise(molecule, "utf8");
        })
      )
      .then(function(resp) {
        var molecular_rules = compile_molecular_rules(resp),
            molecular_js = compile_molecular_js(molecular_rules),
            split_molecules_sass = compile_split_molecules(molecular_rules);

        deferred.resolve({
          molecules: matches,
          molecular_js: molecular_js,
          split_molecules: split_molecules_sass
        });
      })
      .fail(deferred.reject);
  });
  return deferred.promise;
};

module.exports = function(grunt) {
  var task_name = "atom",
      task_desc = "Compiling ATOM CSS.";
  grunt.registerTask(task_name, task_desc, function() {
    var done = this.async(),
        options = grunt.config.get("atom.options");

    compile(
        options.molecule_path
      )
      .then(function(resp) {
        resp.molecules.forEach(function(molecule) {
          grunt.log.writeln("[atom] compiling molecule: " + molecule.cyan);
        });

        grunt.log.writeln();

        grunt.log.writeln(
            "[atom] splitting CSS3 molecules: "
            + options.split_molecules_path.cyan
          );
        fs.writeFileSync(options.split_molecules_path, resp.split_molecules);

        grunt.log.writeln(
            "[atom] compiling molecular rules: "
            + options.molecular_rules_path.cyan
          );
        fs.writeFileSync(options.molecular_rules_path, resp.molecular_js);
      })
      .fail(function(err) {
        grunt.log.error("ERR", err);
      })
      .fin(done);
  });
};
