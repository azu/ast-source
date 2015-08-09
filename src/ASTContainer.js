// LICENSE : MIT
"use strict";
import assert from "assert"
import espurify from"espurify"
/**
 * ASTDataContainer has AST as `value` and transform `value`
 */
export default class ASTPipe {
    constructor(ast) {
        this.value = ast;
    }

    cloneValue() {
        return espurify(this.value);
    }

    transform(transformFn) {
        var result = transformFn(this.value);
        assert(result != null && typeof result === "object", "transform function should not return null");
        this.value = result;
    }
}