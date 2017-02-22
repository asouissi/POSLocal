import {formValueSelector, change, arrayPush} from 'redux-form'
import each from 'lodash/each';
import Immutable from 'seamless-immutable'

export const DOC_FEE = 'UKDOFI';
export const DOC_FEE_OPTION = 'UKOPFEEVAT';
export const COMMISSION_TCOCODE = 'UKCOM';
export const TYPE_VERSEMENT_DEPOSIT = "DOWNPAYMENTARR";
export const TYPE_VERSEMENT_NORMAL = "NORMAL";
export const TYPE_VERSEMENT_DOWNPAYMENT = "DOWNPAYMENT"; //DOWN PAYMENT => TYPE { DOWNPAYMENTARR OR DOWNPAYMENT }
export const TYPE_VERSEMENT_DOWNPAYMENTARR = "DOWNPAYMENTARR"; //DOWN PAYMENT => TYPE { DOWNPAYMENTARR OR DOWNPAYMENT }

export default class QuoteUtils {
     static  pfacodes = {
         ADVANCEPAYMENT: {pfacode: "ADVANCEPAYMENT", pfatype: "pfaentier"},
         AMOUNTTTC: {pfacode: "AMOUNTTTC", pfatype: "pfadouble"},
         ASSETVATAMOUNT: {pfacode: "ASSETVATAMOUNT", pfatype: "pfadouble"},
         BALLOONDATE: {pfacode: "BALLOONDATE", pfatype: "pfadate"},
         CHECKASSETVAT: {pfacode: "CHECKASSETVAT", pfatype: "pfaentier"},
         COLLSETUPAMOUNT: {pfacode: "COLLSETUPAMOUNT", pfatype: "pfadouble"},
         CUSTOMERRATE: {pfacode: "CUSTOMERRATE", pfatype: "pfadouble"},
         DEFAULTRATE: {pfacode: "DEFAULTRATE", pfatype: "pfadouble"},
         DEFCOMMADJUST: {pfacode: "DEFCOMMADJUST", pfatype: "pfaentier"},
         DEPOINADVANCED: {pfacode: "DEPOINADVANCED", pfatype: "pfadouble"},
         DEPOSITPAIDOEM: {pfacode: "DEPOSITPAIDOEM", pfatype: "pfadouble"},
         DRUDTDEB: {pfacode: "DRUDTDEB", pfatype: "pfadate"},
         DURPROFIL: {pfacode: "DURPROFIL", pfatype: "pfachaine"},
         DWPPCTMAX: {pfacode: "DWPPCTMAX", pfatype: "pfadouble"},
         DWPPCTMIN: {pfacode: "DWPPCTMIN", pfatype: "pfadouble"},
         FINALAMOUNT: {pfacode: "FINALAMOUNT", pfatype: "pfadouble"},
         FINANCEDIOFAMT: {pfacode: "FINANCEDIOFAMT", pfatype: "pfadouble"},
         FINANCEDVALUE: {pfacode: "FINANCEDVALUE", pfatype: "pfadouble"},
         FIRSTAMOUNT: {pfacode: "FIRSTAMOUNT", pfatype: "pfadouble"},
         FOLLOWEDBY: {pfacode: "FOLLOWEDBY", pfatype: "pfaentier"},
         MAINFINACEAMT: {pfacode: "MAINFINACEAMT", pfatype: "pfadouble"},
         MATURITYFORCED: {pfacode: "MATURITYFORCED", pfatype: "pfaentier"},
         MATYRITYDATE: {pfacode: "MATYRITYDATE", pfatype: "pfadate"},
         MTSUBSIDY: {pfacode: "MTSUBSIDY", pfatype: "pfadouble"},
         NBTERM: {pfacode: "NBTERM", pfatype: "pfaentier"},
         NETADVANCEMT: {pfacode: "NETADVANCEMT", pfatype: "pfadouble"},
         NONFINANCEDIOF: {pfacode: "NONFINANCEDIOF", pfatype: "pfadouble"},
         PCTRVMAX: {pfacode: "PCTRVMAX", pfatype: "pfadouble"},
         PCTRVMIN: {pfacode: "PCTRVMIN", pfatype: "pfadouble"},
         PCTSUBSIDY: {pfacode: "PCTSUBSIDY", pfatype: "pfadouble"},
         PFIRATCATNUM: {pfacode: "PFIRATCATNUM", pfatype: "pfaentier"},
         PFIRATORDRE: {pfacode: "PFIRATORDRE", pfatype: "pfaentier"},
         PLUSVATDIFF: {pfacode: "PLUSVATDIFF", pfatype: "pfaentier"},
         REALRENTALAMT: {pfacode: "REALRENTALAMT", pfatype: "pfadouble"},
         RENTALAMOUNT: {pfacode: "RENTALAMOUNT", pfatype: "pfadouble"},
         TAEA: {pfacode: "TAEA", pfatype: "pfadouble"},
         TAEG: {pfacode: "TAEG", pfatype: "pfadouble"},
         TAEGBIS: {pfacode: "TAEGBIS", pfatype: "pfadouble"},
         UPDENDDATE: {pfacode: "UPDENDDATE", pfatype: "pfaentier"},
         VATINSTALNUM: {pfacode: "VATINSTALNUM", pfatype: "pfaentier"},
         DTFIRSTPAYMENT: {pfacode: "DTFIRSTPAYMENT", pfatype: "pfaentier"},

    };

