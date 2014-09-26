module.exports = function(grunt) {

  grunt.initConfig ({
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: "example/sass",
          src: "**/*.scss",
          dest: "example/css",
          ext: ".css"
        }]
      }
    },

    atom: {
      options: {
        molecule_path: "example",
        molecular_rules_path: "example/molecular-rules.js",
        split_molecules_path: "example/sass/split-molecules.scss"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadTasks("./tasks");

  grunt.registerTask("dist", ["atom", "sass"]);
};
