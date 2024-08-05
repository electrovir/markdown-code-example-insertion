import {addSuffix, mapObjectValues, removeColor} from '@augment-vir/common';
import {interpolationSafeWindowsPath, runShellCommand, ShellOutput} from '@augment-vir/node-js';
import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {join, sep} from 'node:path';
import {describe, it, TestContext} from 'node:test';
import {isRunTimeType} from 'run-time-assertions';
import {forceIndexTrigger} from './cli.js';
import {
    forcedIndexExampleDir,
    fullPackageExampleDir,
    fullPackageExampleFiles,
    repoRootDir,
} from './repo-paths.js';

async function runCli(
    context: TestContext,
    {
        args,
        dir,
        shouldPass,
    }: {
        args: string[];
        dir: string;
        expectationKey: string;
        shouldPass: boolean;
    },
) {
    const cliBinPath = join(process.cwd(), 'dist', 'cli.js');
    const commandToRun = interpolationSafeWindowsPath(`node ${cliBinPath} ${args.join(' ')}`);

    const result: Partial<ShellOutput> = await runShellCommand(commandToRun, {
        cwd: dir,
    });

    delete result.error;
    delete result.exitSignal;

    // @ts-expect-error: this type isn't included in @types/node yet
    context.assert.snapshot(
        mapObjectValues(result, (key, value) => {
            if (isRunTimeType(value, 'string')) {
                return removeColor(value).replaceAll(
                    addSuffix({value: repoRootDir, suffix: sep}),
                    '',
                );
            } else {
                return value;
            }
        }),
    );

    if (shouldPass) {
        assert.strictEqual(result.exitCode, 0, 'command should have passed');
    } else {
        assert.notStrictEqual(result.exitCode, 0, 'command should have failed');
    }
}

describe('cli.js', () => {
    it('should produce correct output when a check passes', async (context) => {
        await runCli(context, {
            args: [
                fullPackageExampleFiles.readmeExpectation,
                '--check',
            ],
            dir: fullPackageExampleDir,
            expectationKey: 'successful check',
            shouldPass: true,
        });
    });

    it('should produce correct output when a check fails', async (context) => {
        await runCli(context, {
            args: [
                join(fullPackageExampleDir, '*.md'),
                '--check',
            ],
            dir: fullPackageExampleDir,
            expectationKey: 'failed check',
            shouldPass: false,
        });
    });

    it('supports forced index flag', async (context) => {
        const completeMarkdownPath = join(forcedIndexExampleDir, 'complete.md');
        const incompleteMarkdownPath = join(forcedIndexExampleDir, 'incomplete.md');
        const incompleteContentsBeforeFixing = (await readFile(incompleteMarkdownPath)).toString();
        try {
            await runCli(context, {
                args: [
                    completeMarkdownPath,
                    '--check',
                    forceIndexTrigger,
                    'src/derp.ts',
                ],
                dir: forcedIndexExampleDir,
                expectationKey: 'forced-index-complete',
                shouldPass: true,
            });

            const completeContents = (await readFile(completeMarkdownPath)).toString();

            await runCli(context, {
                args: [
                    incompleteMarkdownPath,
                    forceIndexTrigger,
                    'src/derp.ts',
                ],
                dir: forcedIndexExampleDir,
                expectationKey: 'forced-index-incomplete-fix',
                shouldPass: true,
            });

            const incompleteContentsAfterFixing = (
                await readFile(incompleteMarkdownPath)
            ).toString();

            assert.strictEqual(incompleteContentsAfterFixing, completeContents);
        } finally {
            await writeFile(incompleteMarkdownPath, incompleteContentsBeforeFixing);

            await runCli(context, {
                args: [
                    incompleteMarkdownPath,
                    '--check',
                    forceIndexTrigger,
                    'src/derp.ts',
                ],
                dir: forcedIndexExampleDir,
                expectationKey: 'forced-index-incomplete-reverted',
                shouldPass: false,
            });
        }
    });
});