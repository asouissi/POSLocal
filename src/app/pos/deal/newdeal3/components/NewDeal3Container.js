import React, {Component} from 'react';
import {connect} from 'react-redux';
import {notify} from '../../../../core/components/lib/notify';

import {Multistep} from '../../../../core/components/lib/react-multistep';
import {StepChange, fetchDeal, fetchDrawDeal, newDrawDeal, saveDrawDeal, fetchUndrawnAssets} from '../reducers/actions';
import {updateDocumentsProps} from '../../attachments/reducers/actions'

import customer from '../../customer';
import DrawAssetContainer from './DrawAssetContainer';
import AttachmentsContainer from '../../attachments/components/AttachmentsContainer';
import GenericSummary from '../../components/GenericSummary';
import GenericTimeline from '../../components/GenericTimeline';
import NavTabs from '../../../../core/components/lib/NavTabs';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';
import {Field, FieldArray, reduxForm} from 'redux-form'
import {GlobalMessages} from '../../../../core/intl/GlobalMessages';
import StepDisplay from "../../../../core/components/lib/StepDisplay";
const DEFAULT_EMPTY = [];
const CustomerContainer = customer.components.CustomerContainer;
const steps =
    [
        {
            name: <FormattedMessage id="pos.drawdeal.step.asset" defaultMessage="Assets" tagName='div'/>,
            component: <DrawAssetContainer />
        },
        {
            name: <FormattedMessage id="pos.drawdeal.step.driver" defaultMessage="Driver" tagName='div'/>, component: [
            <CustomerContainer id="drawdeal" rolcode="DRIVER" form="drawdeal"
                               route={{path: 'pos/driver'}}
                               boxTitle={<FormattedMessage id="pos.drawdeal.maindriverbox.title"
                                                           defaultMessage="Main driver"/>}
                               searchTitle={<FormattedMessage id="pos.drawdeal.driversearch.title"
                                                              defaultMessage="Search driver"/>}
                               newTitle={<FormattedMessage id="pos.drawdeal.newdriver.title"
                                                           defaultMessage="New driver"/>}/>,
            <CustomerContainer id="drawdeal" rolcode="DRIVER2" form="drawdeal"
                               route={{path: 'pos/driver'}}
                               boxTitle={<FormattedMessage id="pos.drawdeal.seconddriverbox.title"
                                                           defaultMessage="Secondary driver"/>}
                               searchTitle={<FormattedMessage id="pos.drawdeal.driversearch.title"
                                                              defaultMessage="Search driver"/>}
                               newTitle={<FormattedMessage id="pos.drawdeal.newdriver.title"
                                                           defaultMessage="New driver"/>}/>
        ]
        },
        {
            name: <FormattedMessage id="pos.drawdeal.step.attach" defaultMessage="Attachments" tagName='div'/>,
            component: <AttachmentsContainer saveDeal={saveDrawDeal} form="drawdeal"/>
        }
    ];

const messages = defineMessages({
    dealSaveSuccess: {id: "pos.drawdeal.notify.save.success", defaultMessage: 'Draw deal saved'},
    dealSaveError: {id: "pos.drawdeal.notify.save.error", defaultMessage: 'Cannot save draw deal'},
    dealUpdateSuccess: {id: "pos.drawdeal.notify.update.success", defaultMessage: 'Draw deal updated'},
    submit: {id: "pos.drawdeal.notify.promote.success", defaultMessage: 'Draw deal submitted'}
});

const validate = values => {
    const errors = {};
    if (!values.assetname) {
        errors.assetname = GlobalMessages.fieldRequire
    }
    return errors
};

