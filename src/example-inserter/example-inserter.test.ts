import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {describe, it} from 'node:test';
import {fullPackageExampleDir, fullPackageExampleFiles} from '../repo-paths.js';
import {generateAllExamples, isCodeUpdated} from './example-inserter.js';

describe(generateAllExamples.name, () => {
    it('should inserts examples into markdown file with no code blocks', async () => {
        const codeInsertedMarkdown = await generateAllExamples(
            fullPackageExampleFiles.readme,
            fullPackageExampleDir,
            undefined,
        );

        const expectation = (await readFile(fullPackageExampleFiles.readmeExpectation)).toString();

        assert.strictEqual(codeInsertedMarkdown, expectation);
    });
});

describe(isCodeUpdated.name, () => {
    it('should read out of date markdown as outdated', async () => {
        const updated = await isCodeUpdated(
            fullPackageExampleFiles.readme,
            fullPackageExampleDir,
            undefined,
        );

        assert.strictEqual(updated, false);
    });

    it('should read updated markdown as updated', async () => {
        const updated = await isCodeUpdated(
            fullPackageExampleFiles.readmeExpectation,
            fullPackageExampleDir,
            undefined,
        );

        assert.strictEqual(updated, true);
    });
});
