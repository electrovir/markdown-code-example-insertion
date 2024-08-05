import assert from 'node:assert/strict';
import {join} from 'node:path';
import {describe, it} from 'node:test';
import {extendingTsConfigDir, extendingTsConfigFiles, noSourceCodeDir} from '../repo-paths.js';
import {guessPackageIndex} from './package-index.js';

describe(guessPackageIndex.name, () => {
    it('resolves to index.ts', async () => {
        const guessedIndex = await guessPackageIndex(extendingTsConfigDir);

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'extending-ts-config',
            indexPath: join(extendingTsConfigFiles.sourceDir, 'index.ts'),
        });
    });

    it('uses the package dir as the rootDir when no root dir is given', async () => {
        const guessedIndex = await guessPackageIndex(
            noSourceCodeDir,
            {options: {outDir: join(noSourceCodeDir, 'blah')}},
            {name: 'test-name', main: 'blah/index.js'},
        );

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: join(noSourceCodeDir, 'index.ts'),
        });
    });

    it('guesses correct index.ts when all info is given', async () => {
        const guessedIndex = await guessPackageIndex(
            noSourceCodeDir,
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'test-name',
                main: 'dist/index.js',
            },
        );

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: join(noSourceCodeDir, 'src', 'index.ts'),
        });
    });

    it('reads the index from rootDir when no outDir exists', async () => {
        const guessedIndex = await guessPackageIndex(
            noSourceCodeDir,
            {options: {rootDir: join(noSourceCodeDir, 'blah')}},
            {name: 'test-name', main: 'blah/index.js'},
        );

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: join(noSourceCodeDir, 'blah', 'index.ts'),
        });
    });

    it('no mapping if no tsConfig dirs', async () => {
        const guessedIndex = await guessPackageIndex(
            noSourceCodeDir,
            {options: {}},
            {name: 'test-name', main: 'blah/index.js'},
        );

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: join(noSourceCodeDir, 'blah', 'index.ts'),
        });
    });

    it('no ts replacement if no tsconfig', async () => {
        const guessedIndex = await guessPackageIndex(noSourceCodeDir, undefined, {
            name: 'test-name',
            main: 'blah/index.js',
        });

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: join(noSourceCodeDir, 'blah', 'index.js'),
        });
    });

    it('defaults to just the package dir when nothing else was given', async () => {
        const guessedIndex = await guessPackageIndex(noSourceCodeDir, undefined, {
            name: 'test-name',
            main: undefined,
        });

        assert.deepStrictEqual(guessedIndex, {
            replaceName: 'test-name',
            indexPath: noSourceCodeDir,
        });
    });
});
