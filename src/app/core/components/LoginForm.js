import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl'
import {reduxForm, Field} from 'redux-form'
import {login, getSession, register, forgotPassword, fetchClientConfig, validateUser} from '../reducers/authentication'
import {Link} from 'react-router'
import TextEntry from '../../core/components/lib/TextEntry'
import {GlobalMessages} from "../intl/GlobalMessages"
import Notifications from '../components/lib/notify';
import config from "./config";

const validate = values => {
    const errors = {}
    if (!values.uticode) {
        errors.uticode = GlobalMessages.fieldRequire;
    }if (!values.utipwd) {
        errors.utipwd = GlobalMessages.fieldRequire;
    }if (!values.utiprenom) {
        errors.utiprenom = GlobalMessages.fieldRequire;
    }if (!values.utinom) {
        errors.utinom = GlobalMessages.fieldRequire;
    }if (!values.email) {
        errors.email = GlobalMessages.fieldRequire;
    }
    return errors
};

const asyncValidate = (values, dispatch, props) => {
    if (props.location.query.register) {
        return validateUser(values.uticode).then(response =>{
            if (!response.data) {
                const errors = {}
                errors.uticode = GlobalMessages.duplicateUsername;
                return errors;
            }
        })
    }
    else{
        return Promise.resolve();
    }
};

const DEFAULT_EMPTY = [];
class LoginForm extends React.Component {

    componentWillMount() {
        const {client} = this.props.location.query;
        if (client) {
            this.props.fetchClientConfig(client);
        }
    }

    handleSubmit = (formData) => {

        const {register, forgotPassword} = this.props.location.query;
        if (register) {
            this.props.register(formData, false);
        } else if (forgotPassword) {
            this.props.forgotPassword(formData);
        } else {
            const {uticode, utipwd} = formData;
            this.props.login(uticode, utipwd );
        }
    };

    render() {

        var cl = {
            'error': this.props.errorMessage
        };

        const {register, forgotPassword} = this.props.location.query;
        let loginFields = DEFAULT_EMPTY;
        let registerFields = DEFAULT_EMPTY;
        let forgotPasswordFields = DEFAULT_EMPTY;

        if (!forgotPassword) {
            loginFields = this.renderLoginFields();
        }
        if (register) {
            registerFields = this.renderRegisterFields();
        }
        if (forgotPassword || register) {
            forgotPasswordFields = this.renderForgotPwdFields();
        }

        const {
            handleSubmit, submitting, pristine, contract, reset, asyncValidating, skinClass
        } = this.props;

        let messages = DEFAULT_EMPTY;
        if (this.props.errorMessage && this.props.errorMessage.id) {
            messages = this.props.intl.formatMessage(this.props.errorMessage);
        } else if (this.props.errorMessage) {
            messages = this.props.errorMessage;
        }

        let logoSrc = config.loginLogoImg || "img/login/logo_login.png";
        const background = config.loginBackgroundImg || 'img/login/bg_login.jpg';
        let contentStyle = {
            background: "url( " + background + ") no-repeat"
        }
        if (config.loginBackgroundColor) {
            contentStyle = {...contentStyle,
                background : config.loginBackgroundColor
            }
        }
        return (
            <div className={skinClass}>
                <Notifications/>
                <div className={"content-login " + skinClass} style={contentStyle}>
                    <div>
                        <div className="center-login">
                            <img src={logoSrc} alt="Cassiopae"/>
                            <form className={classNames(cl)} onSubmit={handleSubmit(this.handleSubmit)}>

                                {loginFields}
                                {registerFields}
                                {forgotPasswordFields}

                                <div className="indic-error-login">
                                    <p>{messages}</p>
                                </div>

                                <div className="input-submit-login">
                                    <button type="submit" disabled={pristine || submitting}
                                            className="mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                            <span className="button-value">{register ?
                                                <FormattedMessage id="core.login.btnregister"
                                                                  defaultMessage="Register"/> : ( forgotPassword ?
                                                <FormattedMessage id="core.login.btnsubmit"
                                                                  defaultMessage="Submit"/> :
                                                <FormattedMessage id="core.login.btnlogin"
                                                                  defaultMessage="Login"/>)}</span>
                                    </button>
                                </div>

                                <div className="align-right">
                                <span>{!(forgotPassword || register) ?
                                    <Link to={{pathname: "login", query: {forgotPassword: true}}}> <FormattedMessage
                                        id="core.login.lnkforgotpassword"
                                        defaultMessage="Forgot password?"/></Link> : DEFAULT_EMPTY}
                                </span>
                                </div>

                            </form>
                        </div>
                    </div>

                    <div id="particles-js"></div>
                </div>
            </div>
        );
    }

    renderLoginFields() {
        return (
            <div>
                <Field name="uticode"
                       component={TextEntry}
                       groupClassName="input-text-login"
                       title={<FormattedMessage id="core.login.username" defaultMessage="Username"/>}
                />
                <Field name="utipwd"
                       component={TextEntry}
                       type="password"
                       groupClassName="input-text-login"
                       title={<FormattedMessage id="core.login.password" defaultMessage="Password"/>}
                />
            </div>
        );
    }

    renderRegisterFields(){
        return (
            <div>
                <Field name="utiprenom"
                       component={TextEntry}
                       groupClassName="input-text-login"
                       title={<FormattedMessage id="core.login.firstname" defaultMessage="First name"/>}
                />
                <Field name="utinom"
                       component={TextEntry}
                       groupClassName="input-text-login"
                       title={<FormattedMessage id="core.login.lastname" defaultMessage="Last name"/>}
                />
            </div>
        );
    }

    renderForgotPwdFields() {
        return (
            <div>
                <Field name="email"
                       component={TextEntry}
                       groupClassName="input-text-login"
                       title={<FormattedMessage id="core.login.email" defaultMessage="E-mail"/>}
                       type="email"
                />
            </div>
        );
    }
}

LoginForm = reduxForm({
        form: 'login',
        validate,
        asyncValidate,
        asyncBlurFields: [ 'uticode' ]
    },
)(injectIntl(LoginForm));

export default connect(
    state => ({
        errorMessage: state.authentication.errorMessage,
        skinClass: state.authentication.skinClass
    }),
    {login, register, forgotPassword, fetchClientConfig, validateUser, getSession}
)
(LoginForm);
