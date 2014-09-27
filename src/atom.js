var PEG = require("pegjs"),
    fs = require("fs"),
    path = require("path"),
    grammar = fs.readFileSync(path.join(__dirname, "grammar.peg"), "utf8"),
    parser = PEG.buildParser(grammar);

var COMMENT_RGX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
    BAD_FORMAT_EXCEPTION = new Error("Bad fomart.");

/**
 * Translates tokenized ATOM into a BEM class-list dictionary.
 */
var Translator = function() {

  /**
   * Translates tokenized ATOM into a BEM class-list dictionary.
   *
   * @param array tokenized_atom
   *   An ATOM parsed file.
   *   @see grammar.peg
   *
   * @return object
   *   A class-list dictionary.
   *   -> keys: molecule name
   *   -> values: atom names
   */
  this.translate = function(tokenized_atom) {
    return this._translate_block(tokenized_atom);
  };

  /**
   * Determines if a token is a block.
   *
   * @param array token
   *   An ATOM parsed token.
   *   @see grammar.peg
   *
   * @return bool
   *   Whether or not the token is a block.
   */
  this._is_block = function(token) {
    return !(
        !Array.isArray(token)
        || token.length !== 3
        || token[token.length - 1] !== "end"
      );
  };

  /**
   * Determines if a token is a rule.
   *
   * @param array token
   *   An ATOM parsed token.
   *   @see grammar.peg
   *
   * @return bool
   *   Whether or not the token is a rule.
   */
  this._is_rule = function(token) {
    return !(
        !Array.isArray(token)
        || token.length !== 1
      );
  };

  /**
   * Translates a list of ATOM tokens into a BEM class-list dictionary.
   *
   * @param array tokens
   *   A list of ATOM parsed tokens.
   *
   * @return object
   *   A class-list dictionary.
   *   -> keys: molecule name
   *   -> values: atom names
   */
  this._translate_block = function(tokens) {
    var class_dict = {};

    tokens.forEach(function(token) {
      if (!this._is_block(token)) {
        throw BAD_FORMAT_EXCEPTION;
      }

      var name = token[0],
          subtokens = token[1];

      subtokens.forEach(function(subtoken) {
        if (this._is_rule(subtoken)) {
          var rule = subtoken[0];
          if (!Array.isArray(class_dict[name])) class_dict[name] = [];
          class_dict[name].push(rule);
        }
        else if (this._is_block(subtoken)) {
          var res = this._translate_block([subtoken]);
          this._add_translated_block(name, class_dict, res);
        }
        else {
          throw BAD_FORMAT_EXCEPTION;
        }
      }.bind(this));
    }.bind(this));

    return class_dict;
  };

  /**
   * Adds a translated block to a class-list dictionary.
   *
   * @param string base_name
   *   The descendent part of the class name.
   * @param object class_dict
   *   A class-list dictionary.
   * @param object res
   *   A class-list dictionary.
   *
   * @return object
   *   A class-list dictionary.
   *   -> keys: molecule name
   *   -> values: atom names
   */
  this._add_translated_block = function(base_name, class_dict, res) {
    for (var rule_name in res) {
      var bem_name = base_name + rule_name,
          rule_set = res[rule_name];
      class_dict[bem_name] = rule_set;
    }
  };
};

var parse = function(atom) {
  atom = atom.replace(COMMENT_RGX, ""); // Remove comments.
  return parser.parse(atom);
};

var translate = function(atom) {
  var translator = new Translator(),
      tokenized_atom = parse(atom);
  return translator.translate(tokenized_atom);
};

module.exports.parse = parse;
module.exports.Translator = Translator;
module.exports.translate = translate;
