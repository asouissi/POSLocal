'use strict'
import React from "react";
import {FormattedNumber} from "react-intl";
import {DateDisplay} from "./DateDisplay";
import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";

export default class SummaryItem extends React.Component {

    render() {
        let {metadata, accessKeys, ...props}  = this.props;
        metadata = {...metadata, ...accessKeys};

        if (metadata.hidden || (accessKeys && accessKeys.hidden)) {
            return false;
        }

        let valueField = this.renderField(metadata);
        let label = metadata.label;
        if(this.context.showAccessKeys){
            label = '"component": "'+ metadata.id +'"';
        }
        return (
            <div>
                <dt>{label}</dt>
                {valueField}
            </div>
        )
    }

    renderField(metadata) {
        if (metadata.customComponent) {
            return (
                <dd>
                    <metadata.customComponent data={metadata.value} {...this.props}/>
                </dd>
            )
        }

        if (!metadata.value || metadata.value === 0) {
            return <dd/>
        }
        switch (metadata.format) {

            case "number":
                return <dd className="number"><FormattedNumber
                    value={!(!metadata.value || isNaN(metadata.value) || !isNumber(metadata.value)) ? metadata.value : ''}/>
                </dd>;
            case "currency":
                return <dd className="formatted-currency">
                    <FormattedNumber
                        value={!(!metadata.value || isNaN(metadata.value) || !isNumber(metadata.value)) ? metadata.value : 0.0}
                        format="currencyFormat"
                        currency={metadata.currencyCode}/>
                </dd>;
            case "date":
                return <dd><DateDisplay value={metadata.value}/></dd>;
            default:
                return <dd>{metadata.value}</dd>;
        }

    }
}

SummaryItem.contextTypes = {
    showAccessKeys: React.PropTypes.bool
};