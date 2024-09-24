import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {fixCodeIndents} from './code-indent.js';

describe(fixCodeIndents.name, () => {
    it('should add an indent', () => {
        const replacedLines = fixCodeIndents('a b c d e', ' ');

        assert.strictEquals(replacedLines, ' a b c d e');
    });
});
