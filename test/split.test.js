// Integeration

var chai = require("chai"),
    Splitter = require("../src/atom-sass").Splitter,
    splitter = new Splitter();

describe("Split Tests", function() {
  it("should not split non-CSS3", function() {
    var RULES = {
      block: ["atom"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 0);
  });

  it("should not split multi-atom non-CSS3", function() {
    var RULES = {
      block: ["atom", "atom2"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 0);
  });

  it("should split CSS3 without expression", function() {
    var RULES = {
      "block:hover": ["atom"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 1);
    chai.assert.sameMembers(resp["block:hover"], ["atom"]);
  });

  it("should split CSS3 with expression", function() {
    var RULES = {
      "block:nth-child(2n + 1)": ["atom"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 1);
    chai.assert.sameMembers(resp["block:nth-child(2n + 1)"], ["atom"]);
  });

  it("should split multiple CSS3", function() {
    var RULES = {
      "block:hover": ["atom"],
      "block:nth-child(2n + 1)": ["atom"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 2);
    chai.assert.sameMembers(resp["block:hover"], ["atom"]);
    chai.assert.sameMembers(resp["block:nth-child(2n + 1)"], ["atom"]);
  });

  it("should split CSS3 independent of non-CSS3", function() {
    var RULES = {
      "block": ["atom"],
      "block:hover": ["atom"],
      "block2": ["atom"],
      "block:nth-child(2n + 1)": ["atom"],
      "block3": ["atom"],
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 2);
    chai.assert.sameMembers(resp["block:hover"], ["atom"]);
    chai.assert.sameMembers(resp["block:nth-child(2n + 1)"], ["atom"]);
  });

  it("should split multi-atoms", function() {
    var RULES = {
      "block:hover": ["atom", "atom2"]
    };

    resp = splitter.split(RULES);
    chai.assert.equal(Object.keys(resp).length, 1);
    chai.assert.sameMembers(resp["block:hover"], ["atom", "atom2"]);
  });
});

describe("Rewrite Tests", function() {
  it("should rewrite block with rule as atom extended sass", function() {
    var SPLIT_RULES = {
      "block:hover": ["atom"]
    };

    resp = splitter.rewrite(SPLIT_RULES);
    chai.assert.equal(Object.keys(resp).length, 1);
    chai.assert.sameMembers(resp, [".block:hover { @extend .atom; }"]);
  });

  it("should rewrite block with rules as atom extended sass", function() {
    var SPLIT_RULES = {
      "block:hover": ["atom", "atom2"]
    };

    resp = splitter.rewrite(SPLIT_RULES);
    chai.assert.equal(Object.keys(resp).length, 1);
    chai.assert.sameMembers(
        resp,
        [".block:hover { @extend .atom; @extend .atom2; }"]
      );
  });

  it("should rewrite blocks", function() {
    var SPLIT_RULES = {
      "block1:hover": ["atom"],
      "block2:hover": ["atom"]
    };

    resp = splitter.rewrite(SPLIT_RULES);
    chai.assert.equal(Object.keys(resp).length, 2);
    chai.assert.sameMembers(
        resp,
        [
          ".block1:hover { @extend .atom; }",
          ".block2:hover { @extend .atom; }"
        ]
      );
  });
});
