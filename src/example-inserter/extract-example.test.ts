import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {assertThrows} from 'run-time-assertions';
import {CodeExampleFileMissingError} from '../errors/code-example-file-missing.error.js';
import {CodeExampleLink} from '../parsing-markdown/extract-links.js';
import {noSourceCodeFiles} from '../repo-paths.js';
import {extractExamplePath} from './extract-example.js';

describe(extractExamplePath.name, () => {
    it('correctly checks links relative to the given markdown file', () => {
        const paths = extractExamplePath(noSourceCodeFiles.linkPaths, {
            linkPath: 'comment.md',
        } as CodeExampleLink);

        assert.strictEqual(paths, noSourceCodeFiles.comment);
    });

    it('correctly checks links relative to the given markdown file 2', () => {
        const paths = extractExamplePath(noSourceCodeFiles.linkPaths, {
            linkPath: 'invalid-link-comments.md',
        } as CodeExampleLink);

        assert.strictEqual(paths, noSourceCodeFiles.invalidLinkComments);
    });

    it('errors when files are missing', () => {
        assertThrows(
            () => {
                extractExamplePath(noSourceCodeFiles.linkPaths, {
                    linkPath: 'this-does-not-exist',
                } as CodeExampleLink);
            },
            {
                matchConstructor: CodeExampleFileMissingError,
            },
        );
    });
});
