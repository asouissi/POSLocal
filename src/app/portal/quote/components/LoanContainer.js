/**
 * Created by AkshiK on 11/11/2016.
 */
'use strict'
import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import Calculator from "../../../calculator/Calculator";
import Box from "../../../core/components/lib/Box";
import {setLoanDetails} from "../reducers/actions";

class Loan extends Component {

    // HERE  I USE  YOUR FUNCTION BUT THE  GOAL IS TO UPDATE THE DEAL  OF THE PORTAL QUOTE FORM
    // onCalculatorChange = (data) => {
    //     this.props.dispatch(change('portalquote', 'dealForm' ....))
    // }

    render() {
        return (
            <Box className="loan" type="primary">
                <div className="bloc-calc">
                    <Calculator onChange={this.props.setLoanDetails}/>
                </div>
            </Box>);
    }
}

const mapStateToProps = (state, props) => {
    return {} // may be pass again  the data .... apr amount ect
};

export default connect(
    mapStateToProps, {setLoanDetails}
)(injectIntl(Loan));
