import assert from 'node:assert/strict';
import {join} from 'node:path';
import {describe, it} from 'node:test';
import {fullPackageExampleDir, noSourceCodeDir} from '../repo-paths.js';
import {readPackageDetails} from './parse-package-json.js';

describe(readPackageDetails.name, () => {
    it('reads package json details', async () => {
        const packageDetails = await readPackageDetails(fullPackageExampleDir);

        assert.deepStrictEqual(packageDetails, {
            packageName: 'full-package-example',
            mainPath: join(fullPackageExampleDir, 'dist', 'index.js'),
        });
    });

    it('returns empty properties when no package.json', async () => {
        const packageDetails = await readPackageDetails(noSourceCodeDir);

        assert.deepStrictEqual(packageDetails, {
            packageName: undefined,
            mainPath: undefined,
        });
    });
});
