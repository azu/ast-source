# ast-source [![Build Status](https://travis-ci.org/azu/ast-source.svg?branch=master)](https://travis-ci.org/azu/ast-source)

AST helper to transform source code.

On purpose make you focus to develop AST transforming function.

## Installation

    npm install ast-source

## Usage

See [example](./example).
 
Run `npm test` on `example/`

```js
import ASTSource from "ast-source"
import estraverse from "estraverse"
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
console.dir(output.map.toString()); // => source map
fs.writeFileSync("./output.js", output.codeWithMap, "utf-8");

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