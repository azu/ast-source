import fs from "fs"
import ASTParser from "../src/ASTParser"
import ASTSource from "../src/ASTSource"
import glob from "glob"
var files = glob.sync(__dirname + "/../src/**/*.js");
describe("ASTParser", function () {
    it("should parse self files", function () {
        files.forEach(filePath => {
            var content = fs.readFileSync(filePath, "utf-8");
            var source = new ASTSource(`
            import assert from "assert"
            `, {disableSourceMap: true});
            var output = source.output();
        })
    });
});

