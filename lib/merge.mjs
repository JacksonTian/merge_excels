'use strict';

import fs from 'fs';
import util from 'util';

const readFileAsync = util.promisify(fs.readFile);

import xlsx from 'node-xlsx';

export async function merge(xlsxFiles) {
    const [firstXlsx, ...others] = xlsxFiles;

    const xlsxBuffer = await readFileAsync(firstXlsx);
    const [sheet1] = xlsx.parse(xlsxBuffer);

    const [titleLine, ...lines] = sheet1.data;
    const output = [titleLine];
    
    lines.forEach(d => {
        output.push(d);
    });
    
    for (let i = 0; i < others.length; i++) {
        const filePath = others[i];
        const xlsxBuffer = await readFileAsync(filePath);
        const [sheet0] = xlsx.parse(xlsxBuffer);
        const [titleLine, ...lines] = sheet0.data;
        lines.forEach(d => {
            output.push(d);
        });
    }

    // TODO: the titles of xlsx should be same

    return xlsx.build([
        {
            name: sheet1.name,
            data: output
        }
    ]);
};
