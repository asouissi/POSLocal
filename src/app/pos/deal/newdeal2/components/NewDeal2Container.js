import React, {Component} from "react";
import {connect} from "react-redux";
import {reduxForm, getFormValues, SubmissionError, getFormSyncErrors} from "redux-form";
import {Multistep} from "../../../../core/components/lib/react-multistep";
import {defineMessages, injectIntl, FormattedMessage} from "react-intl";
import {notify} from "../../../../core/components/lib/notify";
import {accessKeysSelector} from "../../../../common/accesskeys/AccessKeysSelector";
import {GlobalMessages} from "../../../../core/intl/GlobalMessages";
import AccessKeysValidator from "../../../../common/accesskeys/AccessKeysValidator";
import Customer from "../../customer/components/CustomerContainer";
import Assets from "./AssetsQuoteContainer";
import FinancialQuote2Container from "./FinancialQuote2Container";
import Attachments from "../../attachments/components/AttachmentsContainer";
import Summary2 from "./Summary2";
import {newDeal, fetchDeal, saveDeal, StepChange, submitForApproval, executeEvent, handleFaultyStep} from "../reducers/newdeal2";
import {updateDocumentsProps} from "../../attachments/reducers/actions";
import dealUtils from "../../utils/dealUtils";
import {hashHistory} from "react-router";
import {QUOTE, DEAL} from "../../../index";
import {SplitButton, MenuItem} from "react-bootstrap";
import StepDisplay from "../../../../core/components/lib/StepDisplay";
import getIn from "redux-form/lib/structure/plain/getIn";

const DEFAULT_EMPTY = [];

const rightZone = [
    (
        <div className="btn-group deal-print" key="printGroup">
            <a key="print" href="data/print/Nst28043_S14075628.pdf" download=""
               className="btn btn-default"><FormattedMessage id="pos.quote.print.title" defaultMessage="Print"/></a>
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                    aria-expanded="true">
                <span className="caret"></span>
                <span className="sr-only"><FormattedMessage id="pos.quote.toggledropdown.title"
                                                            defaultMessage="Toggle Dropdown"/></span>
            </button>
            <ul className="dropdown-menu" role="menu">
                <li><a key="email" href="data/print/Nst28043_S14075628.pdf"><FormattedMessage
                    id="pos.quote.sendemail.title" defaultMessage="Send as email"/></a></li>
                <li><a key="esign" href="data/print/Nst28043_S14075628.pdf"><FormattedMessage
                    id="pos.quote.esignature.title" defaultMessage="e-Signature"/></a></li>
            </ul>
        </div>
    ),
];

const messages = defineMessages({
    quoteSaveSuccess: {id: "pos.quote.notify.save.success", defaultMessage: 'Quote saved'},
    quoteSaveError: {id: "pos.quote.notify.save.error", defaultMessage: 'Cannot save quote'},
    quoteUpdateSuccess: {id: "pos.quote.notify.update.success", defaultMessage: 'Quote updated'},
    done: {id: "pos.quote.notify.event.done", defaultMessage: 'Done'},
});

