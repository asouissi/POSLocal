/**
 * Created by zos on 02/06/2016.
 */
'use strict'

import React, {Component} from 'react';
import FormGroup from '../../../../core/components/lib/FormGroup';


const EMPTY_VALUE = "null";

export default class DrawnAssetSelect extends Component {

    componentWillMount() {
        var listdealassetstodraw = this.props.listdealassetstodraw;
        if (listdealassetstodraw && listdealassetstodraw.length == 1) {
            this.props.onChange({target: {value: listdealassetstodraw[0].dpmordre}});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps && nextProps != this.props) {
            return true;
        } else {
            return false;
        }

    }

    componentWillUpdate(nextProps, nextState) {
        var listdealassetstodraw = nextProps.listdealassetstodraw;
        if (listdealassetstodraw && listdealassetstodraw !== this.props.listdealassetstodraw && listdealassetstodraw.length === 1) {
            if(listdealassetstodraw[0].dpmordre !== nextProps.value){
                this.props.onChange({target: {value: listdealassetstodraw[0].dpmordre}});
            }
        }
    }

    render() {
        var props = this.props;
        var options = this.listOptions();
        var defaultValue = props.value;
        var listdealassetstodraw = props.listdealassetstodraw;
        var empty = !(options instanceof Array && options.length > 0);

        var cl = {
            'form-group': true,
            'is-empty': empty
        };


        return (
            <FormGroup classNames={cl} forInputId={props.id} title={props.title}>
                <select id={props.id} ref="select" className="form-control" onChange={props.onChange}
                        readOnly={props.readOnly} disabled={props.disabled || empty}
                        value={props.value ||EMPTY_VALUE}>

                    {options}
                </select>
            </FormGroup>
        )
    }

    listOptions() {
        var listdealassetstodraw = this.props.listdealassetstodraw;

        var options = [<option key="#select" className="option-select" value={EMPTY_VALUE} disabled="true"
        >{this.props.placeholder}</option>];

        if (listdealassetstodraw && listdealassetstodraw.length) {
            var ops = listdealassetstodraw.filter((row)=> (row!==undefined?true:false) ).map((row) => <option key={row.dpmordre}
                                                                value={row.dpmordre}>{this.getLabelFromData(row)}</option>);
            Array.prototype.push.apply(options, ops);
        } else {
            options = (<option key="#loading" className="option-loading" value="NOTHING" disabled="true">Empty
                list</option>);
        }

        return options;
    }

    getLabelFromData(data) {
        if (!data) {
            return "";
        }
        let label = "Asset #" + data.dpmordre;
        if (data.dpmlibelle && data.dpmlibelle != "" && data.dpmlibelle != "-" && data.dpmmtinvest && data.dpmmtinvest != "") {
            label = data.dpmlibelle + ' (' + this.formatCurrency(data.dpmmtinvest) + ')';
        } else if (data.varlibelle && data.varlibelle != "" && data.dpmmtinvest && data.dpmmtinvest != "") {
            label = data.varlibelle + ' (' + this.formatCurrency(data.dpmmtinvest) + ')';
        } else if (data.dpmmtinvest && data.dpmmtinvest != "") {
            label = "Asset #" + data.dpmordre + ' (' + this.formatCurrency(data.dpmmtinvest) + ')';
        } else {
            if (data.dpmtypecg && data.dpmtypecg != "") {
                label = data.dpmtypecg;
            } else if (data.dpmcategorie && data.dpmcategorie != "") {
                label = data.dpmcategorie;
            }
        }

        return label;
    }

    formatCurrency(value) {
        if (typeof(value) !== "number" || isNaN(value)) {
            return "";
        }
        return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
    }
}