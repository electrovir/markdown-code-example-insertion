import type {Node} from 'unist';
import {MarkdownCodeExampleInserterError} from './markdown-code-example-inserter.error.js';

/**
 * Indicates that an invalid AST node was encountered while parsing a markdown file.
 *
 * @category Errors
 */
export class InvalidNodeError extends MarkdownCodeExampleInserterError {
    public override name = 'InvalidNodeError';
    constructor(node: Node, reason: string) {
        super(`Invalid node (of type '${node.type}'), ${reason}: ${JSON.stringify(node)}`);
    }
}
