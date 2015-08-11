// LICENSE : MIT
"use strict";
import path from "path"
import assert from "assert"
import pathExists from "path-exists"
var packageName = require("../package.json").name;

export function findPackageDir(paths) {
    if (!paths) {
        return null;
    }
    for (var i = 0; i < paths.length; ++i) {
        var node_modulesPath = paths[i];
        if (!pathExists.sync(node_modulesPath)) {
            continue;
        }
        var dir = path.dirname(node_modulesPath);
        var dirName = dir.split(path.sep).pop();
        if (dirName !== packageName) {
            return dir;
        }
    }
}
/**
 * find package.json directory and return package json.
 * You should pass `module.paths` to `paths`.
 * @param {string[]} paths the paths for look-up
 * @returns {object|null}
 */
export function getPackageJSON(paths) {
    var processPackageJSON = path.join(process.cwd(), "package.json");
    if (pathExists.sync(processPackageJSON)) {
        return require(processPackageJSON);
    }
    var dir = findPackageDir(paths);
    if (dir) {
        return require(path.resolve(dir, "package.json"));
    } else {
        return null;
    }
}