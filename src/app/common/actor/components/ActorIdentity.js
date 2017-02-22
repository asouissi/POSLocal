'use strict'
import React from "react";
import {FormattedMessage, defineMessages} from "react-intl";
import {Field} from "redux-form";
import Box from "../../../core/components/lib/Box";
import ActorTypeSelect from "./ActorTypeSelect";
import TextEntry from "../../../core/components/lib/TextEntry";
import SelectField from "../../../core/components/lib/SelectField";
import {tables} from "../../../core/reducers/referenceTable";
import {normalizeFirstName, normalizeToUppercase} from "../../../core/utils/ValidationUtils";

const messages = defineMessages({
    typePlaceHolder: {id: "common.actor.form.type.placeholder", defaultMessage: "Select a type"}
});

export default class ActorIdentity extends Box {

    handleActorTypeChange = (value) => {
        this.props.dispatch(this.props.change('acttype', value.code));
        if(value.code != 'COMP'){
            this.props.dispatch(this.props.change('actsiret', null));
        }
    };

    handleFirstNameChange = (event) => {
        if (event.target.value) {
            this.props.dispatch(this.props.change('apaprenom', event.target.value));

            var name = this.props.actnom2 ?
                (this.props.apaprenom + ' ' + this.props.actnom2)
                : (this.props.apaprenom);

            this.props.dispatch(this.props.change('actlibcourt', name));
        }
    };

    handleLastNameChange = (event) => {
        if (event.target.value) {
            this.props.dispatch(this.props.change('actnom2', event.target.value));
            this.props.dispatch(this.props.change('actnom', event.target.value));

            var name = this.props.apaprenom ?
                (this.props.apaprenom + ' ' + this.props.actnom2)
                : (this.props.actnom2);

            this.props.dispatch(this.props.change('actlibcourt', name));
        }
    };

    render() {
        const {
            accessKeys
        } = this.props;
        const readOnly = this.props.acttype == 'PART' ? true : false;
        const isTypeCompany = this.props.acttype != 'COMP' ? true : false;
        return (
            <Box title={<FormattedMessage id="common.actor.form.title.idendity"
                defaultMessage="Identity"/>} className="box-primary">

                <Field name="acttype" component={ActorTypeSelect} {...accessKeys.acttype}
                       onChange={this.handleActorTypeChange}
                       title={<FormattedMessage id="common.actor.form.type" defaultMessage="Type"/>}
                       placeholder={this.props.intl.formatMessage(messages.typePlaceHolder)}/>


                <Field name="apaprenom" {...accessKeys.apaprenom} component={TextEntry}
                       onChange={readOnly && this.handleFirstNameChange} normalize={normalizeFirstName}
                       title={<FormattedMessage id="common.actor.form.firstname" defaultMessage="First name"/>}
                />

                <Field name="actnom2" component={TextEntry} onChange={readOnly && this.handleLastNameChange}
                       accessKey={accessKeys.actnom2} normalize={normalizeToUppercase}
                       title={<FormattedMessage id="common.actor.form.lastname" defaultMessage="Last name"/>}
                />

                <Field name="actlibcourt" component={TextEntry} accessKey={accessKeys.actlibcourt} disabled={readOnly}
                       title={<FormattedMessage id="common.actor.form.shortname" defaultMessage="Short name"/>}
                />

                <Field name="actnom" component={TextEntry} accessKey={accessKeys.actnom} disabled={readOnly}
                       title={<FormattedMessage id="common.actor.form.legalentityname"
                                                defaultMessage="Legal entity name"/>}
                />

                <Field name="actsiret" component={TextEntry} disabled={isTypeCompany}
                       title={<FormattedMessage id="common.actor.form.companyregistrationno"
                                                defaultMessage="Company registration no"/>}
                />

                <Field name="cjucode" component={SelectField}
                       title={<FormattedMessage id="common.actor.form.legalclassification"
                                                defaultMessage="Legal classification"/>}
                       options={tables.CATJURIDIQUE} refParams={{actortype: this.props.acttype}}
                />
            </Box>
        )
    }
}
