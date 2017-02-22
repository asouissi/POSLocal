'use strict'
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {formValueSelector, Field} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import Box from "../../../../core/components/lib/Box";
import SearchEntry from "../../../../core/components/lib/SearchEntry";
import SearchSelect from "../../../../core/components/lib/SearchSelect";
import SelectField from "../../../../core/components/lib/SelectField";
import actors from "../../../../common/actor";
import {setCustomerNumber, setCustomer, changeActtype, setActtype, clearCustomer} from "../reducers/actions";
import {injectIntl, defineMessages} from "react-intl";
import {fetchActors} from "../../../../common/actor/reducers/actor";

const DEFAULT_EMPTY = [];

const messages = defineMessages({
    customertypePlaceHolder: {id: "pos.customer.type.placeholder", defaultMessage: 'Select a customer type'},
    customernumberPlaceHolder: {id: "pos.customer.number.placeholder", defaultMessage: 'Number'},
    customernamePlaceHolder: {id: "pos.customer.name.placeholder", defaultMessage: 'Name'},
    customeridPlaceHolder: {id: "pos.customer.id.placeholder", defaultMessage: 'Actor ID'},
    customernumberTitle: {id: "pos.customer.number.title", defaultMessage: 'Number'},
    customernameTitle: {id: "pos.customer.name.title", defaultMessage: 'Name'},
    customeridTitle: {id: "pos.customer.id.title", defaultMessage: 'Actor ID'}

});
const {ActorSearchPopup} = actors.components;

class Customer extends Component {

    componentWillReceiveProps(nextProps) {
        let actor = nextProps.actor;
        if (actor && actor.actid && actor.actid !== this.props.actor.actid) {
            this.props.dispatch(setActtype(actor.actid, nextProps.actorIndex))
        }
    }

    handleCustomerSearch = () => {
        this.refs.actorPop.toggle();
    }
    handleCustomerConsult = () => {
        this.refs.actorPop.toggle(true, this.props.actor.actid);
    };

    handleActorTypeChange = (value) => {
        this.props.dispatch(fetchActors({acttype: value.code}));
    };

    onActorSelected = (actor) => {
        this.refs.actorPop.toggle();
        var currentActor = this.props.actor;
        var lamordre = null;
        if (currentActor.actcode === actor.actcode) {
            return;
        }
        if (currentActor) {
            lamordre = currentActor.lamordre;
        }

        this.props.dispatch(setCustomer(this.props.form, this.props.rolcode, actor, this.props.actorList, lamordre));
        this.props.dispatch(setActtype(actor.actid));
    }

    onCreateActor = (actor) => {
        this.refs.actorPop.toggle();
        this.props.dispatch(setCustomer(this.props.form, this.props.rolcode, actor, this.props.actorList));
    }

    handleCustomerNumberSearch = (event) => {
        var actcode = event.target.value;

        var actor = this.props.actor;
        if (actor.actcode === actcode || (!actor.actcode && !actcode)) {
            return;
        }
        this.props.dispatch(setCustomerNumber(this.props.form, actcode, this.props.rolcode));
    }

    handleCustomerInputChange = (value, customer) => {
        var currentActor = this.props.actor;
        if (customer) {
            var lamordre = null;
            if (currentActor) {
                lamordre = currentActor.lamordre;
            }
            this.props.dispatch(setCustomer(this.props.form, this.props.rolcode, customer, this.props.actorList, lamordre));
        }
        else {
            this.props.dispatch(clearCustomer(this.props.form, this.props.rolcode, this.props.actorList, currentActor));
        }
    }


    get actor() {
        return `${this.props.actorList}[${this.props.actorIndex}]`
    }

