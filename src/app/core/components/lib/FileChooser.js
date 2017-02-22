'use strict'
import React from 'react'
import {FormattedMessage} from 'react-intl';

import classNames from 'classnames';

import {FormGroup, InputGroup, Button, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

export default class FileChooser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    handleBrowse = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.refs.inputFile.click();
    };

    handleFileChanged = (event) => {
        let file = event.target.files[0];
        file && this.setState({value: file.name});
        this.props.onChange && this.props.onChange(event)
        this.props.input && this.props.input.onChange && this.props.input.onChange(file)
    };

    render() {
        var {input, title, disabled, ...props}  = this.props;
        var cl = {
            'error': input && props.meta.touched && props.meta.error
        };
        return (
            <FormGroup validationState={classNames(cl) || undefined}>
                {this.props.title && (
                    <ControlLabel>
                        {this.props.title}
                    </ControlLabel>
                )}

                <InputGroup>
                    <InputGroup.Button>
                        <Button bsStyle="primary" onClick={this.handleBrowse}><FormattedMessage
                            id="core.components.filechooser.btn.browse" defaultMessage="Browse..."/></Button>
                    </InputGroup.Button>
                    <div style={{display: 'none'}}>
                        <input ref="inputFile" type="file"
                               onChange={this.handleFileChanged}
                        />
                    </div>
                    <FormControl type="text" value={this.state.value}/>
                </InputGroup>
                {(props.meta && props.meta.touched && props.meta.error && <HelpBlock >{props.meta.error}</HelpBlock>)}
            </FormGroup>
        )
    }
}
