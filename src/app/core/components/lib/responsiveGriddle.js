'use strict'
import React, {Component} from 'react';

class PatternGenerator extends Component {

    getMetadataForColumnName(columnName) {
        const METADATA = this.props.globalData.metadata;
        return METADATA.find(m => m.columnName == columnName) || {};
    }

    getRows(pattern) {
        const DATA = this.props.data;
        return pattern.map((col, index) => {
            var subDivs;
            if (col.children)
                subDivs = this.getRows(col.children);
            else if (col.useCustomComponent) {
                const METADATA_FOR_COLUMN = this.getMetadataForColumnName(col.columnName);
                const CUSTOM_COMPONENT = col.overrideCustomComponent || METADATA_FOR_COLUMN.customComponent;
                subDivs = React.createElement(CUSTOM_COMPONENT, {
                    data: DATA[col.columnName],
                    rowData: DATA,
                    metadata: {customComponentMetadata: METADATA_FOR_COLUMN.customComponentMetadata}
                });
            }
            else
                subDivs = <span>{DATA[col.columnName]}</span>;
            const CL = (col.className || "fullWidth") + " subDivs";
            return <div key={index} className={CL}>{subDivs}</div>;
        });
    }

    render() {
        const PATTERN = this.props.globalData.pattern;
        const ROWS = this.getRows(PATTERN.elements);
        return <div className={PATTERN.rowClass}>
            <div className="patternGenerator fullWidth">{ROWS}</div>
        </div>;
    }
}

export default PatternGenerator;
