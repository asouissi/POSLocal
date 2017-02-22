'use strict'
import React, {Component} from "react";
import {FormattedMessage} from "react-intl";
import {Field} from "redux-form";
import Box from "../../../core/components/lib/Box.js";
import TextEntry from "../../../core/components/lib/TextEntry";
import {normalizePhone} from '../../../core/utils/ValidationUtils';
import actorUtils from "../actorUtils";

export default class ActorContact extends Box {
    render() {
        const {
            listActorTelecom, accessKeys
        } = this.props;

        let {phone, mail, site, mobile} = listActorTelecom ? actorUtils.computeTelecomFields(listActorTelecom) : [];
        return (
            <Box title={<FormattedMessage id="common.actor.form.title.contact" defaultMessage="Contact"/>} className="box-primary">

                <Field name={phone} component={TextEntry} data-atetype="TEL" normalize={normalizePhone}
                       title={<FormattedMessage id="common.actor.form.phoneno" defaultMessage="Phone No"/>}
                />

                <Field name={mail} component={TextEntry} data-atetype="NET"
                       title={<FormattedMessage id="common.actor.form.mail" defaultMessage="Email"/>}
                />

                <Field name={site} component={TextEntry} data-atetype="SITE"
                       title={<FormattedMessage id="common.actor.form.website" defaultMessage="Web site"/>}
                />

                <Field name={mobile} component={TextEntry} data-atetype="MOB" normalize={normalizePhone}
                       title={<FormattedMessage id="common.actor.form.mobile" defaultMessage="Mobile"/>}
                />

            </Box>
        )
    }
}
