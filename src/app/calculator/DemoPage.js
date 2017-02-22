import React from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
import {Link} from 'react-router'
import Calculator from './Calculator'
import {FormattedMessage} from 'react-intl'
import {loginGuest} from "../core/reducers/authentication";

class DemoPage extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        this.props.loginGuest(null,null);
    }

    render() {
        return (
            <div className="content-demo">
                <form>
                <Link to='login' className="login-link"><span className="fa fa-user"/> <FormattedMessage
                    id="app.calculator.demo.lnklogin"
                    defaultMessage="Login"/></Link>

                <div className="bloc-title">
                    <div className="bloc1"><FormattedMessage id="app.calculator.demo.loan"
                                                             defaultMessage="Cassiopae Personal Loans"/></div>

                    <div className="bloc2">

                        <h3><FormattedMessage id="app.calculator.demo.loanrate"
                                              defaultMessage="Our best loan rate"/></h3>
                        <p><FormattedMessage id="app.calculator.demo.exclusivecustomers"
                                             defaultMessage="Exclusively for our main current account customers"/></p>
                    </div>

                    <div className="bloc3">
                        <h3>3.1 %</h3>
                        <p>APR</p>
                    </div>

                </div>

                    <div className="bloc-calc">
                        <Calculator />
                        <Link to={{pathname: "login", query: {register: true}}}> <FormattedMessage
                            id="app.calculator.lnkregister"
                            defaultMessage="Register"/> </Link>
                    </div>
                </form>
            </div>
        );
    }
}

DemoPage = reduxForm({
    form: 'demopage'
    },
)(DemoPage);

export default connect(
    state => ({
        errorMessage: state.error
    }),
    { loginGuest}
)
(DemoPage);