    static getQuotePayment(quote, key) {
        if (!quote.listdealquotepayment) return {};
        var qp = quote.listdealquotepayment.find((p) => p.pfvtypeversement === key);
        return qp || {};
    }

    static getQuoteAttribute(quote, key) {
        if (!quote) return {};
        var listdealquoteattribute = quote.listdealquoteattribute;
        if (!listdealquoteattribute) return {};

        var dealQuoteAttribute = listdealquoteattribute.find((p) => p.pfacode === key);

        return dealQuoteAttribute || {};
    }

    static createQuoteAttributeAction(quote, form, quoteField, key, values) {
        var listdealquoteattribute = quote.listdealquoteattribute;
        if (!listdealquoteattribute) {
            return arrayPush(form, `${quoteField}.listdealquoteattribute`, {pfacode: key, ...values});
        }


        var index = listdealquoteattribute.findIndex((p) => p.pfacode === key);
        if (index === -1) {
            return arrayPush(form, `${quoteField}.listdealquoteattribute`, {pfacode: key, ...values});
        }

        var attr = '.listdealquoteattribute[' + index + ']';
        return change(form, quoteField + attr, {pfacode: key, ...values});
    }

    static getQuoteAttributeField(quote, attribute) {
        return '.listdealquoteattribute[' + quote.listdealquoteattribute.findIndex((p) => p.pfacode === attribute) + ']';
    }

    static getQuotePaymentField(quote, key) {
        return '.listdealquotepayment[' + quote.listdealquotepayment.findIndex((p) => p.pfvtypeversement === key) + ']';
    }

    static getQuoteCommissionField(quote, key) {
        var list = quote.listdealquotecommission.filter(item => item.tcocode === key);
        let maxPfcOrdre = list.length> 0 ? Math.max(...list.map(o => o.pfcordre)) : 1;
        var indexLastComm = list && quote.listdealquotecommission.findIndex((p) => (p.pfcordre===maxPfcOrdre && p.tcocode === key)) || {};

        return '.listdealquotecommission[' + indexLastComm + ']';
    }


    static createQuotePayementAction(quote, form, quoteField, key, values) {
        quote = Immutable(quote);
        var listdealquotepayment = quote.listdealquotepayment;

        if (!listdealquotepayment) {
            return arrayPush(form, `${quoteField}.listdealquotepayment`, {pfvtypeversement: key, ...values});
        }
        quote = quote.update('listdealquotepayment', (list) => {
            var found = false;
            let listdealquotepayments = list.map(payment => {
                if (payment.pfvtypeversement == key) {
                    found = true;
                    return payment.merge(values)
                }
                return payment
            });
            if (!found) {
                return listdealquotepayments.concat([{pfvtypeversement: key, ...values}])
            }
            return listdealquotepayments;
        });

        return change(form, quoteField, quote);

    }