export class NewDeal3Container extends Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;

        this.saveButton = (
            <button key="save" className="btn btn-primary"
                    onClick={this.props.handleSubmit(this.handleSaveClicked)}>
                <FormattedMessage id="pos.drawdeal.btn.save.title" defaultMessage="Save"/>
            </button>);
    }

    //handlers use anonymous arrow function to get a bind this inside
    handleSaveClicked = (data) => {
        if (data.dosid && this.props.stepIndex == 2) {
            this.props.updateDocumentsProps(data.dosid);
        }
        //cleaning form data from non valid attribute for the object deal, that will be post to the ws
        delete data.masterfacilitycode;

        this.props.saveDrawDeal(data,
            (dealId, mode) => {
                if (mode === 'U') {
                    notify.show(this.props.intl.formatMessage(messages.dealUpdateSuccess), 'success');
                } else {
                    notify.show(this.props.intl.formatMessage(messages.dealSaveSuccess), 'success');
                }

            },
            (error) => {
                notify.show(this.props.intl.formatMessage(messages.dealSaveError), 'error');
            }
        );
    }

    handleStepChange = (index) => {
        this.props.StepChange(index);
    }
    handleSubmitForApproval_ND3 = () => {
        this.props.submitForApproval(
            () => {
                notify.show(this.props.intl.formatMessage(messages.submit), 'success');
            }
        );
    }

    componentDidMount() {
        const {parentDosId} = this.props.location.query;
        if (this.props.params.dealid && parentDosId) {
            // Load draw deal data from server
            this.props.fetchDrawDeal(this.props.params.dealid);
            // Load parent deal from the server
            this.props.fetchDeal(parentDosId);
            //fetch for undrawn
            this.props.fetchUndrawnAssets(parentDosId);
        } else if (parentDosId) {
            this.props.fetchDeal(parentDosId);
            // Create new deal
            this.props.newDrawDeal(parentDosId);
            //fetch for undrawn
            this.props.fetchUndrawnAssets(parentDosId);
        }
    }

    render() {
        const {stepIndex, dosid} = this.props;

        let actionLabel = !this.props.currentJalcode ? DEFAULT_EMPTY :
            <StepDisplay code={this.props.currentJalcode} wrapper="span" type="button" disabled="true"/>;

        let actionButton = <button className="btn btn-success" type="button"
                                   onClick={this.handleSubmitForApproval_ND3}>
            <FormattedMessage id="pos.drawdeal.btn.submit" defaultMessage="Submit for approval"/>
        </button>;
        var
            tabs = [{
                key: 'summary',
                title: <FormattedMessage id="pos.drawdeal.summary.title" defaultMessage="Summary"/>,
                body: <GenericSummary form="drawdeal" variant={this.props.variant} assetIndex="0"/>
            }, {
                key: 'timeline',
                title: <FormattedMessage id="pos.drawdeal.timeline.title" defaultMessage="Timeline"/>,
                body: <GenericTimeline dosid={this.props.dosid}/>
            }];

        return (

            <div className="row newDeal drawdeal">
                <form className="col-md-8">
                    <Multistep steps={steps}
                               actionbar={actionButton}
                               status={actionLabel}
                               step={stepIndex}
                               custom={this.saveButton}
                               onStepChange={this.handleStepChange}
                    />
                </form>
                { <div className="col-md-4">
                    <NavTabs className="summary" tabs={tabs}/>
                </div>}
            </div>
        )
            ;
    }
}

NewDeal3Container = reduxForm({
        form: 'drawdeal',
        validate,
        enableReinitialize: true
    }
)(NewDeal3Container);
//Never map global state otherwise all component will be re render
// please try do to the the same will deal object, this object mute avery time too
const mapStateToProps = (state, props) => ({
    initialValues: {...state.newdeal3.drawdeal, masterfacilitycode: state.newdeal3.deal.tpgcode}, // new object each time ... do a selector with re-select
    dosid: state.newdeal3.deal.dosid,
    stepIndex: state.newdeal3.stepIndex,
    variant: state.newdeal3.variant,
    undrawns: state.newdeal3.undrawns,
    asset: state.newdeal3.drawdeal.listdealasset[0], // sur ? not from form
    currentJalcode: state.newdeal3.drawdeal.jalcode, // sur ?
});

const mapDispatchToProps = {
    StepChange, fetchDeal, fetchDrawDeal, newDrawDeal, saveDrawDeal, fetchUndrawnAssets, updateDocumentsProps
};
export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(NewDeal3Container));