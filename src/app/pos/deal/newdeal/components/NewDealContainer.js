import React, {Component} from "react";
import {connect} from "react-redux";
import Immutable from "seamless-immutable";
import {defineMessages, injectIntl} from "react-intl";
import {
    getFormValues,
    formValueSelector,
    reduxForm,
    SubmissionError,
    getFormSyncErrors,
    change
} from "redux-form";
import StepContainer from "./StepContainer";
import NewdealTabsContainer from "./NewdealTabsContainer";
import {notify} from "../../../../core/components/lib/notify";
import {
    newDeal,
    newMF,
    fetchDeal,
    saveDeal,
    handleFaultyStep,
    executeEvent,
    saveActor,
    closeDeal,
    validateIban
} from "../reducers/actions";
import {updateDocumentsProps, cleanDocumentList} from "../../attachments/reducers/actions";
import "../../../../core/components/lib/prog-tracker.css";
import {accessKeysSelector} from "../../../../common/accesskeys/AccessKeysSelector";
import {GlobalMessages} from "../../../../core/intl/GlobalMessages";
import AccessKeysValidator from "../../../../common/accesskeys/AccessKeysValidator";
import {hashHistory} from "react-router";
import {DEAL} from "../../../index";
import {resetVariant} from "../../assets/reducers/actions";
import setIn from "redux-form/lib/structure/plain/setIn";
import {validateProspect} from "./ProspectContainer";
import {validateCustomer} from "./ClientContainer";
import max from "lodash/max";
import getIn from "redux-form/lib/structure/plain/getIn";
import {CLIENT, COCLIEN, BORROWER, COBORROWER} from "../../utils/dealUtils";
const MFDEAL = "/pos/masterfacility";

const messages = defineMessages({
    dealSaveSuccess: {id: "pos.deal.notify.save.success", defaultMessage: 'Deal saved'},
    dealSaveError: {id: "pos.deal.notify.save.error", defaultMessage: 'Cannot save deal'},
    dealEventError: {id: "pos.deal.notify.event.error", defaultMessage: 'Cannot execute deal event'},
    actorSaveSuccess: {id: "pos.deal.notify.actor.save.success", defaultMessage: 'Customer saved'},
    actorSaveError: {id: "pos.deal.notify.actor.save.error", defaultMessage: 'Cannot save Customer'},
    dealUpdateSuccess: {id: "pos.deal.notify.update.success", defaultMessage: 'Deal updated'},
    customerMandatory: {id: "pos.deal.errors.customer", defaultMessage: 'Customer selection is mandatory'},
    borrowerMandatory: {id: "pos.deal.errors.borrower", defaultMessage: 'Borrower selection is mandatory'},
    coborrowerMandatory: {id: "pos.deal.errors.coborrower", defaultMessage: 'Co-Borrower selection is mandatory'},
    lastNameMandatory: {id: "pos.deal.errors.lastname", defaultMessage: 'Last name required'},
    tradeNameMandatory: {id: "pos.deal.errors.tradename", defaultMessage: 'Trade name required'},
    done: {id: "pos.deal.notify.event.done", defaultMessage: 'Done'},
    ibanformat: {id: "pos.deal.client.contactreferences.iban", defaultMessage: 'Incorrect IBAN format'},
});
const validate = (values, props) => {

    if (!values) return
    let {deal} = values;
    if (!deal) return {};

    let errors = AccessKeysValidator.validate(values, props);

    let productDealAttrib = deal.listdealattribute ? deal.listdealattribute.find(item => item.datcode === 'TPGTYPE') : null;
    let index = productDealAttrib ?
        deal.listdealattribute.indexOf(productDealAttrib) :
        deal.listdealattribute.length;
    if (!productDealAttrib || !productDealAttrib.datstringdata) {
        errors = setIn(errors, 'deal.listdealattribute[' + index + '].datstringdata', GlobalMessages.fieldRequire);
    }

    if (!deal.dealextrainfo || !deal.dealextrainfo.dcodealtype) {
        errors = setIn(errors, 'deal.dealextrainfo.dcodealtype', GlobalMessages.fieldRequire);
    }

    if (!values.deal.tpgcode) {
        errors = setIn(errors, 'deal.tpgcode', GlobalMessages.fieldRequire);
    }


    const prospectAccessKey = props.accessKeys["pos.newdeal.step.prospect"];
    if (!deal.dosid && prospectAccessKey && !prospectAccessKey.hidden) {
        errors = validateProspect(values, props, errors);
    }

    const clientAccessKey = props.accessKeys["pos.newdeal.step.client"];
    if (deal.dosid && clientAccessKey && !clientAccessKey.hidden) {
        errors = validateCustomer(values, props, errors);
    }

    if (Object.keys(errors).length) {
        let error = [GlobalMessages.fieldsRequire]; //done because user must understand arror can be on other tab
        errors._error = errors._error ? errors._error.concat(error) : error;
    }
    var actorClient = values.deal.listdealactor.find((actor) => actor.rolcode === props.customerRolcode)
        || values.listActor.find((actor) => actor.rolcode === props.customerRolcode);

    if (!actorClient) {
        let error = [messages.customerMandatory];
        errors._error = errors._error ? errors._error.concat(error) : error;
    }


    return errors;
};