    static isetQuoteAttribute(quote, attribute, values) {
        return quote.update('listdealquoteattribute', (list) => {
            var found = false;
            let listdealquoteattribute = list.map(attr => {
                if (attr.pfacode == attribute) {
                    found = true;
                    return attr.merge(values)
                }
                return attr
            });

            if (!found) {
                return listdealquoteattribute.concat([{pfacode: attribute, ...values}])
            }

            return listdealquoteattribute;
        });
    }

    static isetQuotePayment(quote, pfvtypeversement, values) {
        return quote.update('listdealquotepayment', (list) => {
            return list.map(payment => {
                if (payment.pfvtypeversement == pfvtypeversement) {
                    return payment.merge(values)
                }
                return payment
            })
        });
    }

    static getQuoteElement(quote) {
        return quote.listdealquoteelement && quote.listdealquoteelement.length ? quote.listdealquoteelement[0] : {}
    }

    static isetQuoteElement(quote, values, elementIndex = 0) {
        return quote.updateIn(['listdealquoteelement', elementIndex], (element => element.merge(values)))
    }


    static getQuoteCommission(quote, key) {
        if (!quote.listdealquotecommission) return {};
        var listdealquotecommission = quote.listdealquotecommission;
        let maxPfcOrdre = listdealquotecommission.length> 0 ? Math.max(...listdealquotecommission.map(o => o.pfcordre)) : 1;
        var dealQuoteCommission = listdealquotecommission.find((p) => (p.tcocode === key && p.pfcordre===maxPfcOrdre));
        return dealQuoteCommission || {};
    }

    static isetQuoteCommission(quote, tcocode, values) {

        return quote.update('listdealquotecommission', (list) => {
            return list.map(com => {
                if (com.tcocode == tcocode) {
                    return com.merge(values)
                }
                return com
            })
        });
    }

    static getQuoteService(quote, key) {
        var list = quote.listdealquoteservice.filter(item => item.tprcode === key);
        let maxPfpOrdre = list.length> 0 ? Math.max(...list.map(o => o.pfpordre)) : 1;
        var qs = list && list.find((p) => (p.pfpordre===maxPfpOrdre)) || {};
        return qs;
    }

    static getQuoteServiceField(quote, key) {
        var list = quote.listdealquoteservice.filter(item => item.tprcode === key);
        let maxPfpOrdre = list.length> 0 ? Math.max(...list.map(o => o.pfpordre)) : 1;
        var index = quote.listdealquoteservice.findIndex((p) => p.pfpordre===maxPfpOrdre && p.tprcode === key);
        return '.listdealquoteservice[' + index + ']';
    }

    static isetQuoteService(quote, tprcode, values) {
        return quote.update('listdealquoteservice', (list) => {
            return list.map(service => {
                if (service.tprcode == tprcode) {
                    return service.merge(values)
                }
                return service
            })
        });
    }


    static isetAssetCost(quote, mnt) {
        let nquote = quote.set('pfiinvestissement', mnt);
        nquote = this.isetQuoteElement(nquote, {pfrmontant: mnt});

        return nquote;
    }

    static getAssetCost(quote) {
        return quote.pfiinvestissement;
    }

    static isetDepositMnt(quote, mnt) {
        let nquote = quote.set('pfimtdownpayment', mnt);

        return nquote;
    }

    static getDepositMnt(quote) {
        return quote.pfimtdownpayment;
    }

    static getDepositMntField(quote, quoteField) {
        return quoteField + '.pfimtdownpayment';
    }

