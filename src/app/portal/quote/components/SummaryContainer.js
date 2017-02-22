/**
 * Created by PrashantK on 16-11-2016.
 */
'use strict'
import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl, FormattedMessage, FormattedDate} from "react-intl";
import Box from "../../../core/components/lib/Box";
import {tables, getReferenceTable, fetchReferenceTableWithParams} from "../../../core/reducers/referenceTable";
import {formValueSelector} from "redux-form";

class Summary extends Component {

    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {tusnom: 'GENDERTYPE'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {tusnom: 'QUALITE'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {tusnom: 'ACTRESIDENT'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {tusnom: 'TITRE'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.PAYS));
    }

    render() {
        let {formatNumber, formats} = this.props.intl;

        let {listTitle, listGenderType, listResidentStatus} = this.props;
        let actorTitle = listTitle && listTitle.find(item => item.code === this.props.actor.apatitre);
        let actorName = this.props.actor && (this.props.actor.apaprenom ? "  " + this.props.actor.apaprenom : "").concat(this.props.actor.apamiddlename ? "  " + this.props.actor.apamiddlename : "").concat(this.props.actor.actnom ? "  " + this.props.actor.actnom : "")
        let actorGender = listGenderType && listGenderType.find(item => item.code === this.props.actor.apasexe);
        let actorResidenceStatus = listResidentStatus && listResidentStatus.find(item => item.code === this.props.actor.actresidentcode);
        let listActorAddress = this.props.actor && this.props.actor.listactoraddress;
        let paycode = listActorAddress && listActorAddress[0] && listActorAddress[0].paycode;
        let country = this.props.listCountry && this.props.listCountry.find(item => item.code === paycode);
        let deal = this.props.deal;
        let listActorTelecom = this.props.actor && this.props.actor.listactortelecom;
        return (

            <div >
                <Box type="primary" title="Your personal details">
                    <div className="panel-collapse collapse in">
                        <dl className="dl-horizontal">
                            <dt><FormattedMessage id="portal.quote.summary.actorName" defaultMessage="Actor name"/></dt>
                            <dd>{actorTitle && actorTitle.label + " " + actorName}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.shortName" defaultMessage="Short name"/></dt>
                            <dd>{this.props.actor && this.props.actor.actlibcourt}</dd>

                            <dt><FormattedMessage id="portal.quote.summary.gender" defaultMessage="Gender"/></dt>
                            <dd>{actorGender && actorGender.label}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.dob" defaultMessage="Date of birth"/></dt>
                            <dd>{this.props.actor &&
                            <FormattedDate value={new Date(this.props.actor.apadtnaiss)} day="numeric"
                                           month="numeric" year="numeric"/>}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.residencialStat"
                                                  defaultMessage="Residencial Status"/></dt>
                            <dd>{actorResidenceStatus && actorResidenceStatus.label}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.email" defaultMessage="Email"/></dt>
                            <dd>{listActorTelecom && listActorTelecom[0] && listActorTelecom[0].atenum}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.mob" defaultMessage="Mobile number"/></dt>
                            <dd>{listActorTelecom && listActorTelecom[1] && listActorTelecom[1].atenum}</dd>

                            <dt><FormattedMessage id="portal.quote.summary.country" defaultMessage="Country"/></dt>
                            <dd>{country && country.label}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.Actcity" defaultMessage="City"/></dt>
                            <dd>{listActorAddress && listActorAddress[0] && listActorAddress[0].adrville}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.actorPostcode" defaultMessage="Post code"/>
                            </dt>
                            <dd>{listActorAddress && listActorAddress[0] && listActorAddress[0].adrcodepost}</dd>
                        </dl>
                    </div>
                </Box>

                <Box className="actor-creation" type="primary" title="Loan Details">
                    <div className="panel-collapse collapse in">
                        <dl className="dl-horizontal">
                            <dt><FormattedMessage id="portal.quote.summary.loanAmount"
                                                  defaultMessage="Loan Amount"/></dt>
                            <dd>{deal && formatNumber(this.props.loanCost, formats.number.currencyFormat) }</dd>
                            <dt><FormattedMessage id="portal.quote.summary.loanTerm"
                                                  defaultMessage="Loan term"/></dt>
                            <dd>{deal && this.props.loanTerm + " Months"}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.aprRate"
                                                  defaultMessage="Respresentative APR."/></dt>
                            <dd>{deal && formatNumber(this.props.aprRate, {style: 'percent', maximumFractionDigits: 2})}</dd>
                            <dt><FormattedMessage id="portal.quote.summary.monthlyrepay"
                                                  defaultMessage="Monthly repayment"/></dt>
                            <dd>{deal && formatNumber(this.props.monthly, formats.number.currencyFormat) }</dd>
                            <dt><FormattedMessage id="portal.quote.summary.totalrepay"
                                                  defaultMessage="Total repayment"/></dt>
                            <dd>{deal && formatNumber(this.props.total, formats.number.currencyFormat)}</dd>
                        </dl>
                    </div>
                </Box>
            </div>
        );
    }
}

const selector = formValueSelector('portalquote');
const mapStateToProps = (state, props) => {
    return {
        user: state.portalquote.user, // selector(state, user)
        actor: state.portalquote.actor, //// selector(state, actor)
        deal: state.portalquote.deal, // selector(state, deal)
        loanCost: state.portalquote.loanCost, // since these values are not saved in db and not there in VO, so , not taken in deal
        loanTerm: state.portalquote.loanTerm,
        aprRate: state.portalquote.aprRate,
        monthly: state.portalquote.monthly,
        total: state.portalquote.total,
        listGenderType: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'GENDERTYPE'}).data,
        listResidentStatus: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'ACTRESIDENT'}).data,
        listTitle: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'TITRE'}).data,
        listCountry: getReferenceTable(state, tables.PAYS).data,
    }
};

export default connect(
    mapStateToProps
)(injectIntl(Summary));