const asyncValidate = (values, dispatch, props, blurredField) => {
    let {listActor} = values;
    let errors = {};
    if (blurredField && blurredField.match(".iban")) {
        let iban = getIn(values, blurredField);
        if (iban)
            return validateIban(iban).then(response => {
                if (!response.data) {
                    errors = setIn(errors, blurredField, messages.ibanformat);
                }
                else if (response.data.ribid) {
                    dispatch(change(props.form, blurredField.replace('.iban', ''), response.data));
                }
                return errors;
            });
    }

    return Promise.resolve(errors);

}

const roles = [CLIENT, COCLIEN, BORROWER, COBORROWER]
const transformActorToDealActor = (dispatch, actors, listdealactor) => {
    let nextOrder = max(listdealactor.map(item => item.dpaordre)) + 1;

    //if actor is empty, implicitly we use the customer selection, but may be when we add actor we must add actor in this list insteand direculy in listdealactor ;)
    actors.length && roles.forEach(role => {
        const dealActor = listdealactor.find(actor => actor.rolcode == role); //there is a deal actor
        if (!actors.find(actor => actor.rolcode == role) && dealActor) {
            listdealactor = listdealactor.map(actorToDelete => {
                if (actorToDelete.rolcode === dealActor.rolcode) {
                    return {...actorToDelete, action: '-'}
                }
                return actorToDelete
            }) //delete actor no actor with this role
        }
    });

    actors.forEach(actorData => {
        // if (!actor.listactorrole) return;
        let actor = actorData.actor;
        let ribid = actor.listactorbankaccount.length ? actor.listactorbankaccount[actor.listactorbankaccount.length - 1].ribid : null;

        let dealActor = listdealactor.find(item => item.actid === actor.actid && item.rolcode === actorData.rolcode);
        let newdDealActor = {
            rolcode: actorData.rolcode,
            actcode: actor.actcode,
            actlibcourt: actor.actlibcourt,
            actnom: actor.actnom,
            actid: actor.actid,
            ribiddec: ribid,
            ribidenc: ribid,
        }
        if (!dealActor) { // if no actor add it
            listdealactor = Immutable.set(listdealactor, listdealactor.length, {
                ...newdDealActor,
                dpaordre: nextOrder++
            })
        }
        else { // update
            let dealActorIndex = listdealactor.findIndex(item => item.actid === actor.actid);
            if (actor.listactorbankaccount.length > 0 && dealActorIndex != -1) {
                listdealactor = Immutable.set(listdealactor, dealActorIndex, {
                    ...dealActor,
                    ...newdDealActor
                })
            }
        }
    });
    return listdealactor;
}

export class NewDeal extends Component {

    componentWillUnmount() {
        this.props.closeDeal();
    }

    handleSaveClicked = (data) => {

        if (this.props.dosid) {
            this.props.updateDocumentsProps(this.props.dosid);
        }
        if (this.props.error) return;

        return new Promise((resolve, reject) => {

            this.saveActors(data).then((actors) => {
                let deal = Immutable.set(data.deal, 'listdealactor', transformActorToDealActor(this.props.dispatch, actors, data.deal.listdealactor)) //TODO: change actorVO to dealActorVO

                this.props.saveDeal(deal)
                    .then(result => {
                        let dosid = result.deal.dosid;
                        if (deal.dosid) {
                            notify.show(this.props.intl.formatMessage(messages.dealUpdateSuccess), 'success');
                            this.props.dispatch(this.props.fetchDeal(dosid, this.props.stepIndex));
                        } else {
                            notify.show(this.props.intl.formatMessage(messages.dealSaveSuccess), 'success');
                            hashHistory.push(DEAL + '/' + dosid);
                        }
                        resolve(result.deal); //end of promise
                    })
                    .catch(error => {
                        reject(error); //end of promise
                        notify.show(this.props.intl.formatMessage(messages.dealSaveError), 'error');
                    })


            }).catch(error => {
                reject(error);
                notify.show(this.props.intl.formatMessage(messages.dealSaveError), 'error');
                throw new Error(error);
            })
        });
    };