    render() {

        let {actor, ...props} = this.props;
        let clReadOnly = this.props.readOnly ? 'read-only' : '';
        var actorPop = (<ActorSearchPopup ref="actorPop" rolcode={this.props.rolcode} rolcodes={this.props.rolcodes}
                                          acttype={this.props.isActorTypeHidden ? undefined : this.props.acttype}
                                          route={this.props.route}
                                          onActorClick={this.onActorSelected}
                                          onCreateActor={this.onCreateActor} searchTitle={this.props.searchTitle}
                                          newTitle={this.props.newTitle}/>);

        var toolBox = [];

        if (this.props.actor.actid) {
            toolBox = (    <div className="box-tools pull-right">
                <button type="button" className="btn btn-box-tool" onClick={this.handleCustomerConsult}>
                    <i className="fa fa-edit"></i>
                </button>
            </div> )
        }

        let customerType = <Field
            key="actorType" hidden={this.props.isActorTypeHidden}
            name={`${this.actor}.acttype`}
            options={tables.LANTTRPARAM}
            component={SelectField}
            refParams={{ttrnom: 'TYPECLIENT', tpgcode: this.props.tpgcode}}
            onChange={this.handleActorTypeChange}
            placeholder={this.props.intl.formatMessage(messages.customertypePlaceHolder)}/>

        let customerNumber = <SearchEntry key="actorCode"
            title={this.props.customernumberTitle ? this.props.customernumberTitle : this.props.intl.formatMessage(messages.customernumberTitle)}
            placeholder={this.props.intl.formatMessage(messages.customernumberPlaceHolder)}
            value={actor.actcode || ""}
            onChange={this.handleCustomerNumberChanged}
            onSearch={this.handleCustomerNumberSearch}
            onSearchClick={this.handleCustomerSearch}/>


        let params = {rolcodes: this.props.rolcodes};
        if(!this.props.isActorTypeHidden){
            params.acttype = this.props.acttype
        }
        let customerName = <SearchSelect key="customerName"
            title={this.props.customernameTitle ? this.props.customernameTitle : this.props.intl.formatMessage(messages.customernameTitle)}
            value={
                actor.actcode ? {
                        actcode: actor.actcode,
                        actlibcourt: actor.actlibcourt
                    } : undefined}
            onChange={this.handleCustomerInputChange}
            url="/actors"
            valueKey="actcode"
            labelKey="actlibcourt"
            inputParamsKey="actlibcourt"
            params={params}
            clearable={this.props.isSearchEntryClearable || false}
            placeholder={this.props.intl.formatMessage(messages.customernamePlaceHolder)}/>;

        var customerPanel = [customerType, customerNumber, customerName];

        if (!this.props.isActorTypeHidden) { // not good  value to check
            customerPanel = ( <Box type="primary" title={this.props.boxTitle} withBoder="true" tools={toolBox}>
                {customerPanel}
            </Box>);
        }
        //maybe box type panel/secondary
        return (
            <div className={"customer " + clReadOnly}>
                {actorPop}
                {customerPanel}
            </div>)
    }
}

Customer.propTypes = {
    route: React.PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => {
    let dealPath = '';
    var reducer = state.newdeal2;
    if (props.form == 'dealForm') {
        reducer = state.newdeal;
        dealPath = 'deal.'
    } else if (props.form == 'drawdeal') {
        reducer = state.newdeal3;
    } else if (props.form == 'dealQuote') {
        reducer = state.newdeal2;
    }
    var actorList =  props.actorList || 'listdealactor'
    actorList = dealPath + actorList
    const selector = formValueSelector(props.form);
    let listdealactor = selector(state, actorList);
    var actorIndex = listdealactor ? listdealactor.findIndex((actor) => actor.rolcode == props.rolcode): -1;
    var acttype = reducer.acttypes[actorIndex];

    return {
        tpgcode: selector(state, dealPath+'tpgcode') || "TOUT",
        actorIndex: actorIndex,
        readOnly: reducer.readOnly,
        actor: selector(state, `${actorList}[${actorIndex}]`) || {},
        acttype: acttype,
        actorList,
    }


};

export default connect(
    mapStateToProps
)(injectIntl(Customer));
