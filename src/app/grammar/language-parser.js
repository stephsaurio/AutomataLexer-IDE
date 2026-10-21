class peg$SyntaxError extends SyntaxError {
  constructor(message, expected, found, location) {
    super(message);
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";
  }

  format(sources) {
    let str = "Error: " + this.message;
    if (this.location) {
      let src = null;
      const st = sources.find(s => s.source === this.location.source);
      if (st) {
        src = st.text.split(/\r\n|\n|\r/g);
      }
      const s = this.location.start;
      const offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
        ? this.location.source.offset(s)
        : s;
      const loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
      if (src) {
        const e = this.location.end;
        const filler = "".padEnd(offset_s.line.toString().length, " ");
        const line = src[s.line - 1];
        const last = s.line === e.line ? e.column : line.length + 1;
        const hatLen = (last - s.column) || 1;
        str += "\n --> " + loc + "\n"
            + filler + " |\n"
            + offset_s.line + " | " + line + "\n"
            + filler + " | " + "".padEnd(s.column - 1, " ")
            + "".padEnd(hatLen, "^");
      } else {
        str += "\n at " + loc;
      }
    }
    return str;
  }

  static buildMessage(expected, found) {
    function hex(ch) {
      return ch.codePointAt(0).toString(16).toUpperCase();
    }

    const nonPrintable = Object.prototype.hasOwnProperty.call(RegExp.prototype, "unicode")
      ? new RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "gu")
      : null;
    function unicodeEscape(s) {
      if (nonPrintable) {
        return s.replace(nonPrintable,  ch => "\\u{" + hex(ch) + "}");
      }
      return s;
    }

    function literalEscape(s) {
      return unicodeEscape(s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          ch => "\\x0" + hex(ch))
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => "\\x"  + hex(ch)));
    }

    function classEscape(s) {
      return unicodeEscape(s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          ch => "\\x0" + hex(ch))
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => "\\x"  + hex(ch)));
    }

    const DESCRIBE_EXPECTATION_FNS = {
      literal(expectation) {
        return "\"" + literalEscape(expectation.text) + "\"";
      },

      class(expectation) {
        const escapedParts = expectation.parts.map(
          part => (Array.isArray(part)
            ? classEscape(part[0]) + "-" + classEscape(part[1])
            : classEscape(part))
        );

        return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]" + (expectation.unicode ? "u" : "");
      },

      any() {
        return "any character";
      },

      end() {
        return "end of input";
      },

      other(expectation) {
        return expectation.description;
      },
    };

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      const descriptions = expected.map(describeExpectation);
      descriptions.sort();

      if (descriptions.length > 0) {
        let j = 1;
        for (let i = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }
}

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  const peg$FAILED = {};
  const peg$source = options.grammarSource;

  const peg$startRuleFunctions = {
    program: peg$parseprogram,
  };
  let peg$startRuleFunction = peg$parseprogram;

  const peg$c0 = "STACK";
  const peg$c1 = ";";
  const peg$c2 = "QUEUE";
  const peg$c3 = "LIST";
  const peg$c4 = "HASH";
  const peg$c5 = "TREE";
  const peg$c6 = "PUSH";
  const peg$c7 = "(";
  const peg$c8 = ",";
  const peg$c9 = ")";
  const peg$c10 = "POP";
  const peg$c11 = "ENQUEUE";
  const peg$c12 = "DEQUEUE";
  const peg$c13 = "INSERT";
  const peg$c14 = "REMOVE";
  const peg$c15 = "SET";
  const peg$c16 = "GET";
  const peg$c17 = "ROOT";
  const peg$c18 = "LEFT";
  const peg$c19 = "RIGHT";
  const peg$c20 = "GRAPH";
  const peg$c21 = "\"";
  const peg$c22 = "//";
  const peg$c23 = "/*";
  const peg$c24 = "*/";

  const peg$r0 = /^[a-zA-Z_]/;
  const peg$r1 = /^[a-zA-Z0-9_]/;
  const peg$r2 = /^[0-9]/;
  const peg$r3 = /^[^"]/;
  const peg$r4 = /^[ \t\r\n]/;
  const peg$r5 = /^[^\n]/;

  const peg$e0 = peg$literalExpectation("STACK", false);
  const peg$e1 = peg$literalExpectation(";", false);
  const peg$e2 = peg$literalExpectation("QUEUE", false);
  const peg$e3 = peg$literalExpectation("LIST", false);
  const peg$e4 = peg$literalExpectation("HASH", false);
  const peg$e5 = peg$literalExpectation("TREE", false);
  const peg$e6 = peg$literalExpectation("PUSH", false);
  const peg$e7 = peg$literalExpectation("(", false);
  const peg$e8 = peg$literalExpectation(",", false);
  const peg$e9 = peg$literalExpectation(")", false);
  const peg$e10 = peg$literalExpectation("POP", false);
  const peg$e11 = peg$literalExpectation("ENQUEUE", false);
  const peg$e12 = peg$literalExpectation("DEQUEUE", false);
  const peg$e13 = peg$literalExpectation("INSERT", false);
  const peg$e14 = peg$literalExpectation("REMOVE", false);
  const peg$e15 = peg$literalExpectation("SET", false);
  const peg$e16 = peg$literalExpectation("GET", false);
  const peg$e17 = peg$literalExpectation("ROOT", false);
  const peg$e18 = peg$literalExpectation("LEFT", false);
  const peg$e19 = peg$literalExpectation("RIGHT", false);
  const peg$e20 = peg$literalExpectation("GRAPH", false);
  const peg$e21 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false, false);
  const peg$e22 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false, false);
  const peg$e23 = peg$classExpectation([["0", "9"]], false, false, false);
  const peg$e24 = peg$literalExpectation("\"", false);
  const peg$e25 = peg$classExpectation(["\""], true, false, false);
  const peg$e26 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false, false);
  const peg$e27 = peg$literalExpectation("//", false);
  const peg$e28 = peg$classExpectation(["\n"], true, false, false);
  const peg$e29 = peg$literalExpectation("/*", false);
  const peg$e30 = peg$literalExpectation("*/", false);
  const peg$e31 = peg$anyExpectation();

  function peg$f0(statements) {    return statements.map(item => item[0]);  }
  function peg$f1(name) {    return statement("declare", { structure: "STACK", name });  }
  function peg$f2(name) {    return statement("declare", { structure: "QUEUE", name });  }
  function peg$f3(name) {    return statement("declare", { structure: "LIST", name });  }
  function peg$f4(name) {    return statement("declare", { structure: "HASH", name });  }
  function peg$f5(name) {    return statement("declare", { structure: "TREE", name });  }
  function peg$f6(name, value) {    return statement("PUSH", { name, value });  }
  function peg$f7(name) {    return statement("POP", { name });  }
  function peg$f8(name, value) {    return statement("ENQUEUE", { name, value });  }
  function peg$f9(name) {    return statement("DEQUEUE", { name });  }
  function peg$f10(name, value) {    return statement("INSERT", { name, value });  }
  function peg$f11(name, value) {    return statement("REMOVE", { name, value });  }
  function peg$f12(name, key, value) {    return statement("SET", { name, key, value });  }
  function peg$f13(name, key) {    return statement("GET", { name, key });  }
  function peg$f14(name, value) {    return statement("ROOT", { name, value });  }
  function peg$f15(name, parent, value) {    return statement("LEFT", { name, parent, value });  }
  function peg$f16(name, parent, value) {    return statement("RIGHT", { name, parent, value });  }
  function peg$f17(name) {    return statement("GRAPH", { name });  }
  function peg$f18(digits) {    return digits.join("");  }
  function peg$f19(chars) {    return chars.join("");  }
  let peg$currPos = options.peg$currPos | 0;
  let peg$savedPos = peg$currPos;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = peg$currPos;
  let peg$maxFailExpected = options.peg$maxFailExpected || [];
  let peg$silentFails = options.peg$silentFails | 0;

  let peg$result;

  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos,
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$getUnicode(pos = peg$currPos) {
    const cp = input.codePointAt(pos);
    if (cp === undefined) {
      return "";
    }
    return String.fromCodePoint(cp);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text, ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase, unicode) {
    return { type: "class", parts, inverted, ignoreCase, unicode };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description };
  }

  function peg$computePosDetails(pos) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {}
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column,
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos, offset) {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    const res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column,
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column,
      },
    };
    if (offset && peg$source && (typeof peg$source.offset === "function")) {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseprogram() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = [];
    s3 = peg$currPos;
    s4 = peg$parsestatement();
    if (s4 !== peg$FAILED) {
      s5 = peg$parse_();
      s4 = [s4, s5];
      s3 = s4;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$currPos;
      s4 = peg$parsestatement();
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        s4 = [s4, s5];
        s3 = s4;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
    }
    peg$savedPos = s0;
    s0 = peg$f0(s2);

    return s0;
  }

  function peg$parsestatement() {
    let s0;

    s0 = peg$parsestackDeclaration();
    if (s0 === peg$FAILED) {
      s0 = peg$parsequeueDeclaration();
      if (s0 === peg$FAILED) {
        s0 = peg$parselistDeclaration();
        if (s0 === peg$FAILED) {
          s0 = peg$parsehashDeclaration();
          if (s0 === peg$FAILED) {
            s0 = peg$parsetreeDeclaration();
            if (s0 === peg$FAILED) {
              s0 = peg$parsepushStatement();
              if (s0 === peg$FAILED) {
                s0 = peg$parsepopStatement();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseenqueueStatement();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parsedequeueStatement();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseinsertStatement();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseremoveStatement();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parsesetStatement();
                          if (s0 === peg$FAILED) {
                            s0 = peg$parsegetStatement();
                            if (s0 === peg$FAILED) {
                              s0 = peg$parserootStatement();
                              if (s0 === peg$FAILED) {
                                s0 = peg$parseleftStatement();
                                if (s0 === peg$FAILED) {
                                  s0 = peg$parserightStatement();
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$parsegraphStatement();
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsestackDeclaration() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c0) {
      s1 = peg$c0;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e0); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f1(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsequeueDeclaration() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c2) {
      s1 = peg$c2;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e2); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f2(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parselistDeclaration() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c3) {
      s1 = peg$c3;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e3); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f3(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsehashDeclaration() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c4) {
      s1 = peg$c4;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e4); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f4(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsetreeDeclaration() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e5); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f5(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsepushStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c6) {
      s1 = peg$c6;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f6(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsepopStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c10) {
      s1 = peg$c10;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e10); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c9;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c1;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e1); }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f7(s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseenqueueStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c11) {
      s1 = peg$c11;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e11); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f8(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedequeueStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e12); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c9;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c1;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e1); }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f9(s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseinsertStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c13) {
      s1 = peg$c13;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f10(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseremoveStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c14) {
      s1 = peg$c14;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e14); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f11(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsesetStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c15) {
      s1 = peg$c15;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e15); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 44) {
                s11 = peg$c8;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                s13 = peg$parsevalue();
                if (s13 !== peg$FAILED) {
                  s14 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s15 = peg$c9;
                    peg$currPos++;
                  } else {
                    s15 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e9); }
                  }
                  if (s15 !== peg$FAILED) {
                    s16 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s17 = peg$c1;
                      peg$currPos++;
                    } else {
                      s17 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e1); }
                    }
                    if (s17 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f12(s5, s9, s13);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsegetStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c16) {
      s1 = peg$c16;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e16); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f13(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parserootStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c17) {
      s1 = peg$c17;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e17); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s11 = peg$c9;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s13 = peg$c1;
                  peg$currPos++;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s13 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f14(s5, s9);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseleftStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c18) {
      s1 = peg$c18;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e18); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 44) {
                s11 = peg$c8;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                s13 = peg$parsevalue();
                if (s13 !== peg$FAILED) {
                  s14 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s15 = peg$c9;
                    peg$currPos++;
                  } else {
                    s15 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e9); }
                  }
                  if (s15 !== peg$FAILED) {
                    s16 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s17 = peg$c1;
                      peg$currPos++;
                    } else {
                      s17 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e1); }
                    }
                    if (s17 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f15(s5, s9, s13);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parserightStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c19) {
      s1 = peg$c19;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e19); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 44) {
            s7 = peg$c8;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parsevalue();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 44) {
                s11 = peg$c8;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                s13 = peg$parsevalue();
                if (s13 !== peg$FAILED) {
                  s14 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s15 = peg$c9;
                    peg$currPos++;
                  } else {
                    s15 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e9); }
                  }
                  if (s15 !== peg$FAILED) {
                    s16 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s17 = peg$c1;
                      peg$currPos++;
                    } else {
                      s17 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e1); }
                    }
                    if (s17 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f16(s5, s9, s13);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsegraphStatement() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c20) {
      s1 = peg$c20;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e20); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c7;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseidentifier();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c9;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c1;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e1); }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f17(s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsevalue() {
    let s0;

    s0 = peg$parsestring();
    if (s0 === peg$FAILED) {
      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parseidentifier();
      }
    }

    return s0;
  }

  function peg$parseidentifier() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = input.charAt(peg$currPos);
    if (peg$r0.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e21); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = input.charAt(peg$currPos);
      if (peg$r1.test(s4)) {
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e22); }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = input.charAt(peg$currPos);
        if (peg$r1.test(s4)) {
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e22); }
        }
      }
      s2 = [s2, s3];
      s1 = s2;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }

    return s0;
  }

  function peg$parsenumber() {
    let s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r2.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e23); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r2.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e23); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f18(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsestring() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c21;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e24); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r3.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e25); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r3.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e25); }
        }
      }
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c21;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e24); }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f19(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    let s0, s1;

    s0 = [];
    s1 = input.charAt(peg$currPos);
    if (peg$r4.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e26); }
    }
    if (s1 === peg$FAILED) {
      s1 = peg$parselineComment();
      if (s1 === peg$FAILED) {
        s1 = peg$parseblockComment();
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = input.charAt(peg$currPos);
      if (peg$r4.test(s1)) {
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e26); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$parselineComment();
        if (s1 === peg$FAILED) {
          s1 = peg$parseblockComment();
        }
      }
    }

    return s0;
  }

  function peg$parselineComment() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c22) {
      s1 = peg$c22;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e27); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r5.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e28); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r5.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e28); }
        }
      }
      s1 = [s1, s2];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseblockComment() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c23) {
      s1 = peg$c23;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e29); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c24) {
        s5 = peg$c24;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e30); }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = undefined;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e31); }
        }
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c24) {
          s5 = peg$c24;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e30); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = undefined;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e31); }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (input.substr(peg$currPos, 2) === peg$c24) {
        s3 = peg$c24;
        peg$currPos += 2;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e30); }
      }
      if (s3 !== peg$FAILED) {
        s1 = [s1, s2, s3];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }


  function statement(kind, values) {
    return Object.assign({ kind }, values);
  }

  peg$result = peg$startRuleFunction();

  const peg$success = (peg$result !== peg$FAILED && peg$currPos === input.length);
  function peg$throw() {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? peg$getUnicode(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
  if (options.peg$library) {
    return ({
      peg$result,
      peg$currPos,
      peg$FAILED,
      peg$maxFailExpected,
      peg$maxFailPos,
      peg$success,
      peg$throw: peg$success ? undefined : peg$throw,
    });
  }
  if (peg$success) {
    return peg$result;
  } else {
    peg$throw();
  }
}

const peg$allowedStartRules = [
  "program"
];

export {
  peg$allowedStartRules as StartRules,
  peg$SyntaxError as SyntaxError,
  peg$parse as parse
};