    saveActors(data) {
        let globalPromise = new Promise((resolved, rejected) => {
            let actors = []; //we can't use result of promise.all we have to manage the role
            let promises = data.listActor.map((actorData, index) => this.props.saveActor(actorData, index)
                .then(actor => {
                        actors.push({rolcode: actorData.rolcode, actor});
                        notify.show(this.props.intl.formatMessage(messages.actorSaveSuccess), 'success', 1000);
                    }
                ).catch(error => {
                    notify.show(this.props.intl.formatMessage(messages.actorSaveError), 'error', 1000);
                    return rejected(error)
                })
            );
            Promise.all(promises).then(results => {
                resolved(actors)
            })
        })

        return globalPromise; //we use this promise instead of the array of promises because we use a tmp array of actors
    }

    handleEventSelected = (data, event) => {
        if (this.props.error) return;

        return new Promise((resolve, reject) => {
            this.saveActors(data)
                .then(actors => {
                    let deal = Immutable.set(data.deal, 'listdealactor', transformActorToDealActor(this.props.dispatch, actors, data.deal.listdealactor)) //TODO: change actorVO to dealActorVO

                    this.props.executeEvent(deal, event, () => {
                            notify.show(this.props.intl.formatMessage(messages.done), 'success');
                        },
                        (error) => {
                            notify.show(this.props.intl.formatMessage(messages.dealEventError), 'error');
                            throw new SubmissionError({_error: []})
                        }
                    );
                })
                .catch(error => {
                    reject(error);
                    notify.show(this.props.intl.formatMessage(messages.dealEventError), 'error');
                    throw new Error(error);
                })
        })
    }

    handleReset = () => {
        this.props.reset();
        if (this.props.params.dealid) {
            this.props.dispatch(this.props.fetchDeal(this.props.params.dealid));
        }
        else {
            this.props.dispatch(this.props.resetVariant());
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((!nextProps.onEdit && nextProps.params.dealid !== this.props.params.dealid)
            || (nextProps.params.dealid !== this.props.params.dealid)
            || (nextProps.route.path != this.props.route.path )) {

            if (nextProps.route.path == MFDEAL) {
                this.props.newMF();
            } else if (!nextProps.params.dealid) {
                this.props.newDeal();
                this.props.cleanDocumentList();
            } else {
                this.props.fetchDeal(nextProps.params.dealid, nextProps.stepIndex);
            }
        }

    }

    componentWillMount() {
        if (this.props.route.path == MFDEAL) {
            this.props.newMF();
        } else if (this.props.params.dealid) {
            this.props.fetchDeal(this.props.params.dealid);
        } else {
            this.props.newDeal();
        }
    }

    render() {
        const {handleSubmit, submitFailed, accessKeys, error, ...props} = this.props;

        return (
            <div className="row newDeal">
                <from onSubmit={handleSubmit(this.handleSaveClicked)} ref="form" className="col-md-8">
                    <StepContainer form="dealForm" accessKeys={accessKeys} {...this.props}
                                   onSave={this.handleSaveClicked}
                                   onReset={this.handleReset}
                                   onEvent={this.handleEventSelected}/>
                </from>
                <div className="col-md-4">
                    <NewdealTabsContainer submitFailed={submitFailed} syncErrors={props.errors} error={error}
                                          accessKeys={accessKeys}/>
                </div>
            </div>
        );
    }
}

NewDeal = reduxForm({
        form: 'dealForm',
        validate,
        asyncValidate,
        asyncBlurFields: ['listActor[].actor.listactorbankaccount[].iban'],
        enableReinitialize: true,
        keepDirtyOnReinitialize: true,
        onSubmitFail: (syncErrors, dispatch, submitError) => {
            dispatch(handleFaultyStep(syncErrors, 'dealForm'))
        }
    }
)(NewDeal);

const keysSelector = accessKeysSelector();
//Never map global state otherwise all component will be re render
// please try do to the the same with deal object, this object mute every time too
const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    var route = props.route.path.split('(').shift();

    const values = getFormValues('dealForm')(state);
    let accessKeys = keysSelector(route, state.authentication.accesskeys, values);

    const errors = getFormSyncErrors('dealForm')(state);
    return {
        initialValues: state.newdeal.formValues,
        dosid: state.newdeal.formValues.deal.dosid,
        stepIndex: state.newdeal.stepIndex,
        onEdit: state.newdeal.onEdit,
        currentJalcode: selector(state, 'deal.jalcode'),
        accessKeys,
        errors,
        customerRolcode: state.newdeal.customerRolcode,
    }
};

const mapDispatchToProps = {
    newDeal,
    newMF,
    fetchDeal,
    saveDeal,
    updateDocumentsProps,
    cleanDocumentList,
    resetVariant,
    executeEvent,
    saveActor,
    closeDeal,
    validateIban
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(NewDeal));
