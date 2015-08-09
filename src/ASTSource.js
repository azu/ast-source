// LICENSE : MIT
"use strict";
import assert from "assert"
import {adjustFilePath} from "./filepath-util"
import {generate} from "escodegen"
import ASTParser from "./ASTParser"
import ASTOutput from "./ASTOuput"
import ObjectAssign from "object-assign"
export {ParserTypes} from "./find-parser"
import ASTDataContainer from "./ASTContainer"
export {ASTDataContainer}
var debug = require("debug")("ASTSource");
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
    filePath: null,
    disableSourceMap: false,
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
    if (!options.disableSourceMap) {
        assert(typeof options.filePath === "string",
            "`options.filePath` is required for sourcemap support"
        );
    }
}
export default class ASTSource {
    constructor(code, options) {
        this.code = code;
        this.options = ObjectAssign({}, defaultOptions, options);
        validateCode(code);
        validateOptions(this.options);
        this.parser = new ASTParser(this.options);
        /** @type {Object} AST object */
        this.dataContainer = new ASTDataContainer(this.parse(this.code));
        debug("options: %o", this.options);
    }

    value() {
        return this.dataContainer.value;
    }

    /**
     * return cloned AST
     * @return {Object}
     */
    cloneValue() {
        return this.dataContainer.cloneValue();
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
        this.dataContainer.transform(transformFn);
        return this;
    }

    /**
     * @returns {ASTOutput}
     */
    output() {
        // when sourcemap is disable, only generate code
        if (this.options.disableSourceMap) {
            return new ASTOutput(generate(this.dataContainer.value, generateOption));
        }
        var generateOption = {
            sourceMap: this._sourceCodePath(),
            sourceContent: this.code,
            sourceMapWithCode: true
        };
        var {code, map} =  generate(this.dataContainer.value, generateOption);
        return new ASTOutput(code, map);
    }
}