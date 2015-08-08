import assert from "power-assert"
import ASTSource from "../src/ASTSource"
import {ParserTypes} from "../src/ASTSource"
import {toAssertFromAST} from "comment-to-assert"

describe("ASTSource", () => {
    describe("Constructor", function () {
        it("throw error on no options", function () {
            assert.throws(function () {
                new ASTSource("var a;");
            }, Error);
        });
        it("should pass options that has `filePath`", function () {
            var source = new ASTSource("var a;", {
                filePath: "file.js"
            });
            assert(source instanceof ASTSource);
        });
    });

    describe("#parse", function () {
        it("should parse source code", function () {
            var source = new ASTSource("var a = 1", {
                filePath: "file.js",
                parserType: ParserTypes.Babylon
            });
            assert(source.value);
            var AST = source.parse("var b");
            assert(typeof AST !== "undefined");
        });
        it("should use parser by defined parserType", function () {
            var source = new ASTSource("var jsx = <div></div>", {
                filePath: "file.js",
                parserType: ParserTypes.Babylon
            });
            assert(source.value);
        });
    });
    describe("#transform", function () {
        it("should update .value", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            var beforeValue = source.cloneValue();
            source.transform(toAssertFromAST);
            var afterValue = source.cloneValue();
            assert.notDeepEqual(beforeValue, afterValue);
        });
        it("should pass AST to transform function", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            source.transform(function (AST) {
                assert(typeof AST !== "undefined");
                return AST;
            });
        });
        it("transform return null then throw Error", function () {
            var source = new ASTSource("1;// => 1", {
                filePath: "file.js"
            });
            assert.throws(function () {
                source.transform(function () {
                    // too bad
                    return null;
                });
            }, Error);
        });
    });
    describe("#output", function () {
        it("should return Object", function () {
            var source = new ASTSource("var a;", {
                filePath: "file.js"
            });
            var result = source.output();
            assert(result.code != null);
            assert(result.map != null);
        });
    });
});
