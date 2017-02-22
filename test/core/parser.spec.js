import{expect, assert, should} from 'chai'

import {excelClipboardToJson, jsonExcelClipboard} from '../../src/app/core/utils/parsing'


let mock = null;

describe('Parser functions', () => {
    it('excelClipboardToJson() -> parser from a clipboard Excel', () => {
        var excelValues = [
            "1\t2\t3\n2\t3\t4\n3\t4\t5\n",
            "1\n2\n3\n",
            "1\t2\t3\n",
            "3\n",
            "3",
        ]
        var jsonValues = [
            [["1","2","3"],["2","3","4"],["3","4","5"]],
            [["1"],["2"],["3"]],
            [["1","2","3"]],
            false,
            false,
        ]
        var textDescription = [
            "array 3*3",
            "only 1 collumn 3*1",
            "only row 1*3",
            "copy one cell in a excel file, not working",
            "copy one random value, not working",
        ]

        excelValues.map((value, index) => {
            assert.deepEqual(excelClipboardToJson(excelValues[index]), jsonValues[index], textDescription[index]);
        })

    });
    it('jsonExcelClipboard() -> parser from table  to clipboard Excel', () => {
        var excelValues = [
            "1\t2\t3\n2\t3\t4\n3\t4\t5\n",
            "1\n2\n3\n",
            "1\t2\t3\n",
            false,
            false,
        ]
        var jsonValues = [
            [["1","2","3"],["2","3","4"],["3","4","5"]],
            [["1"],["2"],["3"]],
            [["1","2","3"]],
            "azdaad",
            22,
        ]
        var textDescription = [
            "array 3*3",
            "only 1 collumn 3*1",
            "only row 1*3",
            "copy only text, not working",
            "copy one random number, not working",
        ]

        jsonValues.map((value, index) => {

            if (index > 2) {
                console.log(jsonExcelClipboard(jsonValues[index]))
                console.log(excelValues[index])
                assert.deepEqual(jsonExcelClipboard(jsonValues[index]), excelValues[index], textDescription[index]);
            }
        })

    });
});
