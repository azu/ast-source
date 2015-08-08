# ast-source

AST helper to transform source code.

On purpose make you focus to develop AST transforming function.

## Installation

    npm install ast-source

## Usage

See [example](./example).
 
Run `npm test` on `example/`

```js
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
console.log(output.code);// => "var a = 42;"
console.dir(output.map.toString());// => source map
var comment = convert.fromObject(output.map).toComment();
fs.writeFileSync("./output.js", output.code + "\n" + comment, "utf-8");
// input.js -> output.js with sourcemap
```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT