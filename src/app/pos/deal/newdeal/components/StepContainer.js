import React, {Component} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Multistep} from "../../../../core/components/lib/react-multistep";
import { formValueSelector, getFormSyncErrors} from "redux-form";
import customer from "../../customer";
import AssetsContainer from "./AssetsContainer";
import FinancialQuoteContainer from "./FinancialQuoteContainer";
import AttachmentsContainer from "../../attachments/components/AttachmentsContainer";
import {
    StepChange,
    handleFaultyStep,
} from "../reducers/actions";
import StepDisplay from "../../../../core/components/lib/StepDisplay";
import "../../../../core/components/lib/prog-tracker.css";
import {ACTOR} from "../../../../common/index";
import {SplitButton, MenuItem} from "react-bootstrap";
import SelfPaymentContainer from "./SelfPaymentContainer";
import ProspectContainer from "./ProspectContainer";
import ClientContainer from "./ClientContainer";
import getIn from "redux-form/lib/structure/plain/getIn";
import {CLIENT, COCLIEN, BORROWER, COBORROWER} from "../../utils/dealUtils";
const CustomerContainer = customer.components.CustomerContainer;
const rightZone = [
    (
        <div className="btn-group deal-print" key="printGroup">
            <a key="print" href="data/print/Nst28043_S14075628.pdf" download=""
               className="btn btn-default"><FormattedMessage id="pos.deal.print.title" defaultMessage="Print"/></a>
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                    aria-expanded="true">
                <span className="caret"></span>
                <span className="sr-only"><FormattedMessage id="pos.deal.toggledropdown.title"
                                                            defaultMessage="Toggle Dropdown"/></span>
            </button>
            <ul className="dropdown-menu" role="menu">
                <li><a key="email" href="data/print/Nst28043_S14075628.pdf"><FormattedMessage
                    id="pos.deal.sendemail.title" defaultMessage="Send as email"/></a></li>
                <li><a key="esign" href="data/print/Nst28043_S14075628.pdf"><FormattedMessage
                    id="pos.deal.esignature.title" defaultMessage="e-Signature"/></a></li>
            </ul>
        </div>
    ),
];

const DEFAULT_EMPTY = [];
const TACCODE_PRET = 'PRET';
const ZERO = 0;
const ONE = 1;
const ACTOR_ROUTE = {path: ACTOR}; //used to match with access key route
export class StepContainer extends Component {

    handleStepChange = (index, forceStep) => {
        this.props.dispatch(StepChange(index, forceStep));
    }

    componentWillReceiveProps(nextProps) {
        const {
             submitting, pristine
        } = nextProps;
        let attachmentsChange = (this.props.attachments !== nextProps.attachments);

        this.resetButton = ([<button type="button" key="reset" className="btn btn-danger" onClick={this.props.onReset}
                                     disabled={pristine || submitting}>
            <FormattedMessage id="pos.deal.btn.reset" defaultMessage="Reset"/></button>]);

        this.saveButton = (
            <button key="save" type="submit" className="btn btn-primary"
                    disabled={submitting || (pristine && !attachmentsChange)}
                    onClick={this.props.handleSubmit(this.props.onSave)}
                    >
                <FormattedMessage id="pos.deal.btn.save" defaultMessage="Save"/>
            </button>
        );
    }

    componentDidUpdate(prevProps) {
        let {submitFailed, errors, currentFields, forceStep, stepIndex, ...props} = this.props;

        if (submitFailed && currentFields && prevProps.currentFields !== currentFields) {

            let currentErrors = currentFields.map(field => field.name).filter(name => getIn(errors, name));

            if (currentErrors.length) {
                props.touch(...currentErrors); // stay in current step and show errors
                props.StepChange(stepIndex, false)
            } else if (forceStep) {
                this.dispatch(handleFaultyStep(errors, 'dealForm'))
            }
        }
    }


