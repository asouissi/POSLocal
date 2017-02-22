import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector, change} from "redux-form";
import TextEntry from "../../../core/components/lib/TextEntry";
import Box from "../../../core/components/lib/Box";
import SelectField from "../../../core/components/lib/SelectField";
import {tables} from "../../../core/reducers/referenceTable";
import DateEntry from "../../../core/components/lib/DateEntry";
import {normalizePhone} from "../../../core/utils/ValidationUtils";
import actorUtils from "../../../common/actor/actorUtils";

const messages = defineMessages({
    countryPlaceHolder: {id: "portal.quote.actor.country.placeholder", defaultMessage: "Select a country"},
    professionPlaceHolder: {id: "portal.quote.actor.profession.placeholder", defaultMessage: "Select a profession"},
    genderPlaceHolder: {id: "portal.quote.actor.gender.placeholder", defaultMessage: "Select gender"},
    residentStatusHolder: {
        id: "portal.quote.actor.residentStatus.placeholder",
        defaultMessage: "Select resident status"
    },
    titleHolder: {id: "portal.quote.actor.title.placeholder", defaultMessage: "Select"},
});

class NewActor extends Component {

    handleNameChange = (value) => {
        var apaprenom = this.props.actor.apaprenom ?
            this.props.actor.apaprenom : '';

        var actnom = this.props.actor.actnom ?
            this.props.actor.actnom : '';

        this.props.dispatch(change("portalquote", "actor.actlibcourt", (apaprenom + " " + actnom).trim()));
    }

    render() {
        const {listActorTelecom, ...props} = this.props;

        let {mail, mobile} = listActorTelecom ? actorUtils.computeTelecomFields(listActorTelecom) : [];
        return (
            <div>
                <div className="text">
                    <font color="navy"><b>Let's start with a few details to check your eligibility</b></font>
                </div>
                <Box type="primary" title="Your personal details">

                    <div className="row">
                        <div className="col-sm-4">
                            <div className="row">
                                <div className="col-sm-4">
                                    <Field name="actor.apatitre" component={SelectField}
                                           placeholder={this.props.intl.formatMessage(messages.titleHolder)}
                                           options={tables.LANTUSPARAM} refParams={{tusnom: 'TITRE'}}
                                           title={<FormattedMessage id="portal.quote.actor.title"
                                                                    defaultMessage="Title"/>}/>
                                </div>
                                <div className="col-sm-8">
                                    <Field name="actor.apaprenom" component={TextEntry}
                                           onChange={this.handleNameChange}
                                           title={<FormattedMessage id="portal.quote.actor.firstname"
                                                                    defaultMessage="First name"/>}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <Field name="actor.apamiddlename" component={TextEntry}
                                   title={<FormattedMessage id="portal.quote.actor.middlename"
                                                            defaultMessage="Middle name (optional)"/>}/>
                        </div>
                        <div className="col-sm-4">

                            <Field name="actor.actnom" component={TextEntry}
                                   onChange={this.handleNameChange}
                                   title={<FormattedMessage id="portal.quote.actor.lastname"
                                                            defaultMessage="Last name"/>}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4">
                            <Field name="actor.apasexe"
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.genderPlaceHolder)}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'GENDERTYPE'}}
                                   title={<FormattedMessage id="portal.quote.actor.gender" defaultMessage="Gender"/>}/>
                        </div>
                        <div className="col-sm-4">
                            <Field component={DateEntry} name="actor.apadtnaiss"
                                   title={ <FormattedMessage id="portal.quote.actor.birthdate"
                                                             defaultMessage="Date of birth"/>}/>
                        </div>
                        <div className="col-sm-4">
                            <Field name={"actor." + mail} component={TextEntry} data-atetype="NET"
                                   title={<FormattedMessage id="portal.quote.actor.email" defaultMessage="E-mail"/>}
                                   type="email"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4">
                            <Field name={"actor." + mobile} component={TextEntry} data-atetype="MOB" normalize={normalizePhone}
                                   title={<FormattedMessage id="portal.quote.actor.mobileno"
                                                            defaultMessage="Mobile no"/>}/>
                        </div>
                        <div className="col-sm-4">
                            <Field name="actor.actresidentcode" component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.residentStatusHolder)}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'ACTRESIDENT'}}
                                   title={<FormattedMessage id="portal.quote.actor.residentStatus"
                                                            defaultMessage="Residential status"/>}/>

                        </div>
                        <div className="col-sm-4">
                            <Field name="actor.listactoraddress[0].paycode" component={SelectField}
                                   options={tables.PAYS}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="portal.quote.actor.country"
                                                            defaultMessage="Country"/>}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4">
                            <Field name="actor.listactoraddress[0].adrville" component={TextEntry}
                                   title={<FormattedMessage id="portal.quote.actor.town"
                                                            defaultMessage="City (Town)"/>}/>
                        </div>
                        <div className="col-sm-4">
                            <Field name="actor.listactoraddress[0].adrcodepost" component={TextEntry}
                                   title={<FormattedMessage id="portal.quote.actor.postcode"
                                                            defaultMessage="Post code"/>}
                            />
                        </div>
                    </div>
                </Box>
            </div>
        );
    }
}
const selector = formValueSelector('portalquote');
const mapStateToProps = (state, props) => {
    return {
        actor: selector(state, 'actor'),
        listActorTelecom: selector(state, 'actor.listactortelecom'),
    }
};

export default connect(
    mapStateToProps
)(injectIntl(NewActor));
