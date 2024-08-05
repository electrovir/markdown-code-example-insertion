import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {fixCodeIndents} from './code-indent.js';

describe(fixCodeIndents.name, () => {
    it('should add an indent', () => {
        const replacedLines = fixCodeIndents('a b c d e', ' ');

        assert.strictEqual(replacedLines, ' a b c d e');
    });
});
