// LICENSE : MIT
"use strict";
import convert from "convert-source-map"
export default class ASTOutput {
    constructor(code, map) {
        this._code = code;
        this._map = map;
    }

    get code() {
        return this._code;
    }

    get map() {
        return this._map;
    }

    get codeWithMap() {
        return this.code + "\n" + convert.fromObject(this.map).toComment();
    }
}