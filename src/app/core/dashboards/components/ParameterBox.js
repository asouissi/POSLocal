import React from 'react'
import Select from 'react-select';

import Box from '../../components/lib/Box.js';
import FormGroup from '../../components/lib/FormGroup'

class Parameter extends React.Component {

    handleChange(newValue) {
        this.props.onChange({key: this.props.name, value: newValue.value});
    }

    render() {
        let {options, value, name, title} = this.props;

        return (
            <FormGroup className="col-md-3 col-xs-6" title={title}>
                <Select options={options} value={value} name={name}
                        onChange={(newValue) =>(this.handleChange(newValue))}
                        clearable={false}/>
            </FormGroup>
        )
    }
}

export default class ParameterBox extends React.Component {

    constructParameters(parameters) {

        if (!parameters) {
            return [];
        }
        return parameters.map(parameter => {
            return this.getParameterComponent(parameter);
        });
    }

    getParameterComponent(parameter) {
        switch (parameter.type) {
            case 'SELECT':
                return (<Parameter {...parameter} name={parameter.key} onChange={this.props.onChange}/>);//un super select
            default:
                return [];
        }

    }

    render() {
        var parameters = this.props.parameters;
        var paramsComponents = this.constructParameters(parameters);

        if (!paramsComponents.length) {
            return null;
        }

        var toolBox = (
            <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" onClick={this.props.onReset}>
                    <i className="fa fa-undo"></i>
                </button>
                <button type="button" className="btn btn-box-tool" onClick={this.props.onSubmit}>
                    <i className="fa fa-rocket"></i>
                </button>
                <button type="button" className="btn btn-box-tool" data-original-title="Collapse"
                        data-widget="collapse">
                    <i className="fa fa-plus"></i>
                </button>
            </div>
        );

        return (
            <Box className="parameters-box box-primary collapsed-box" title="Parameters" tools={toolBox}>
                <div className="row">
                    {paramsComponents}
                </div>
            </Box>
        );
    }
}
