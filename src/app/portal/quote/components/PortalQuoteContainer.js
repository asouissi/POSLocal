import React, {Component} from "react";
import {connect} from "react-redux";
import {reduxForm, formValueSelector} from "redux-form";
import {injectIntl, FormattedMessage} from "react-intl";
import {Link} from "react-router";
import {Multistep} from "../../../core/components/lib/react-multistep";
import NewActorContainer from "./NewActorContainer";
import LoanContainer from "./LoanContainer";
import {isValidAge} from  "../../../core/utils/ValidationUtils";
import NewUserContainer from "./NewUserContainer";
import {
    stepChange,
    updateValidStepIndex,
    updateRecaptcha,
    verifyTermsConditions,
    updateCaptchaDeclaration,
    createActor,
    setUserRestriction
    , saveActorUserDetails
} from "../reducers/actions";
import {validateUser, register, loginPortalUser, logout, login} from "../../../core/reducers/authentication";
import VerificationCaptcha from "./VerificationContainer";
import AttachmentsContainer from "./AttachmentsContainer";
import {GlobalMessages} from "../../../core/intl/GlobalMessages";
import Summary from "./SummaryContainer";
import {isValidTelephoneNo} from "../../../core/utils/ValidationUtils";
import setIn from "redux-form/lib/structure/plain/setIn";
import {notify} from "../../.././core/components/lib/notify";
import "../../../core/components/lib/prog-tracker.css";
const DEFAULT_EMPTY = [];