    static getDownPaymentPctField(quote, quoteField) {
        return quoteField + this.getQuotePaymentField(quote, TYPE_VERSEMENT_DOWNPAYMENTARR) + '.pfvpct';
    }
    static getDownPaymentMntField(quote, quoteField) {
        return quoteField + this.getQuotePaymentField(quote, TYPE_VERSEMENT_DOWNPAYMENTARR) + '.pfvmt';
    }

    static getDepositPctField(quote, quoteField) {
        return quoteField + '.pfipctdownpayment';
    }

    static getDepositPct(quote) {
        return quote.pfipctdownpayment;
    }

    static isetDepositPct(quote, pct) {
        let nquote = quote.set('pfipctdownpayment', pct);
        return nquote;
    }

    static isetNetAdvanceMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'MAINFINACEAMT', {pfadouble: mnt})
    }

    static getNetAdvanceMnt(quote) {
        return this.getQuoteAttribute(quote, 'MAINFINACEAMT').pfadouble;
    }

    static getNetAdvanceMntField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'MAINFINACEAMT') + '.pfadouble';
    }


    static isetNetAdvancePct(quote, pct) {
        return this.isetQuoteAttribute(quote, 'TMP_PCTFINVALUE', {pfadouble: pct})
    }

    static getNetAdvancePct(quote) {
        return this.getQuoteAttribute(quote, 'TMP_PCTFINVALUE').pfadouble;
    }

    static getNetAdvancePctField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_PCTFINVALUE') + '.pfadouble';
    }

    static getAssetVATMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'ASSETVATAMOUNT');
        return attr.pfadouble || 0;
    }

    static getVATMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_MTVAT');
        return attr.pfadouble || 0;
    }

    static getVATMntField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_MTVAT') + '.pfadouble';
    }

    static isetVATPct(quote, pct) {
        return this.isetQuoteAttribute(quote, 'TMP_PCTVAT', {pfadouble: pct});
    }

    static getVATPctField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_PCTVAT') + '.pfadouble';
    }

    static getVATPct(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_PCTVAT');
        return attr.pfadouble;
    }

    static isetFindWhat(quote, f) {
        return this.isetQuoteAttribute(quote, 'TMP_FINDWHAT', {pfachaine: f})
    }

    static getFindWhat(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_FINDWHAT');
        return attr.pfachaine;
    }

    static getFindWhatField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_FINDWHAT') + '.pfachaine';
    }

    static getFindFromField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_FINDFROM') + '.pfachaine';
    }

    // Find From
    static isetFindFrom(quote, f) {
        return this.isetQuoteAttribute(quote, 'TMP_FINDFROM', {pfachaine: f})
    }

    static getFindFrom(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_FINDFROM');
        return attr.pfachaine;
    }

    // Margin
    static isetMargin(quote, mnt) {
        return this.isetQuoteElement(quote, {pfrmargenominale: mnt});
    }

    static getMargin(quote) {
        return QuoteUtils.getQuoteElement(quote).pfrmargenominale;
    }

// Yield
    static isetYield(quote, mnt) {
        return this.isetQuoteElement(quote, {pfrtotalnominal: mnt});
    }

    static getYield(quote) {
        return this.getQuoteElement(quote).pfrtotalnominal;
    }

    static getQuoteName(quote) {
        return quote.pfinom;
    }

    // APR
    static getAPRField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_APR') + '.pfadouble';
    }

    static getAPR(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_APR');
        return attr.pfadouble;
    }

// NPV
    static isetNPV(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'TMP_NPV', {pfadouble: mnt});
    }

    static getNPV(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_NPV');
        return attr.pfadouble;
    }

// Flat Rate
    static isetFlatRate(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'TMP_FLATRATE', {pfadouble: mnt});
    }

    static getFlatRate(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_FLATRATE');
        return attr.pfadouble;
    }

    static getFlatRateField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_FLATRATE') + '.pfadouble';
    }

