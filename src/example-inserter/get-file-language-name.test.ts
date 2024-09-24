import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {getFileLanguageName} from './get-file-language-name.js';

describe(getFileLanguageName.name, () => {
    it('gets correct file name for common file extensions', () => {
        assert.deepEquals(
            [
                'index.js',
                'index.ts',
                'index.rb',
                'index.md',
                'index.py',
                'index.cpp',
                'index.c',
                'index.java',
                'index.json',
                'index.yml',
                'index.xml',
            ].map((fileName) => getFileLanguageName(fileName)?.toLowerCase()),
            [
                'javascript',
                'typescript',
                'ruby',
                'markdown',
                'python',
                'c++',
                'c',
                'java',
                'json',
                'yaml',
                'xml',
            ],
        );
    });
});
