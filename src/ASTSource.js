// LICENSE : MIT
"use strict";
import assert from "assert"
import {adjustFilePath} from "./filepath-util"
import {generate} from "escodegen"
import espurify from"espurify"
import ASTParser from "./ASTParser"
import ObjectAssign from "object-assign"
export {ParserTypes} from "./find-parser"
var debug = require("debug")("ASTSource");
/**
 * @type {Object} outputObject
 * @property {string} outputObject.code
 * @property {Object} outputObject.map
 */
/**
 * @namespace
 * @type {Object} ASTSourceOptions
 * @property {string} ASTSourceOptions.filePath path to source code
 * @property {string} ASTSourceOptions.sourceRoot? source root path to source code
 * @property {parserType} ASTSourceOptions.parserType? what parser is used
 * @property {boolean} ASTSourceOptions.esprimaTokens? tokens
 * @property {boolean} ASTSourceOptions.range? range
 * @property {boolean} ASTSourceOptions.loc? location
 * @property {boolean} ASTSourceOptions.comment?
 */
const defaultOptions = {
    parserType: null,
    esprimaTokens: true,
    loc: true,
    range: true,
    comment: true
};
export function validateCode(code) {
    assert(typeof code !== "undefined");
}
export function validateOptions(options) {
    assert(typeof options.filePath === "string");
}
export default class ASTSource {
    constructor(code, options) {
        validateCode(code);
        validateOptions(options);
        this.code = code;
        this.options = ObjectAssign({}, defaultOptions, options);
        this.parser = new ASTParser(this.options);
        /** @type {Object} AST object */
        this.value = this.parse(this.code);
        debug("options: %o", this.options);
    }

    /**
     * return cloned AST
     * @return {Object}
     */
    cloneValue() {
        return espurify(this.value);
    }

    parse(code) {
        return this.parser.parse(code);
    }

    _sourceCodePath() {
        return adjustFilePath(this.options.filePath, this.options.sourceRoot)
    }

    /**
     * transform AST by transformFn.
     * @param {function} transformFn
     * @example
     * function transformFn(AST){
     *  return modify(AST)
     * }
     * source.transform(transformFn);
     */
    transform(transformFn) {
        var result = transformFn(this.value);
        assert(result != null && typeof result === "object", "transform function should not return null result");
        this.value = result;
        return this;
    }

    /**
     * @returns {outputObject}
     */
    output() {
        var generateOption = {
            sourceMap: this._sourceCodePath(),
            sourceContent: this.code,
            sourceMapWithCode: true
        };
        return generate(this.value, generateOption);
    }
}