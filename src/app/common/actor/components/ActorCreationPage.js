'use strict'

import React, {Component} from "react";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {connect} from "react-redux";
import {hashHistory} from 'react-router';
import {notify} from "../../../core/components/lib/notify";
import ActorCreationContainer, {validate} from "./ActorCreationContainer";
import Box from "../../../core/components/lib/Box.js";
import {reduxForm, getFormValues} from "redux-form";
import {saveActor, fetchActor, newActor, changeAddress} from "../reducers/actions";
import {GlobalMessages} from "../../../core/intl/GlobalMessages";
import { accessKeysSelector, additionalAccessKeysSelector } from '../../accesskeys/AccessKeysSelector'
import CustomFieldsBox from "../../accesskeys/CustomFieldsBox"
import AccessKeysValidator from "../../accesskeys/AccessKeysValidator";
import {ACTOR} from "../../../common/index";

const DEFAULT_EMPTY = [];
const DEFAULT_EMPTY_OBJECT = [];
const messages = defineMessages({
    ActorSaveSuccess: {id: "common.actor.notify.save.success", defaultMessage: 'Actor saved'},
    ActorUpdateSuccess: {id: "common.actor.notify.update.success", defaultMessage: 'Actor updated'},
    ActorSaveFailed: {id: "common.actor.notify.save.failure", defaultMessage: 'Actor save failed'}
});


export const validateForm = (values, props) => {
    let errors = AccessKeysValidator.validate(values, props);
    return {...errors ,...validate(values, props)}
};

class ActorCreationPage extends Component {

    handleSubmit = (data) => {
        let actid = data.actid;
        this.props.saveActor(data, (actor) => {
                if (actid) {
                    notify.show(this.props.intl.formatMessage(messages.ActorUpdateSuccess), 'success');
                    return;
                }
                if (this.props.onSaveSuccess) {
                    this.props.onSaveSuccess(actor); //notify driver or customer inside
                    return;
                }
                notify.show(this.props.intl.formatMessage(messages.ActorSaveSuccess), 'success');
                hashHistory.push(ACTOR + '/' + actor.actid);
            }).catch(error=>{
            notify.show(this.props.intl.formatMessage(messages.ActorSaveFailed), 'error');
        });

    };

    componentWillMount() {
        if (this.props.params && this.props.params.actorId) {
            this.props.fetchActor(this.props.params.actorId, this.props.keys.customFields);
        } else {
            this.props.newActor(this.props.rolcode, this.props.keys.customFields);
        }
    }

    handleReset = () => {
        this.props.reset();
        this.props.dispatch(changeAddress(0));
    }

    render() {
        let pristine = this.props.pristine;
        let submitting = this.props.submitting;


        let buttons = DEFAULT_EMPTY;

        if (this.props.params) {
            buttons = ([<button type="button" className="btn btn-danger" onClick={this.handleReset}
                                disabled={pristine || submitting}>
                <FormattedMessage id="common.actor.form.btn.reset" defaultMessage="Reset"/></button>]);
        }
        let title = this.props.title || (this.props.actid ?
                <FormattedMessage id="common.actor.form.actorDetailTitle" defaultMessage="Actor detail"/> :
                <FormattedMessage id="common.actor.form.newActorTitle" defaultMessage="New actor"/>);

        return (
            <form className="actor-creation-form" onSubmit={this.props.handleSubmit(this.handleSubmit)}>
                <Box className="actor-creation" type="primary" title={title}>
                    <ActorCreationContainer {...this.props}/>
                </Box>
                <CustomFieldsBox {...this.props} accessKeysRoute="/actor" form="actor"/>

                <div className="text-right">
                    {buttons}
                    <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>
                        {<FormattedMessage id="common.actor.form.btn.save" defaultMessage="Save"/>}
                    </button>

                </div>

            </form>);
    }
}
const  keysSelector =  accessKeysSelector();
const  customFieldsSelector =  additionalAccessKeysSelector();

const mapStateToProps = (state, props) => {
    var route = props.route &&  props.route.path.split('(').shift();
    var values = getFormValues('actor')(state);
    let accessKeys = keysSelector(route, state.authentication.accesskeys, values);
    let customFields = customFieldsSelector(route, state.authentication.accesskeys, values);

    let keys = state.authentication.accesskeys.find(item => {
        return route.match(item.key)
    });
    return {
        initialValues: state.actor.actor,
        accessKeys,
        customFields,
        keys: keys || DEFAULT_EMPTY_OBJECT,
        actid: state.actor.actor.actid
    }
};

const mapDispatchToProps = {
    saveActor, fetchActor, newActor
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
        form: 'actor',
        validate: validateForm,
        enableReinitialize: true
    },
)(injectIntl(ActorCreationPage)));
