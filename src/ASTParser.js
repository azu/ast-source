// LICENSE : MIT
"use strict";
import {ParserTypes,findParserType} from "./find-parser"
import esprima from "esprima"
// FIXME: why import wrong for espower-babel?
const babel = require("babel-core");
import acornToEsprima from "./acorn-to-esprima"
function attachComments(ast, comments, tokens) {
    if (comments.length) {
        var firstComment = comments[0];
        var lastComment = comments[comments.length - 1];
        // fixup program start
        if (!tokens.length) {
            // if no tokens, the program starts at the end of the last comment
            ast.start = lastComment.end;
            ast.loc.start.line = lastComment.loc.end.line;
            ast.loc.start.column = lastComment.loc.end.column;
        } else if (firstComment.start < tokens[0].start) {
            // if there are comments before the first token, the program starts at the first token
            var token = tokens[0];
            ast.start = token.start;
            ast.loc.start.line = token.loc.start.line;
            ast.loc.start.column = token.loc.start.column;

            // estraverse do not put leading comments on first node when the comment
            // appear before the first token
            if (ast.body.length) {
                var node = ast.body[0];
                node.leadingComments = [];
                var firstTokenStart = token.start;
                var len = comments.length;
                for (var i = 0; i < len && comments[i].start < firstTokenStart; i++) {
                    node.leadingComments.push(comments[i]);
                }
            }
        }
        // fixup program end
        if (tokens.length) {
            var lastToken = tokens[tokens.length - 1];
            if (lastComment.end > lastToken.end) {
                // If there is a comment after the last token, the program ends at the
                // last token and not the comment
                ast.end = lastToken.end;
                ast.loc.end.line = lastToken.loc.end.line;
                ast.loc.end.column = lastToken.loc.end.column;
            }
        }
    }
}

export default class ASTParser {
    /**
     * @param {ASTSourceOptions} options
     */
    constructor(options) {
        this.options = options;
        // default parser: esprima
        this.type = ParserTypes.Esprima;
        if (options.parserType) {
            this.type = options.parserType
        } else {
            let type = findParserType();
            if (type !== ParserTypes.Unknown) {
                this.type = type
            }
        }
    }

    /**
     * change parser type
     * @param {ParserTypes} type
     */
    setType(type) {
        this.type = type;
    }

    parse(code) {
        if (this.type === ParserTypes.Esprima) {
            return this._parseByEsprima(code, this.options);
        } else if (this.type === ParserTypes.Babylon) {
            return this._parseByBabel(code, this.options);
        }
        throw new Error("unreachable #parse");
    }

    /**
     * @param code
     * @param {ASTSourceOptions} options
     * @returns {Object}
     * @private
     */
    _parseByEsprima(code, options) {
        var esprimaOptions = {
            loc: options.loc,
            range: options.range,
            comment: options.comment,
            attachComment: options.comment,
            tokens: options.esprimaTokens
        };
        return esprima.parse(code, esprimaOptions);
    }


    _parseByBabel(code, options) {
        var babylonOptions = {
            locations: options.loc,
            ranges: options.range
        };
        var comments = babylonOptions.onComment = [];
        var tokens = babylonOptions.onToken = [];
        var ast = babel.parse(code, babylonOptions);
        if (options.comment) {
            // add comments
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i];
                if (comment.type === "CommentBlock") {
                    comment.type = "Block";
                } else if (comment.type === "CommentLine") {
                    comment.type = "Line";
                }
            }
            ast.comments = comments;
        }
        // acorn to esprima
        if (options.esprimaTokens) {
            // convert tokens
            ast.tokens = acornToEsprima.toTokens(tokens);
            attachComments(ast, comments, ast.tokens);

            // transform esprima and acorn divergent nodes
            acornToEsprima.toAST(ast);
        }
        return ast;
    }
}