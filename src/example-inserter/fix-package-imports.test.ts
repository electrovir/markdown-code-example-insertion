import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {join} from 'node:path';
import {noSourceCodeDir} from '../repo-paths.js';
import {fixPackageImports} from './fix-package-imports.js';

describe(fixPackageImports.name, () => {
    it('fix index dir imports', async () => {
        const newCode = await fixPackageImports(
            `import blah from '../';`,
            join(noSourceCodeDir, 'src', 'readme-examples', 'derp.ts'),
            join(noSourceCodeDir),
            undefined,
            'TypeScript',
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'derp',
                main: 'dist/index.js',
            },
        );

        assert.strictEquals(newCode, `import blah from 'derp';`);
    });

    it('support index.js imports', async () => {
        const newCode = await fixPackageImports(
            `import blah from '../index.js';`,
            join(noSourceCodeDir, 'src', 'readme-examples', 'derp.ts'),
            join(noSourceCodeDir),
            undefined,
            'TypeScript',
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'derp',
                main: 'dist/index.js',
            },
        );

        assert.strictEquals(newCode, `import blah from 'derp';`);
    });

    it('fix index file imports with file name', async () => {
        const newCode = await fixPackageImports(
            `import blah from '../index';`,
            join(noSourceCodeDir, 'src', 'readme-examples', 'derp.ts'),
            join(noSourceCodeDir),
            undefined,
            'TypeScript',
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'derp',
                main: 'dist/index.js',
            },
        );

        assert.strictEquals(newCode, `import blah from 'derp';`);
    });

    it('fix index file imports no trailing slash', async () => {
        const newCode = await fixPackageImports(
            `import blah from '..';`,
            join(noSourceCodeDir, 'src', 'readme-examples', 'derp.ts'),
            join(noSourceCodeDir),
            undefined,
            'TypeScript',
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'derp',
                main: 'dist/index.js',
            },
        );

        assert.strictEquals(newCode, `import blah from 'derp';`);
    });

    it('fix index file imports and nothing else', async () => {
        const newCode = await fixPackageImports(
            `import blah from '..';
                    const thingie = ['yo hi there', 'hello to you too'];`,
            join(noSourceCodeDir, 'src', 'readme-examples', 'derp.ts'),
            join(noSourceCodeDir),
            undefined,
            'TypeScript',
            {
                options: {
                    outDir: 'dist',
                    rootDir: 'src',
                },
            },
            {
                name: 'derp',
                main: 'dist/index.js',
            },
        );

        assert.strictEquals(
            newCode,
            `import blah from 'derp';
                    const thingie = ['yo hi there', 'hello to you too'];`,
        );
    });
});
