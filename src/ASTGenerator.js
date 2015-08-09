// LICENSE : MIT
"use strict";
import assert from "assert"
import {generate} from "escodegen"
import {adjustFilePath} from "./filepath-util"
export default class ASTGenerator {
    /**
     * @param {ASTSourceOptions} options
     */
    constructor(options) {
        /**
         * @type {ASTSourceOptions}
         */
        this.options = options;
    }

    _sourceCodePath() {
        return adjustFilePath(this.options.filePath, this.options.sourceRoot)
    }

    /**
     * generate code(only)
     * @param {Object}AST
     * @returns {string}
     */
    generateCode(AST) {
        let code = generate(AST, {
            comment: this.options.comment
        });
        return code;
    }

    /**
     * generate code and source map
     * @param {Object} AST
     * @param {{sourceContent: string}} sourceContent sourceContent is original code for SourceMap
     * @returns {{code: string, map: Object}}
     */
    generateCodeWithMap(AST, {sourceContent}) {
        assert(sourceContent != null, "sourceContent is required. `generate(AST, {sourceContent})`");
        var generateOption = {
            comment: this.options.comment,
            sourceMap: this._sourceCodePath(),
            sourceContent: sourceContent,
            sourceMapWithCode: true
        };
        var {code, map} =  generate(AST, generateOption);
        return {code, map};
    }
}