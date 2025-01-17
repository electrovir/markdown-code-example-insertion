import type {Node, Parent} from 'unist';
import {isHtmlNode, parseHtmlNode} from './parse-markdown.js';

export type WalkLanguages = 'markdown' | 'html';

/**
 * Fire callback on node and all children of node recursively.
 *
 * @param node The starting node
 * @param callback The callback to handle the node. If this returns something truthy, then the
 *   walking is immediately aborted.
 * @returns True is walking was aborted early due to the callback returning true for a node, false
 *   if it was not aborted.
 */
export function walk(
    node: Node | Parent,
    language: WalkLanguages,
    callback: (node: Node, language: WalkLanguages) => unknown,
): boolean {
    if (isHtmlNode(node)) {
        callback(node, 'markdown');
        const parsedHtmlNode = parseHtmlNode(node);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (parsedHtmlNode.children) {
            return parsedHtmlNode.children.some((htmlChild) => {
                return walk(htmlChild, 'html', callback);
            });
        }
    }

    if (callback(node, language)) {
        return true;
    }
    if ('children' in node) {
        return node.children.some((child) => {
            return walk(child, language, callback);
        });
    }

    return false;
}
