/**
 * Created by zos on 07/06/2016.
 */
import React, {Component} from 'react'

import FormGroup from '../../../../core/components/lib/FormGroup'
import AjaxComponent from '../../../../core/components/lib/AjaxComponent'

const EMPTY_VALUE= "null";

const PropsArray = ["tpglibelleparent" ,"nbTotalAssets", "nbUnDrawnAssets", "readOnly"];

export default class DrawnMFSelect extends AjaxComponent {

    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps){
        let result =false;
        for (var propName of PropsArray) {
            // New key
            var v = nextProps[propName];
            if (v != this.props[propName]) {
                result = true;
            }
        }
        return result;
    }

    render() {
        var state = this.state;
        var props = this.props;

       var empty = false;

        var cl = {
            'form-group': true,
            'has-error': state.error,
            'has-warning': state.warning,
            'has-success': state.success,
            'has-loading': state.loading,
            'is-empty': empty
        };

        return (
            <FormGroup classNames={cl} forInputId={props.id} title={props.title}>
                <select id={props.id} ref="select" className="form-control" onChange={props.onChange}
                        readOnly={props.readOnly} disabled={props.disabled || state.loading || state.error || empty}
                        value={props.value ||EMPTY_VALUE}>

                    <option key={props.tpgcodeparent}
                            value={props.tpgcodeparent}>
                        {props.tpglibelleparent} ({props.nbTotalAssets} Total assets, {props.nbUnDrawnAssets} undrawn)
                    </option>
                </select>
            </FormGroup>
        )
    }

}