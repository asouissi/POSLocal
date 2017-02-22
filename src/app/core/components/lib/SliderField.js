import React from "react";
import Slider from "rc-slider";
import {FormGroup, ControlLabel, HelpBlock} from "react-bootstrap";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";

//only used with redux form
class SliderField extends React.Component {

    handleBlur = () => {
        this.props.input && this.props.input.onBlur(this.props.input.value)
    };

    handleChange = (value) => {
        this.props.input && this.props.input.onChange(value);
        const onValueChange = this.props.onChange;
        onValueChange && onValueChange(value);
    };

    componentDidUpdate(prevProps) {
    }

    render() {

        let {value, title, rightTitle, hidden, accessKey, meta, input, groupClassName, onChange, ...props} = this.props;
        if (hidden || (accessKey && accessKey.hidden)) {
            return false;
        }

        var cl = {
            'error': meta && meta.touched && meta.error
            //'warning': input && props.meta.touched && props.meta.error
        };

        let gc = {
            'form-group': true,
        }
        if (groupClassName) {
            gc[groupClassName] = true;
        }

        if (input.value !== undefined) {
            value = input.value;
        }
        if (value === undefined || value === '') {
            let min = props.min || 0;
            value = (props.range) ? [min, min] : (min);
        }

        return (
            <FormGroup validationState={classNames(cl) || undefined} bsClass={classNames(gc)}>
                <ControlLabel>
                    {title}
                    {rightTitle && <span className="right-title">{rightTitle}</span>}
                </ControlLabel>
                <Slider value={value} {...props} onChange={this.handleChange}/>

                {(meta && meta.touched && meta.error &&
                <HelpBlock >{<FormattedMessage {...meta.error}/>}</HelpBlock>)}

            </FormGroup>
        );
    }
}

export default SliderField;