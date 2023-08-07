#!/usr/bin/env node

'use strict';

import path from 'path';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

import { merge } from '../lib/merge.mjs';

/**
 * Usage:
 * node bin/merge.js 1.xlsx 2.xlsx
 */
const [...xlsxFiles] = process.argv.slice(2);

if (xlsxFiles.length < 2) {
    console.error(`Must pass more than 2 xlsx files`);
    console.error(`Usage:`);
    console.error(`    merge_excel 1.xlsx 2.xlsx`)
    process.exit(1);
}

const buffer = await merge(xlsxFiles);

const [firstXlsx] = xlsxFiles;
const outputFilePrefix = path.basename(firstXlsx, '.xlsx');
const outputFilePath = path.join(process.cwd(), `${outputFilePrefix}.merged.xlsx`);

await writeFileAsync(outputFilePath, buffer);
console.log(`The file was written at: ${outputFilePath}`);
