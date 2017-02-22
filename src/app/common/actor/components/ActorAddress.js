'use strict'
import React, {Component} from "react";
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {Field, formValueSelector} from "redux-form";
import Box from "../../../core/components/lib/Box.js";
import TextEntry from "../../../core/components/lib/TextEntry";
import SearchSelect from "../../../core/components/lib/SearchSelect";
import SelectField from "../../../core/components/lib/SelectField";
import {tables} from "../../../core/reducers/referenceTable";
import {connect} from "react-redux";
import {changeAddress, addAddress} from "../reducers/actions";

const messages = defineMessages({
    addAddressTitle: {id: "common.actor.form.btn.addaddress.title", defaultMessage: 'Add address'},
    countryPlaceHolder: {id: "common.actor.form.country.placeholder", defaultMessage: "Select a country"},
    postCodePlaceHolder: {id: "common.actor.form.postcode.placeholder", defaultMessage: "Select a post code"}
});

const DEFAULT_EMPTY = [];
const ADR_DELIVERY = 'DELIVERY';
const ADR_INVOICE = 'INVOICE';
const ADR_MAIL = 'MAIL';
const ADR_HEADOFFICE = 'HEADOFFICE';


class ActorAddress extends Box {
    constructor(props) {
        super(props);
    }

    handleNewAddress = () => {
        this.props.dispatch(addAddress(this.props.listactoraddress.length));
    }

    handleChangeAddress = (index) => {
        this.props.dispatch(changeAddress(index));
    }

    handlePostCodeChange = (value) => {
        this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].adrville', value.label));
    };

    handleCountryChange = (value) => {
        this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].paycode', value.code));
        this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].adrville', ''));
    };

    handleAdrTypeChange = (value) => {
        switch (value.code) {
            case ADR_DELIVERY:
                return this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].aadflaglivraison', 1));
            case ADR_INVOICE:
                return this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].aadflagfacturation', 1));
            case ADR_MAIL:
                return this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].aadflagcourrier', 1));
            case ADR_HEADOFFICE:
                return this.props.dispatch(this.props.change('listactoraddress[' + this.props.addressIndex + '].aadflagsiege', 1));
        }
    }

    get currentAddress() {
        return 'listactoraddress[' + this.props.addressIndex + ']';
    }


    render() {
        const {
            listactoraddress, accessKeys, intl
        } = this.props;

        let addressTab = DEFAULT_EMPTY;
        const {formatMessage} = intl;
        let tabs = DEFAULT_EMPTY;
        if (listactoraddress && listactoraddress.length > 0) {
            tabs = listactoraddress.map((address, index) => {
                let cl = this.props.addressIndex === index && listactoraddress.length > 1 ? "btn btn-primary" : "btn btn-default";
                return <button className={cl} type="button"
                               onClick={() => this.handleChangeAddress(index)}>{1 + index}</button>;
            });
        }

        addressTab = (<div className="address-tab">
                {tabs}
                <button className="btn btn-primary fa fa-plus" type="button" disabled={false}
                        onClick={this.handleNewAddress} title={formatMessage(messages.addAddressTitle)}>
                </button>
            </div>
        )

        // define default webservice to retrieve post code
        let address = listactoraddress && listactoraddress[this.props.addressIndex] ? listactoraddress[this.props.addressIndex] : {};
        let postcodeurl = '/referencetable?table=codepostal&paycode=&postcode=';
        // if the country is defined, update the webservice of post code to filter on the selected country
        if (address && address.paycode && address.paycode) {
            postcodeurl = '/referencetable?table=codepostal&paycode=' + address.paycode + '&postcode=';
        }

        return (
            <div>
                <div className="row">
                    {addressTab}
                </div>
                <Box title={<FormattedMessage id="common.actor.form.title.address" defaultMessage="Address"/>}
                     className="box-primary">
                    <Field name={`${this.currentAddress}.adrtype`} component={SelectField}
                           title={ <FormattedMessage id="common.actor.form.addressType"
                                                     defaultMessage="Address type"/>}
                           options={tables.LANTUSPARAM} refParams={{tusnom: 'ADRTYPE'}}
                           onChange={this.handleAdrTypeChange}/>

                    <Field name={`${this.currentAddress}.adrvoie`} component={TextEntry}
                           title={ <FormattedMessage id="common.actor.form.line1"
                                                     defaultMessage="Address line 1"/>}/>

                    <Field name={`${this.currentAddress}.adrlieudit`} component={TextEntry}
                           title={ <FormattedMessage id="common.actor.form.line2"
                                                     defaultMessage="Address line 2"/>}/>

                    <Field name={`${this.currentAddress}.paycode`} component={SelectField}
                           options={tables.PAYS}
                           title={<FormattedMessage id="common.actor.form.country" defaultMessage="Country"/>}
                           placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                           onChange={this.handleCountryChange}/>

                    <Field name={`${this.currentAddress}.adrcodepost`} component={SelectField}
                           title={<FormattedMessage id="common.actor.form.postcode" defaultMessage="Post code"/>}
                           placeholder={this.props.intl.formatMessage(messages.postCodePlaceHolder)}
                           initValue={address.adrcodepost ? {
                               code: address.adrcodepost,
                               label: address.adrville
                           } : undefined}
                           options={tables.CODEPOSTAL} refParams={{'paycode': this.props.paycode||' '}}
                           labelKey="code"
                           onChange={this.handlePostCodeChange}
                    />
                    <Field name={`${this.currentAddress}.adrville`} component={TextEntry}
                           title={ <FormattedMessage id="common.actor.form.town" defaultMessage="Town"/>}/>

                </Box>
            </div>
        )
    }
}

const selector = formValueSelector('actor');
const mapStateToProps = (state, props) => {
    const adresse = 'listactoraddress[' + state.actor.addressIndex + ']';
    const paycode = selector(state, `${adresse}.paycode`);
    const listactoraddress = selector(state, 'listactoraddress');
    const addressIndex = (state.actor.addressIndex <= listactoraddress.length) ? state.actor.addressIndex : listactoraddress.length - 1;

    return {
        addressIndex,
        listactoraddress,
        paycode
    }
};


export default connect(
    mapStateToProps
)(injectIntl(ActorAddress));
