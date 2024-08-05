import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {extendingTsConfigDir, extendingTsConfigFiles, noSourceCodeDir} from '../repo-paths.js';
import {getTsDirs} from './parse-tsconfig.js';

describe(getTsDirs.name, () => {
    it('reads tsconfig options that are extended', () => {
        const tsConfigDetails = getTsDirs(extendingTsConfigDir);

        assert.deepStrictEqual(tsConfigDetails, {
            source: extendingTsConfigFiles.sourceDir,
            output: extendingTsConfigFiles.distDir,
        });
    });

    it('reads undefined when no tsconfig exists in the given directory', () => {
        const tsConfigDetails = getTsDirs(noSourceCodeDir);

        assert.strictEqual(tsConfigDetails, undefined);
    });
});