// NPC
    static isetNPC(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'TMP_NPC', {pfadouble: mnt});
    }

    static getNPC(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_NPC');
        return attr.pfadouble;
    }

    static isetQuoteType(quote, value) {
        return this.isetQuoteAttribute(quote, 'TMP_QUOTETYPE', {pfachaine: value});
    }

    static getQuoteType(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_QUOTETYPE');
        return attr.pfachaine;
    }

    static isetTermEditable(quote, value) {
        return this.isetQuoteAttribute(quote, 'TMP_TERMEDIT', {pfaentier: value});
    }

    static getTermEditable(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_TERMEDIT');
        return attr.pfaentier;
    }

    static getTermEditableField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'TMP_TERMEDIT') + '.pfaentier';
    }


// VAT
    static isetVATMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'TMP_MTVAT', {pfadouble: mnt});
    }


// COMMISSION
    static isetCommissionMnt(quote, mnt) {
        return this.isetQuoteCommission(quote, COMMISSION_TCOCODE, {pcfmt: mnt});
    }

    static getCommissionMnt(quote) {
        let comm = this.getQuoteCommission(quote, COMMISSION_TCOCODE);
        return comm.pcfmt;
    }

    static getCommissionMntField(quote, quoteField) {
        return quoteField + this.getQuoteCommissionField(quote, COMMISSION_TCOCODE) + '.pcfmt';
    }

    static isetCommissionPct(quote, pct) {
        return this.isetQuoteCommission(quote, COMMISSION_TCOCODE, {pcftx: pct});
    }

    static getCommissionPctField(quote, quoteField) {
        return quoteField + this.getQuoteCommissionField(quote, COMMISSION_TCOCODE) + '.pcftx';
    }

    static getCommissionPct(quote) {
        let comm = this.getQuoteCommission(quote, COMMISSION_TCOCODE);
        return comm.pcftx;
    }

// Subsidy
    static isetSubsidyMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'MTSUBSIDY', {pfadouble: mnt});
    }


    static getSubsidyMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'MTSUBSIDY');
        return attr.pfadouble;
    }

    static getSubsidyMntField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'MTSUBSIDY') + '.pfadouble';
    }

    static isetManSubsidyMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'MTMANSUBSIDY', {pfadouble: mnt});
    }

    static getManSubsidyMntField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'MTMANSUBSIDY') + '.pfadouble';
    }

    static getManSubsidyMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'MTMANSUBSIDY');
        return attr.pfadouble;
    }

    static isetManSubsidyPct(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'PCTMANSUBSIDY', {pfadouble: mnt});
    }

    static getManSubsidyPctField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'PCTMANSUBSIDY') + '.pfadouble';
    }

    static getManSubsidyPct(quote) {
        let attr = this.getQuoteAttribute(quote, 'PCTMANSUBSIDY');
        return attr.pfadouble;
    }

    static isetDealerSubsidyMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'MTDEALERSUBSIDY', {pfadouble: mnt});
    }

    static getDealerSubsidyMntField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'MTDEALERSUBSIDY') + '.pfadouble';
    }

    static getDealerSubsidyMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'MTDEALERSUBSIDY');
        return attr.pfadouble;
    }

    static isetDealerSubsidyPct(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'PCTDEALSUBSIDY', {pfadouble: mnt});
    }

    static getDealerSubsidyPctField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'PCTDEALSUBSIDY') + '.pfadouble';
    }

    static getDealerSubsidyPct(quote) {
        let attr = this.getQuoteAttribute(quote, 'PCTDEALSUBSIDY');
        return attr.pfadouble;
    }

    static isetSubsidyPct(quote, pct) {
        return this.isetQuoteAttribute(quote, 'PCTSUBSIDY', {pfadouble: pct});
    }

    static getSubsidyPctField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'PCTSUBSIDY') + '.pfadouble';
    }

    static getSubsidyPct(quote) {
        let attr = this.getQuoteAttribute(quote, 'PCTSUBSIDY');
        return attr.pfadouble;
    }

