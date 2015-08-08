// LICENSE : MIT
"use strict";
import ASTSource from "ast-source"
import estraverse from "estraverse"
import convert from "convert-source-map"
import fs from "fs"

function transform(AST) {
    var replaced = {
        "type": "Literal",
        "value": 42,
        "raw": "42"
    };
    return estraverse.replace(AST, {
        enter: function (node) {
            if (node.type === estraverse.Syntax.Literal) {
                return replaced;
            }
        }
    });
}

var source = new ASTSource(fs.readFileSync("./input.js", "utf-8"), {
    filePath: "./input.js"
});
var output = source.transform(transform).output();
console.log(output.code);// => 20
console.dir(output.map.toString());// => sourcemap
var comment = convert.fromObject(output.map).toComment();
fs.writeFileSync("./output.js", output.code + "\n" + comment, "utf-8");
