import React, {Component} from 'react'
import classNames from 'classnames';
import {connect} from "react-redux";
import {fetchReferenceTable, getReferenceTable, tables} from "../../../core/reducers/referenceTable";

//This component is used to display the steps for deals
//It supposed that the referencesTables LANJALON and COLORJALON are loaded in the store or it won't translate

class StepDisplay extends Component {

    componentWillMount() {
        this.props.dispatch(fetchReferenceTable(tables.LANJALON));
        this.props.dispatch(fetchReferenceTable(tables.COLORJALON));
    }

    render() {
        const {code, wrapper, format_label, labels, colors, dispatch, className, ...props} = this.props;

        let Wrapper = wrapper || "span";
        let wrapperClassName = {
            "badge": true,
            [className]: className
        };
        let label;
        let color;

        label = this.findCodeIn(code, labels);
        color = this.findCodeIn(code, colors);

        label = (label && label.label) || code;
        if (format_label)
            label = format_label(label);
        color = color && color.label;

        return (<Wrapper className={classNames(wrapperClassName)}
                         style={{backgroundColor: color}} {...props}>{label}</Wrapper>);
    }

    findCodeIn(code, collection) {
        return collection.find(element => element.code == code);
    }
}

export default connect(
    state => ({
        labels: getReferenceTable(state, tables.LANJALON).data,
        colors: getReferenceTable(state, tables.COLORJALON).data
    })
)(StepDisplay);