// Cost of Funds
    static isetCostOfFunds(quote, mnt) {
        return this.isetQuoteElement(quote, {pfrtxnominal: mnt});
    }

    static getCostOfFundsField(quote, quoteField) {
        return quoteField + '.listdealquoteelement[0].pfrtxnominal';
    }

    static getCostOfFunds(quote) {
        return QuoteUtils.getQuoteElement(quote).pfrtxnominal;
    }

    static isetPaymentFrequency(quote, pf) {
        return quote.set('pfiperiodicite', pf);
    }

    static getPaymentFrequency(quote) {
        return quote.pfiperiodicite;
    }

    static getPaymentFrequencyField(quoteField) {
        return quoteField + '.pfiperiodicite';
    }


    static isetFinanceType(quote, ft) {
        return quote.set('tpgcode', ft);
    }

    static getFinanceType(quote) {
        return quote.tpgcode;
    }

// Profile
    static isetProfile(quote, pf) {
        return quote.set('pfinbperiodes', pf);
    }

    static getProfile(quote) {
        return quote.pfinbperiodes;
    }

    static isetTerm(quote, t) {
        return this.isetQuoteAttribute(quote, 'NBTERM', {pfadouble: t});
    }

    static getTerm(quote) {
        let attr = QuoteUtils.getQuoteAttribute(quote, 'NBTERM');
        return attr.pfaentier;
    }

    static getTermField(quote, quoteField) {
        return quoteField + QuoteUtils.getQuoteAttributeField(quote, 'NBTERM') + ".pfaentier";
    }
    static getFollowedByField(quote, quoteField) {
        return quoteField + QuoteUtils.getQuoteAttributeField(quote, 'FOLLOWEDBY') + ".pfaentier";
    }

    static getPeriodiciteField(quote, quoteField) {
        return quoteField + ".pfiperiodicite";
    }


    static getAdvancePaymentField(quote, quoteField) {
        return quoteField + QuoteUtils.getQuoteAttributeField(quote, 'ADVANCEPAYMENT') + ".pfaentier";
    }

    static getDurationProfilField(quote, quoteField) {
        return quoteField + QuoteUtils.getQuoteAttributeField(quote, 'DURPROFIL') + ".pfachaine";
    }

    static getAdvancePayment(quote) {
        let attr = QuoteUtils.getQuoteAttribute(quote, 'ADVANCEPAYMENT');
        return attr.pfaentier;
    }

    // Balloon
    static isetBalloonMnt(quote, mnt) {
        let quoteAfterUpdate =  this.isetQuoteAttribute(quote, 'FINALAMOUNT', {pfadouble: mnt});
        return this.isetQuoteElement(quoteAfterUpdate, {pfrvr: mnt});
    }

    static getBalloonMnt(quote) {
       // return this.getQuoteElement(quote).pfrvr;
        let attr = QuoteUtils.getQuoteAttribute(quote, 'FINALAMOUNT');
        return attr.pfaentier;
    }

    static getBalloonMntField(quoteField) {
        return quoteField + '.listdealquoteelement[0].pfrvr';
    }

    static isetBalloonPct(quote, pct) {
        return this.isetQuoteElement(quote, {pfrpctvr: pct});
    }

    static getBalloonPct(quote) {
        return this.getQuoteElement(quote).pfrpctvr;
    }

    static getBalloonPctField(quoteField) {
        return quoteField + '.listdealquoteelement[0].pfrpctvr';
    }


// RV
    static isetRVMnt(quote, mnt) {
        return this.isetQuoteAttribute(quote, 'TMP_MTRV', {pfadouble: mnt});
    }

    static getRVMnt(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_MTRV');
        return attr.pfadouble;
    }

    static isetRVPct(quote, pct) {
        return this.isetQuoteAttribute(quote, 'TMP_PCTRV', {pfadouble: mnt});
    }

    static getRVPct(quote) {
        let attr = this.getQuoteAttribute(quote, 'TMP_PCTRV');
        return attr.pfadouble;
    }

