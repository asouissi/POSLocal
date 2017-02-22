const applyAccessKeysOn = (componentType, accessKeys, parameters) => {
    switch (componentType) {
        case "griddle":
            return applyOnGriddle(accessKeys, parameters);
    }
    return false;
}

const applyOnGriddle = (accessKeys, parameters) => {
    const {defaultColumns, defaultColumnMetadata, pattern} = parameters;

    //Main Griddle

    let columns = [];
    let columnMetadata;
    const columnsKeys = accessKeys && accessKeys.columns || defaultColumns;

    columnMetadata = columnsKeys.map(c => {
        const columnIsObject = typeof c == "object";
        let columnName;
        if (columnIsObject) {
            columnName = c.columnName;
        }
        else
            columnName = c;

        columns = columns.concat(columnName);
        let cM = defaultColumnMetadata.find(cM => cM.columnName == columnName) || {columnName: columnName};

        if (columnIsObject)
            cM = {...cM, ...c};

        return {...cM, cssClassName: "cell-" + columnName + " " + (cM.cssClassName || "")};
    });

    let returnedObject = {columns, columnMetadata};

    //Pattern
    if (pattern) {
        const elements = rowsUpdate(pattern.elements, columns);
        returnedObject = {...returnedObject, pattern: {...pattern, elements}}
    }

    return returnedObject;
}

const rowsUpdate = (children, columns) => {
    return children.reduce((rows, currentRow, index) => {
        let newRow;
        if (currentRow.children)
            newRow = {...currentRow, children: rowsUpdate(currentRow.children, columns)};
        else if (columns.includes(currentRow.columnName))
            newRow = currentRow;
        if (newRow)
            rows = rows.concat(newRow);
        return rows;
    }, []);
}

export default applyAccessKeysOn;