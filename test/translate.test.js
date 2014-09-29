// Integeration

var chai = require("chai");
var translate = require("../src/atom").translate;

describe("Translate", function() {
  describe("Block/Rule Matching", function() {
    it("should translate blank string", function() {
      var resp = translate("");
      chai.assert.equal(Object.keys(resp).length, 0);
    });

    it("should error on block without atomset", function() {
      var cb = function() {
        translate("block");
      };

      // TODO: Figure out how to test SyntaxError.
      chai.assert.throws(cb, Error);
    });

    // Is this really logical?
    it("should be empty object with empty block", function() {
      var resp = translate("block{\n}");
      chai.assert.equal(Object.keys(resp).length, 0);
    });

    it("should translate block atoms into key: [atoms]", function() {
      var resp = translate("block{atom;}");
      chai.assert.equal(Object.keys(resp).length, 1);
      chai.assert.sameMembers(resp.block, ["atom"]);
    });

    it("should translate block with multiple atoms", function() {
      var resp = translate("block{atom;atom2;}");
      chai.assert.equal(Object.keys(resp).length, 1);
      chai.assert.sameMembers(resp.block, ["atom", "atom2"]);
    });

    it("should translate block with nested block", function() {
      var resp = translate("block{__element{element-atom;}block-atom;}");
      chai.assert.equal(Object.keys(resp).length, 2);
      chai.assert.sameMembers(resp.block, ["block-atom"]);
      chai.assert.sameMembers(resp.block__element, ["element-atom"]);
    });

    it("should translate nested block with multiple atoms", function() {
      var resp = translate("block{__element{e-atom1;e-atom2;}}");
      chai.assert.equal(Object.keys(resp).length, 1);
      chai.assert.sameMembers(resp.block__element, ["e-atom1", "e-atom2"]);
    });

    it("should translate multiple blocks", function() {
      var resp = translate("block1{atom;}block2{atom;}");
      chai.assert.equal(Object.keys(resp).length, 2);
      chai.assert.sameMembers(resp.block1, ["atom"]);
      chai.assert.sameMembers(resp.block2, ["atom"]);
    });
  });

  describe("Block matching", function() {
    describe("Bad start characters", function() {
      it("should fail on \".\"", function() {
        var cb = function() {
          translate(".class{atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on \"#\"", function() {
        var cb = function() {
          translate("#id{atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on \"[data]\"", function() {
        var cb = function() {
          translate("[data]{atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on \"[data=value]\"", function() {
        var cb = function() {
          translate("[data=value]{atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on integer", function() {
        var cb = function() {
          translate("1block{atom;}");
        };

        chai.assert.throws(cb, Error);
      });
    });

    describe("Bad characters", function() {
      it("should fail on terminal-colon", function() {
        var cb = function() {
          translate("block:{atom;}");
        };

        chai.assert.throws(cb, Error);
      });
    });

    describe("Whitespace independent", function() {
      it("should translate spaced block", function() {
        var resp = translate(" block{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate tabbed block", function() {
        var resp = translate("\tblock{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate new-lined block", function() {
        var resp = translate("\nblock{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate multi-space before", function() {
        var resp = translate(" \n\tblock{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-spaced block", function() {
        var resp = translate("block {atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-tabbed block", function() {
        var resp = translate("block\t{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-new-lined block", function() {
        var resp = translate("block\n{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate multi-space after", function() {
        var resp = translate("block \n\t{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });
    });

    describe("Valid blocks", function() {
      it("should translate dashed block", function() {
        var resp = translate("--modifier{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp["--modifier"], ["atom"]);
      });

      it("should translate underscored block", function() {
        var resp = translate("__element{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.__element, ["atom"]);
      });

      it("should translate capital block", function() {
        var resp = translate("BLOCK{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.BLOCK, ["atom"]);
      });

      it("should translate integers block", function() {
        var resp = translate("block1{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block1, ["atom"]);
      });

      it("should translate CSS3 without expression", function() {
        var resp = translate("block:hover{atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp["block:hover"], ["atom"]);
      });

      it("should translate CSS3 with expression", function() {
        var resp = translate("block:nth-child(2n + 1){atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp["block:nth-child(2n + 1)"], ["atom"]);
      });
    });
  });

  describe("Rule matching", function() {
    describe("Bad start characters", function() {
      it("should fail on \".\"", function() {
        var cb = function() {
          translate("block{.atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on \"#\"", function() {
        var cb = function() {
          translate("block{#atom;}");
        };

        chai.assert.throws(cb, Error);
      });

      it("should fail on integer", function() {
        var cb = function() {
          translate("block{1atom;}");
        };

        chai.assert.throws(cb, Error);
      });
    });

    describe("Whitespace independent", function() {
      it("should translate spaced rule", function() {
        var resp = translate("block{ atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate tabbed rule", function() {
        var resp = translate("block{\tatom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate new-lined rule", function() {
        var resp = translate("block{\natom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate multi-space before", function() {
        var resp = translate("block{ \n\tatom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-spaced block", function() {
        var resp = translate("block{atom; }");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-tabbed block", function() {
        var resp = translate("block{atom;\t}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate post-new-lined block", function() {
        var resp = translate("block{atom;\n}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });

      it("should translate multi-space after", function() {
        var resp = translate("block{atom; \n\t}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom"]);
      });
    });

    describe("Valid atoms", function() {
      it("should translate dashed atoms", function() {
        var resp = translate("block{--atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["--atom"]);
      });

      it("should translate underscored block", function() {
        var resp = translate("block{__atom;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["__atom"]);
      });

      it("should translate capital atom", function() {
        var resp = translate("block{ATOM;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["ATOM"]);
      });

      it("should translate integers block", function() {
        var resp = translate("block{atom1;}");
        chai.assert.equal(Object.keys(resp).length, 1);
        chai.assert.sameMembers(resp.block, ["atom1"]);
      });
    });
  });
});