    render() {
        const { stepIndex,handleSubmit, accessKeys, taccode, isDisabled, ...props } = this.props;

        let actionButton = DEFAULT_EMPTY;
        if (this.props.events && this.props.events.length) {//todo:@Issam @aladin move into composant or first in render function
            let eventFirst = this.props.events[0];
            const eventSelected = this.props.onEvent;

            let eventsList = this.props.events.map((eventss, index) => {
                if (eventss.tmffonction != eventFirst.tmffonction) { //else an undefined items ...
                    return (
                        <MenuItem key={index} onSelect={handleSubmit((data) => eventSelected(data, eventss))}>
                            {eventss.eventlabel}
                        </MenuItem>
                    )
                }
            });


            if (this.props.events.length > 1) {
                actionButton =
                    <div className="col-md-12">
                        <SplitButton bsSize="small" bsStyle={'primary'} title={eventFirst.eventlabel}
                                     id={`split-button-basic-primary`} disabled={isDisabled}
                                     onClick={handleSubmit((data) => eventSelected(data, eventFirst))    }>
                            {eventsList}
                        </SplitButton>
                    </div>
            } else if (this.props.events.length === 1 && this.props.defaultworkflow && this.props.defaultworkflow != "" && !this.props.dosid) {
                //TODO: @Issam i was a button before i want a button
                actionButton = <div className="action-label" key="eventsGroup">
                    <a onClick={handleSubmit((data) => eventSelected(data, eventFirst))}
                       key={eventFirst.tmffonction} className="btn btn-primary">{eventFirst.eventlabel}</a>

                </div>;


             } //TODO: @Aladin return the same
            else if (this.props.events.length === 1 && this.props.dosid) {

                actionButton = <div className="action-label" key="eventsGroup">
                    <a onClick={handleSubmit((data) => eventSelected(data, eventFirst))}
                       key={eventFirst.tmffonction} className="btn btn-primary">{eventFirst.eventlabel}</a>

                </div>;


            }
        }
        let actionLabel = !this.props.currentJalcode ? DEFAULT_EMPTY :
            <StepDisplay code={this.props.currentJalcode} wrapper="span" type="button" disabled="true"/>;


        let actorSection = DEFAULT_EMPTY;
        if (!this.props.dosid && !this.props.dealLoading) {
            actorSection = [
                <ProspectContainer accessKeys={accessKeys}
                                   route={ACTOR_ROUTE}
                                   form="dealForm"
                                   rolcode={this.props.customerRolcode ? this.props.customerRolcode : CLIENT}
                                   key="deal-ProspectContainer"
                                   boxTitle={<FormattedMessage id="pos.deal.prospectbox.title"
                                                               defaultMessage="Prospect information"/>}
                                   actorIndex={ZERO}
                                   searchTitle={<FormattedMessage
                                       id="pos.deal.customersearch.title"
                                       defaultMessage="Search customer"/>}
                                   newTitle={<FormattedMessage id="pos.deal.newprospect.title"
                                                               defaultMessage="New Prospect"/>}/>
            ]

            if (this.props.coCustomerStatus == 1) {
                actorSection.push(
                    <ProspectContainer accessKeys={accessKeys}
                                       route={ACTOR_ROUTE}
                                       form="dealForm"
                                       rolcode={this.props.coCustomerRolcode ? this.props.coCustomerRolcode : COCLIEN}
                                       key="deal-CoBorrowerContainer"
                                       boxTitle={<FormattedMessage id="pos.deal.coborrowerbox.title"
                                                                   defaultMessage="Co-Borrower Information"/>}
                                       actorIndex={ONE}
                                       searchTitle={<FormattedMessage
                                           id="pos.deal.customersearch.title"
                                           defaultMessage="Search customer"/>}
                                       newTitle={<FormattedMessage id="pos.deal.newcustomer.title"
                                                                   defaultMessage="New customer"/>}/>
                )
            }
        }

        let customerSection = DEFAULT_EMPTY;

        if (!this.props.dealLoading) {
            customerSection = [<CustomerContainer accessKeys={accessKeys}
                                                  route={ACTOR_ROUTE}
                                                  form="dealForm"
                                                  rolcode={this.props.customerRolcode ? this.props.customerRolcode : CLIENT}
                                                  key="deal-BorrowerContainer"
                                                  boxTitle="Borrower Info"
                                                  searchTitle={<FormattedMessage id="pos.deal.customersearch.title"
                                                                                 defaultMessage="Search customer"/>}
                                                  newTitle={<FormattedMessage id="pos.deal.newcustomer.title"
                                                                              defaultMessage="New customer"/>}/>]


            if (this.props.tpgcode && taccode == TACCODE_PRET) {
                customerSection.push(<CustomerContainer accessKeys={accessKeys}
                                                        route={ACTOR_ROUTE}
                                                        form="dealForm"
                                                        rolcode={this.props.coCustomerRolcode ? this.props.coCustomerRolcode : COBORROWER}
                                                        key="deal-CoBorrowerContainer"
                                                        boxTitle="Co-Borrower Info"
                                                        searchTitle={<FormattedMessage
                                                            id="pos.deal.customersearch.title"
                                                            defaultMessage="Search customer"/>}
                                                        newTitle={<FormattedMessage id="pos.deal.newcustomer.title"
                                                                                    defaultMessage="New customer"/> }/>)
            }

        }
        var steps = [
            {
                id: "pos.newdeal.step.customer",
                default: true,
                order: 1,
                name: <FormattedMessage id="pos.deal.step.customer" defaultMessage='Customer' tagName='div'/>,
                component: customerSection
            },
            {
                default: true,
                order: 2,
                name: <FormattedMessage id="pos.deal.step.assets" defaultMessage='Assets' tagName='div'/>,
                component: <AssetsContainer accessKeys={accessKeys}/>
            },
            {
                default: true,
                order: 3,
                name: <FormattedMessage id="pos.deal.step.quote" defaultMessage='Financial quote' tagName='div'/>,
                component: <FinancialQuoteContainer accessKeys={accessKeys} form="dealForm"/>
            },

            {
                id: "pos.newdeal.step.prospect",
                order: 2,
                name: <FormattedMessage id="pos.deal.step.prospect" defaultMessage='Prospect' tagName='div'/>,
                component: actorSection,
                hidden: true
            },
            {
                id: "pos.newdeal.step.client",
                order: 3,
                name: <FormattedMessage id="pos.deal.step.client" defaultMessage='Client' tagName='div'/>,
                component: (<ClientContainer accessKeys={accessKeys}/>),
                hidden: true
            },
            // {
            //     name: <FormattedMessage id="pos.deal.step.pricingmatrix" defaultMessage='Pricing matrix'
            //                             tagName='div'/>,
            //     component: <Dashboard resources="PRICINGMATRIX" showDashboardEditor={false}/>
            // },

        ];

        if (this.props.dosid) {
            steps.push({
                default: true,
                order: 4,
                name: <FormattedMessage id="pos.deal.step.attach" defaultMessage='Attachments' tagName='div'/>,
                component: <AttachmentsContainer form="dealForm"/>
            })
        }

        let actionbarClass = null;
        if (this.props.flagSelfpayment) {
            actionbarClass = 'col-md-6';
            steps.push({
                default: true,
                order: 5,
                name: <FormattedMessage id="pos.deal.step.selfpayment" defaultMessage='Self payment' tagName='div'/>,
                component: <SelfPaymentContainer form="dealForm" accessKeys={accessKeys} {...this.props}/>
            });
        }

        return (
            <Multistep steps={steps}
                       status={actionLabel}
                       actionbar={actionButton}
                       actionbarClass={actionbarClass}
                       step={stepIndex}
                       custom={this.saveButton}
                       reset={this.resetButton}
                       rightZone={rightZone}
                       onStepChange={this.handleStepChange}
                       accessKeys={accessKeys}
                       id="pos.deal.multistep"
            />
        );
    }
}


const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {

    const errors = getFormSyncErrors('dealForm')(state);
    const currentFields = state.form['dealForm'] ? state.form['dealForm'].registeredFields : DEFAULT_EMPTY;
    let taccode = selector(state, 'deal.taccode');
    return {
        dealLoading: state.newdeal.dealLoading,
        dosid: state.newdeal.formValues.deal.dosid,
        stepIndex: state.newdeal.stepIndex,
        forceStep: state.newdeal.forceStep,
        onEdit: state.newdeal.onEdit,
        currentJalcode: selector(state, 'deal.jalcode'),
        isDisabled: Boolean(state.authentication.user.restrictedaccess),
        tpgcode: selector(state, 'deal.tpgcode'),
        events: state.newdeal.events,
        coCustomerStatus: selector(state, 'cocustomer'),
        taccode,
        errors,
        currentFields,
        defaultworkflow: state.authentication.user.defaultworkflow,
        customerRolcode: state.newdeal.customerRolcode,
        coCustomerRolcode: state.newdeal.coCustomerRolcode,
        attachments: state.attachmentsReducer.documents,
        flagSelfpayment: state.newdeal.flagSelfpayment,
    }
};

export default connect(
    mapStateToProps
)(StepContainer);