const validate = values => {
    let errors = {}
    if (!values.actor) {
        errors = setIn(errors, 'actor.apaprenom', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.apatitre', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.actnom', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.actresidentcode', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.apasexe', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.apadtnaiss', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.actlibcourt', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.apatitre', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.listactortelecom[0].atenum', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'actor.listactortelecom[1].atenum', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.apatitre) {
        errors = setIn(errors, 'actor.apatitre', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.apaprenom) {
        errors = setIn(errors, 'actor.apaprenom', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.apatitre) {
        errors = setIn(errors, 'actor.apatitre', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.actnom) {
        errors = setIn(errors, 'actor.actnom', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.actresidentcode) {
        errors = setIn(errors, 'actor.actresidentcode', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.apasexe) {
        errors = setIn(errors, 'actor.apasexe', GlobalMessages.fieldRequire);
    }
    if (values.actor && !values.actor.apadtnaiss) {
        errors = setIn(errors, 'actor.apadtnaiss', GlobalMessages.fieldRequire);
    } else if (values.actor && isValidAge(values.actor.apadtnaiss)) {
        errors = setIn(errors, 'actor.apadtnaiss', GlobalMessages.InvalidAge);
    }
    if (values.actor && !values.actor.actlibcourt) {
        errors = setIn(errors, 'actor.actlibcourt', GlobalMessages.fieldRequire);
    }
    if (values.actor && values.actor.listactortelecom && values.actor.listactortelecom[0] && !values.actor.listactortelecom[0].atenum) {
        errors = setIn(errors, 'actor.listactortelecom[0].atenum', GlobalMessages.fieldRequire);
    }
    else if (values.actor && values.actor.listactortelecom && values.actor.listactortelecom[0] && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.actor.listactortelecom[0].atenum))) {
        errors = setIn(errors, 'actor.listactortelecom[0].atenum', GlobalMessages.invalidEmail);
    }
    if (values.actor && values.actor.listactortelecom && values.actor.listactortelecom[1] && !values.actor.listactortelecom[1].atenum) {
        errors = setIn(errors, 'actor.listactortelecom[1].atenum', GlobalMessages.fieldRequire);
    }
    else if (values.actor && values.actor.listactortelecom && values.actor.listactortelecom[1] && values.actor.listactortelecom[1].atenum) {
        if (!isValidTelephoneNo(values.actor.listactortelecom[1].atenum)) {
            errors = setIn(errors, 'actor.listactortelecom[1].atenum', GlobalMessages.invalidMobileNo);
        }
    }
    if (!values.user) {
        errors = setIn(errors, 'user.uticode', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'user.utipwd', GlobalMessages.fieldRequire);
        errors = setIn(errors, 'user.utitelecom', GlobalMessages.fieldRequire);
        errors.uticomfirmpwd = GlobalMessages.fieldRequire;
    }
    else {
        if (!values.user.uticode) {
            errors = setIn(errors, 'user.uticode', GlobalMessages.fieldRequire);
        }
        if (!values.user.utipwd) {
            errors = setIn(errors, 'user.utipwd', GlobalMessages.fieldRequire);
        }
        if (!values.user.utitelecom) {
            errors = setIn(errors, 'user.utitelecom', GlobalMessages.fieldRequire);
        }
        else if (values.user.utitelecom) {
            if (values.user.utitelecom && !isValidTelephoneNo(values.user.utitelecom)) {
                errors = setIn(errors, 'user.utitelecom', GlobalMessages.invalidPhoneNo);
            }
        }
        if (!values.user.email) {
            errors = setIn(errors, 'user.email', GlobalMessages.fieldRequire);
        }
        else if (values.user.email) {
            if (values.user.email && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.user.email) )) {
                errors = setIn(errors, 'user.email', GlobalMessages.invalidEmail);
            }
        }
        if (!values.uticomfirmpwd) {
            errors.uticomfirmpwd = GlobalMessages.fieldRequire;
        }
        if (!(values.user.utipwd && values.uticomfirmpwd &&
            values.uticomfirmpwd === values.user.utipwd)) {
            errors.uticomfirmpwd = GlobalMessages.verifyPassword;
        }
    }
    return errors
};

const asyncValidate = (values, dispatch, props) => {
    if (values.user && values.user.uticode) {
        return validateUser(values.user.uticode).then(response => {
            if (!response.data) {
                let errors = {}
                errors = setIn(errors, 'user.uticode', GlobalMessages.duplicateUsername);
                return errors;
            }
        })
    }
    else {
        return Promise.resolve();
    }
};

export class PortalQuote extends Component {

    handleStepChange = (index) => {
        if (this.props.validStepIndex >= index) {
            if (this.props.restrictBackTraversal && index <= 2) {
                notify.show('All your Information is saved.');
            }
            else {
                this.props.stepChange(index);
            }
        }
    }

    handleCreateUserActor = (data) => {
        if (this.props.actor && this.props.user && this.props.user.uticode) {
            var actorData = {//REMOVE THAT
                ...data.actor,
                uticodecreat: data.user.uticode
            };
            this.props.dispatch(saveActorUserDetails(actorData, data.user, data.deal));//REMOVE THAT
            this.registerUser(data);
        }
    }

    registerUser = (data) => {
        var userData = {
            ...data.user,
            utiprenom: data.actor.apaprenom,
            utinom: data.actor.actnom,
        };

        this.props.register(userData, true)
            .then(() => {
                return this.props.logout(false)
            })
            .then(() => {
                return this.props.login(userData.uticode, userData.utipwd)
            })
            .then(() => {
                this.props.createActor(this.props.form, data.actor);
                this.props.setUserRestriction(true);
                this.validateStep();
            }).catch((response) => {
            console.log('error user portal', response)
        })
    }

    validateStep = () => {
        if (this.props.recaptchaStatus == 1 && this.props.flagDisclaimer) {
            this.props.updateValidStepIndex(this.props.stepIndex);
        }
        else if (this.props.recaptchaStatus != 1 && !this.props.flagDisclaimer) {
            this.props.updateCaptchaDeclaration(this.props.recaptchaStatus, this.props.flagDisclaimer);
        }
        else if (this.props.recaptchaStatus != 1) {
            this.props.updateRecaptcha(this.props.recaptchaStatus);
        }
        else if (!this.props.flagDisclaimer) {
            this.props.verifyTermsConditions(0);
        }
    }

    render() {
        const {
            stepIndex, validStepIndex, submitting, pristine, handleSubmit, params, ...props
        } = this.props;

        const skin = params && params.skin || "";

        let lnkLogin = DEFAULT_EMPTY;

        lnkLogin = <div className="actionLink">
            <Link to='login' className="login-link"><span className="fa fa-user lnkLogin"/>
                <FormattedMessage
                    id="portal.quote.lnk.lnklogin"
                    defaultMessage="Login"/></Link>
        </div>

        this.resetButton = ([<button type="button" className="btn btn-danger" onClick={this.props.reset}
                                     disabled={pristine || submitting}>
            <FormattedMessage id="portal.quote.btn.reset" defaultMessage="Reset"/></button>]);
        if (stepIndex == 0) {
            this.customLeftBtn = (
                <button key="loanQuote" type="submit" className="btn btn-primary" disabled={submitting}
                        onClick={handleSubmit(this.validateStep)}>
                    <FormattedMessage id="portal.quote.btn.loanQuote" defaultMessage="Initiate my loan quote"/>
                </button>);
        }
        else if (stepIndex == 1) {
            this.customLeftBtn = (
                <button key="proceed" type="submit" className="btn btn-primary"
                        onClick={handleSubmit(this.validateStep)}>
                    <FormattedMessage id="portal.quote.btn.proceed" defaultMessage="Proceed"/>
                </button>);
        }
        else if (stepIndex == 2) {
            this.customLeftBtn = (
                <button key="applyLoan" type="submit" className="btn btn-primary"
                        onClick={handleSubmit(this.handleCreateUserActor)}>
                    <FormattedMessage id="portal.quote.btn.applyLoan" defaultMessage="Apply now"/>
                </button>);
        }
        else if (stepIndex == 3) {
            this.customLeftBtn = (
                <button key="uploadDocs" type="submit" className="btn btn-primary"
                        onClick={handleSubmit(this.validateStep)}>
                    <FormattedMessage id="portal.quote.btn.upload" defaultMessage="Upload"/>
                </button>);
        }
        else {
            this.customLeftBtn = this.resetButton = DEFAULT_EMPTY;
        }

        var steps = [
            {
                name: <FormattedMessage id="portal.quote.step.selectLoan" defaultMessage='Select loan' tagName='div'/>,
                component: <LoanContainer/>
            },
            {
                name: <FormattedMessage id="portal.quote.step.enterDetails" defaultMessage='Enter details'
                                        tagName='div'/>,
                component: [<NewActorContainer/>,
                    <VerificationCaptcha/>]
            },
            {
                name: <FormattedMessage id="portal.quote.step.submitApplication"
                                        defaultMessage='Submit your application' tagName='div'/>,
                component: <NewUserContainer/>
            },
            {
                name: <FormattedMessage id="portal.quote.step.uploadDocuments" defaultMessage='Upload documents'
                                        tagName='div'/>,
                component: <AttachmentsContainer form="portalquote"/>
            },
            {
                name: <FormattedMessage id="portal.quote.step.summary" defaultMessage='Summary'
                                        tagName='div'/>,
                component: <Summary formName="portalquote"/>
            }
        ];

        return (
            <div className={skin}>
                <div className="row portalQuote">
                    <form ref="portalquote" className="col-md-12">
                        <Multistep steps={steps}
                                   step={stepIndex}
                                   customLeftBtn={this.customLeftBtn}
                                   reset={stepIndex == 1 ? "" : this.resetButton}
                                   actionlink={lnkLogin}
                                   onStepChange={this.handleStepChange}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

PortalQuote = reduxForm({
        form: 'portalquote',
        validate,
        asyncValidate
    },
)(PortalQuote);

const selector = formValueSelector('portalquote');

const mapStateToProps = (state, props) => {

    return {
        initialValues: state.portalquote.formValues,
        stepIndex: state.portalquote.stepIndex,
        validStepIndex: state.portalquote.validStepIndex,
        validRecaptcha: state.portalquote.validRecaptcha,
        flagDisclaimer: state.portalquote.flagDisclaimer,
        recaptchaStatus: state.portalquote.recaptchaStatus,
        user: selector(state, 'user'),
        actor: selector(state, 'actor'),
        deal: selector(state, 'deal'),
        restrictBackTraversal: state.portalquote.restrictBackTraversal
    }
};

const mapDispatchToProps = {
    stepChange,
    updateValidStepIndex,
    updateRecaptcha,
    verifyTermsConditions,
    updateCaptchaDeclaration,
    register,
    createActor,
    setUserRestriction,
    logout, login
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(PortalQuote));