export class NewDeal2 extends Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    // Save deal to database
    handleSaveClicked = (data) => {
        if (data.dosid && this.props.stepIndex == 3) {
            this.props.dispatch(updateDocumentsProps(data.dosid));
        }
        return this.props.dispatch(saveDeal(data,
            (dealId, mode) => {
                if (mode === 'U') {
                    notify.show(this.props.intl.formatMessage(messages.quoteUpdateSuccess), 'success');
                } else {
                    notify.show(this.props.intl.formatMessage(messages.quoteSaveSuccess), 'success');
                    hashHistory.push(QUOTE + '/' + dealId);
                }

            },
            (error) => {
                notify.show(this.props.intl.formatMessage(messages.quoteSaveError), 'error');
                if (error.response && error.response.data.control) {
                    throw new SubmissionError({_error: []})
                }
            }
        ));
    }

    handleEventSelected = (data, event) => {
        return this.props.dispatch(executeEvent(data.deal, event, (dealId) => {
                notify.show(this.props.intl.formatMessage(messages.done), 'success');
                hashHistory.push(DEAL + '/' + dealId);
            }
            ,
            (error) => {
                notify.show(this.props.intl.formatMessage(messages.quoteSaveError), 'error');
                if (error.response && error.response.data.control) {
                    throw new SubmissionError({_error: []})
                }
            }
        ));
    }

    componentWillReceiveProps(nextProps) {
        if ((!nextProps.onEdit && nextProps.params.dealid !== this.props.params.dealid)
            || (nextProps.params.dealid && nextProps.params.dealid !== this.props.params.dealid)) {
            if (!nextProps.params.dealid) {
                this.props.dispatch(newDeal(this.props.user));
            } else {
                this.props.dispatch(fetchDeal(nextProps.params.dealid));
            }
        }
    }

    componentDidUpdate(prevProps) {
        let {submitFailed, errors, currentFields, forceStep, stepIndex, ...props} = this.props;

        if (submitFailed && prevProps.currentFields !== currentFields) {

            let currentErrors = currentFields.map(field => field.name).filter(name => getIn(errors, name));

            if (currentErrors.length) {
                props.touch(...currentErrors); // stay in current step and show errors
                props.StepChange(stepIndex, false)
            } else if (forceStep) {
                this.dispatch(handleFaultyStep(errors, 'dealForm'))
            }
        }
    }

    componentDidMount() {
        if (this.props.params.dealid) {
            this.props.dispatch(fetchDeal(this.props.params.dealid));
        } else {
            this.props.dispatch(newDeal(this.props.user));
        }
    }


    render() {
        const {dispatch, stepIndex, promoted, readOnly, handleSubmit, submitFailed, error, submitting, pristine, ...props} = this.props;

        let cl = readOnly ? 'btn btn-primary read-only' : 'btn btn-primary';

        var custom = [(
            <button key="save" className={cl}
                    disabled={submitting || pristine}
                    onClick={this.props.handleSubmit(this.handleSaveClicked)}>
                <FormattedMessage id="pos.quote.form.btn.save" defaultMessage="Save"/>
            </button>
        )];

        let actionLabel = !this.props.currentJalcode ? DEFAULT_EMPTY :
            <StepDisplay code={this.props.currentJalcode} wrapper="span" type="button" disabled="true"/>;

        let actionButton = DEFAULT_EMPTY;
        const handleEvents = (event) => {
            return handleSubmit((data) => this.handleEventSelected(data, event));
        }
        let eventFirst = this.props.events[0];

        let eventsList = this.props.events.map(function (eventss) {
            if (eventss.tmffonction != eventFirst.tmffonction) {
                return <MenuItem Key={eventss} onSelect={handleEvents(eventss)}>{eventss.eventlabel}</MenuItem>
            }
        });

        if (promoted) {

            if (this.props.events.length > 1) {
                actionButton =
                    <div className="col-md-25">
                        <SplitButton bsSize="small" bsStyle={'primary'} title={eventFirst.eventlabel}
                                     id={`split-button-basic-primary`}
                                     onClick={handleEvents(eventFirst)}>
                            {eventsList}
                        </SplitButton>
                    </div>
            } else if (this.props.events.length === 1 && !this.props.dosid && this.props.defaultworkflow && this.props.defaultworkflow != "") {

                actionButton = <div className="action-label" key="eventsGroup">
                    <a onClick={handleSubmit((data) => this.handleEventSelected(data, eventFirst))}
                       key={eventFirst.tmffonction} className="btn btn-primary">{eventFirst.eventlabel}</a>

                </div>;

            }
            else if (this.props.events.length === 1 && this.props.dosid) {

                actionButton = <div className="action-label" key="eventsGroup">
                    <a onClick={handleSubmit((data) => this.handleEventSelected(data, eventFirst))}
                       key={eventFirst.tmffonction} className="btn btn-primary">{eventFirst.eventlabel}</a>

                </div>;

            }
        }

        let accessKeys = this.props.accessKeys;
        const steps = [
            {
                name: <FormattedMessage id="pos.quote.step.financialquote" defaultMessage="Financial quote"/>,
                component: <FinancialQuote2Container key="quote" accessKeys={accessKeys}/>
            },
            {
                name: <FormattedMessage id="pos.quote.step.assets" defaultMessage="Assets" accessKeys={accessKeys}/>,
                component: <Assets key="assets" accessKeys={accessKeys}/>
            },
            {
                name: <FormattedMessage id="pos.quote.step.customer" defaultMessage="Customer"/>,
                component: <Customer key="customer" rolcode="CLIENT" form="dealQuote" boxTitle="Customer Info"
                                     searchTitle="Search customer"
                                     actorList="listdealactor"
                                     route={{path: '/actor'}}
                                     newTitle="New Customer" accessKeys={accessKeys}/>
            },
            {
                name: <FormattedMessage id="pos.quote.step.Attachments" defaultMessage="Attachments"/>,
                component: <Attachments key="attachments" saveDeal={saveDeal} form="dealQuote"/>
            }
        ];

        return (
            <div className="row newDeal2">
                <form className="col-md-8">
                    <Multistep steps={steps}
                               step={stepIndex}
                               hideStep={!promoted}
                               status={actionLabel}
                               actionbar={actionButton}
                               custom={custom}
                               rightZone={rightZone}
                               onStepChange={(index, auto) => dispatch(StepChange(index, auto))}
                    />
                </form>
                <div className="col-md-4">
                    <Summary2 accessKey={accessKeys} submitFailed={submitFailed} syncErrors={props.errors} error={error}/>
                </div>

            </div>
        );
    }
}

const validate = (values, props) => {
    let errors = AccessKeysValidator.validate(values, props);

    if (Object.keys(errors).length) {
        errors._error = [GlobalMessages.fieldsRequire]
    }
    return errors;
};


const FORM_NAME = 'dealQuote';
NewDeal2 = reduxForm({
        form: FORM_NAME,
        enableReinitialize: true,
        validate,
        onSubmitFail: (syncErrors, dispatch) => {
            dispatch(handleFaultyStep(syncErrors, 'dealQuote'))
        }
    }
)(NewDeal2);

const keysSelector = accessKeysSelector();
const mapStateToProps = (state, props) => {
    var route = props.route.path.split('(').shift();
    var values = getFormValues(FORM_NAME)(state);
    let accessKeys = keysSelector(route, state.authentication.accesskeys, values);
    const errors = getFormSyncErrors('dealQuote')(state);
    const currentFields = state.form['dealQuote'] ? state.form['dealQuote'].registeredFields : DEFAULT_EMPTY;

    return {
        initialValues: state.newdeal2.deal,
        stepIndex: state.newdeal2.stepIndex,
        forceStep: state.newdeal2.forceStep,
        readOnly: state.newdeal2.stepIndex.readOnly,
        onEdit: state.newdeal2.onEdit,
        promoted: dealUtils.isPromoted(getFormValues('dealQuote')(state)),
        currentJalcode: state.newdeal2.deal.jalcode,
        action: state.newdeal2.action,
        user: state.authentication.user,
        events: state.newdeal2.events,
        accessKeys,
        defaultworkflow: state.authentication.user.defaultworkflow,
        errors, currentFields
    }
};

const mapDispatchToProps = {
    executeEvent
};
//components with connect are called containers ;)
export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(NewDeal2));
