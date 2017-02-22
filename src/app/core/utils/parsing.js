const breakLine = "\n",
    tabulation = "\t"

export function excelClipboardToJson(clipboard) {
    try {
        let data = clipboard.split(breakLine)
        var clipboardJson =
            data.map((row, indexR) => row.split(tabulation)
                .map(value => isNaN(parseFloat(value)) ? "0" : value))

        clipboardJson.pop()// length - 1 because when you copy from excel, it put an extra row
        if (clipboardJson.length == 0 || (clipboardJson.length == 1 && clipboardJson[0].length == 1))
            return false
        return clipboardJson
    }
    catch (ex) {
        return false
    }
}

export function jsonExcelClipboard(json) {
    try {
        const jsonLength = json.length
        var result = json.reduce((retour, row, indexRow) => {
            return retour + row.reduce((retourRow, cell, indexCell) => {
                    retourRow += cell
                    if (indexCell != row.length - 1)
                        retourRow += tabulation
                    return retourRow
                }, "") + (indexRow != jsonLength - 1 ? breakLine : "")
        }, "")
        if (result.split(breakLine).length == 1 && result.split(breakLine)[0].split(tabulation).length == 1)
            return false
        return result
    }
    catch (ex) {
        return false
    }
}