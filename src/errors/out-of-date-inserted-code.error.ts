import {MarkdownCodeExampleInserterError} from './markdown-code-example-inserter.error.js';

/**
 * Indicates that a markdown file's examples are out of date.
 *
 * @category Errors
 */
export class OutOfDateInsertedCodeError extends MarkdownCodeExampleInserterError {
    public override name = 'OutOfDateInsertedCodeError';
}