// Ballon/RV Date
    static isetBalloonRVDate(quote, dt) {
        return this.isetQuoteAttribute(quote, 'BALLOONDATE', {pfadate: dt});
    }

    static getBalloonRVDate(quote) {
        let attr = this.getQuoteAttribute(quote, 'BALLOONDATE');
        return attr.pfadate;
    }

    static getBalloonRVDateField(quote, quoteField) {
        return quoteField + this.getQuoteAttributeField(quote, 'BALLOONDATE') + '.pfadate';
    }

// Documentation Fee
    static isetDocumentationFeeMnt(quote, mnt) {
        return this.isetQuoteService(quote, DOC_FEE, {pfpmtreverse: mnt});
    }

    static getDocumentationFeeMnt(quote) {
        let srv = this.getQuoteService(quote, DOC_FEE);
        return srv.pfpmtreverse;
    }

    static getDocumentationFeeMntField(quote, quoteField) {
        return quoteField + this.getQuoteServiceField(quote, DOC_FEE) + '.pfpmtreverse';
    }

    static isetDocumentationFeePct(quote, mnt) {
        return this.isetQuoteService(quote, DOC_FEE, {pfptxreverse: mnt});
    }

    static getDocumentationFeePct(quote) {
        let srv = this.getQuoteService(quote, DOC_FEE);
        return srv.pfptxreverse;
    }

    static getDocumentationFeePctField(quote, quoteField) {
        return quoteField + this.getQuoteServiceField(quote, DOC_FEE) + '.pfptxreverse';
    }

// Option Fee
    static isetOptionFeeMnt(quote, mnt) {
        return this.isetQuoteService(quote, DOC_FEE_OPTION, {pfpmtreverse: mnt});
    }

    static getOptionFeeMnt(quote) {
        let srv = this.getQuoteService(quote, DOC_FEE_OPTION);
        return srv.pfpmtreverse;
    }

    static getOptionFeeMntField(quote, quoteField) {
        return quoteField + this.getQuoteServiceField(quote, DOC_FEE_OPTION) + '.pfpmtreverse';
    }

    static isetOptionFeePct(quote, mnt) {
        return this.isetQuoteService(quote, DOC_FEE_OPTION, {pfptxreverse: mnt});
    }

    static getOptionFeePct(quote) {
        let srv = this.getQuoteService(quote, DOC_FEE_OPTION);
        return srv.pfptxreverse;
    }

    static getOptionFeePctField(quote, quoteField) {
        return quoteField + this.getQuoteServiceField(quote, DOC_FEE_OPTION) + '.pfptxreverse';
    }

    static getPaymentMnt(quote) {
        return this.getQuoteElement(quote).pfrmtloyer;
    }

    static isetPaymentMnt(quote, amount) {
        let quoteAfterUpdate = this.isetQuoteAttribute(quote, 'RENTALAMOUNT', {pfadouble: amount});
        return this.isetQuoteElement(quoteAfterUpdate, {pfrmtloyer: amount});
    }

//new quote
    static getScaleId(quote) {
        return quote.pcrid;
    }

    static getScaleOrder(quote) {
        return quote.pcrordre;
    }

    static getKilometrage(quote) {
        return quote.pfikilometrage;
    }

    static getKMUnite(quote) {
        return quote.pfiunitemesure;
    }

    static getPfimtdeposit(quote) {
        return quote.pfimtdeposit;
    }

    static getFirtPayment(quote) {
        return quote.pfimtpremierloyer;
    }
    static getQuoteElementValue(quote, field) {
        var result = null;
        each(QuoteUtils.getQuoteElement(quote), (value, key) => {

            if( key === field)
                result = value;
        });
        return result;
    }
    static getQuotePaymentValue(quote, typeVersement, field) {

        var result = null;
        each(QuoteUtils.getQuotePayment(quote, typeVersement), (value, key) => {

            if( key === field)
                result = value;
        });
        return result;
    }
    static getQuoteAttributeFieldValue(quote, quoteField, pfacods){
        return quoteField + QuoteUtils.getQuoteAttributeField(quote, pfacods.pfacode) + "." + pfacods.pfatype;
    }



}

