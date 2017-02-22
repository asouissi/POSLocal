import QuoteUtils, { TYPE_VERSEMENT_DOWNPAYMENTARR, TYPE_VERSEMENT_DOWNPAYMENT, TYPE_VERSEMENT_NORMAL}  from "../../utils/QuoteUtils";
import Immutable from 'seamless-immutable'
import {change} from 'redux-form'

export function depositMntChanged(quote, field, depositMnt) {
    quote = Immutable(quote);
    var pct = computePctFromAssetCost(quote, depositMnt);
    quote = quote.merge( {pfimtdeposit: depositMnt, pfipctdeposit: pct});
    quote = computeNetAdvanceMnt(quote);
    quote = computeNetAdvancePct(quote);
    return change('dealForm', field, quote);

}


function computeNetAdvanceMnt(quote) {
    var assetCost = QuoteUtils.getAssetCost(quote);
    if(!assetCost){
        assetCost = 0.0;
    }
    var deposit = quote.pfimtdeposit;
    if(!deposit){
        deposit = 0.0;
    }
    var netAdvance = assetCost - deposit;
    if (netAdvance < 0) {
        netAdvance = undefined;
    }
    return QuoteUtils.isetNetAdvanceMnt(quote, netAdvance);
}

function computeNetAdvancePct(quote) {
    var assetCost = QuoteUtils.getAssetCost(quote) || 0;
    var netAdvanceMnt = QuoteUtils.getNetAdvanceMnt(quote);
    var pct = 0;
    if (assetCost && netAdvanceMnt) {
        pct = netAdvanceMnt / assetCost * 100;
    }
    return QuoteUtils.isetNetAdvancePct(quote, pct);
}

export function setDiscountMnt(quote, field, discountMnt) {
    quote = Immutable(quote);
    var previousDiscountMnt = 0.0;
    var len = quote.listdealquotepayment.length + 1;
    var pct = computePctFromAssetCost(quote, discountMnt);
    quote = quote.update('listdealquotepayment', (list) => {
        let found = false;
        let listPay = list.map(payment => {
            if (payment.pfvtypeversement === TYPE_VERSEMENT_NORMAL) {
                found = true;
                if(payment.pfvmtdiscount) {
                    previousDiscountMnt = payment.pfvmtdiscount;
                }
                return payment.merge({pfvmtdiscount: discountMnt,
                                      pfvpctdiscount: pct})
            }
            return payment
        });
        if (!found) {
            return listPay.concat([{pfvordre:len, pfvtypeversement: TYPE_VERSEMENT_NORMAL, pfvmtdiscount: discountMnt,  pfvpctdiscount: pct}])
        }
        return listPay;
    });
    let attr = QuoteUtils.getQuoteAttribute(quote, QuoteUtils.pfacodes.MAINFINACEAMT.pfacode);
    let mainfinanceamt = 0.0;
    if(attr && attr.pfadouble){
        mainfinanceamt = attr.pfadouble;
    }
    let newMainfinanceamt = mainfinanceamt - ( discountMnt - previousDiscountMnt);
    quote = QuoteUtils.isetQuoteAttribute(quote, QuoteUtils.pfacodes.MAINFINACEAMT.pfacode, {pfadouble: newMainfinanceamt });
    return change('dealForm', field, quote);

}


function computePctFromAssetCost(quote, discountMnt) {
    var ac = QuoteUtils.getAssetCost(quote);
     var pct = 0;
    if (ac && ac > 0 && discountMnt) {
        pct = discountMnt / ac * 100;
    }
    return pct;
}

export function setDownPaymentMnt(quote, field, downPaymentMnt) {
    quote = Immutable(quote);
    var len = quote.listdealquotepayment.length + 1;
    var pct = computePctFromAssetCost(quote, downPaymentMnt);
    var previousDPMnt = 0.0;
    quote = quote.update('listdealquotepayment', (list) => {
        let found = false;
        let listPay = list.map(payment => {
            if ((payment.pfvtypeversement === TYPE_VERSEMENT_DOWNPAYMENTARR) || (payment.pfvtypeversement === TYPE_VERSEMENT_DOWNPAYMENT)) {
                found = true;

                if(payment.pfvmt) {
                    previousDPMnt = payment.pfvmt;
                }

                return payment.merge({pfvmt: downPaymentMnt,
                    pfvpct: pct})
            }
            return payment
        });
        if (!found) {

            return listPay.concat([{pfvordre:len, pfvtypeversement: TYPE_VERSEMENT_DOWNPAYMENTARR, pfvmt: downPaymentMnt,  pfvpct: pct}])
        }
        return listPay;
    });
    quote = quote.merge({pfimtdownpayment: downPaymentMnt,  pfipctdownpayment: pct});
    let attr = QuoteUtils.getQuoteAttribute(quote, QuoteUtils.pfacodes.MAINFINACEAMT.pfacode);

    let mainfinanceamt = 0.0;
    let financedvalue = 0.0;
    if(attr && attr.pfadouble){
        mainfinanceamt = attr.pfadouble;
    }

    if(!mainfinanceamt){
        mainfinanceamt = quote.pfiinvestissement;
    }

    attr = QuoteUtils.getQuoteAttribute(quote, QuoteUtils.pfacodes.FINANCEDVALUE.pfacode);
    if(attr && attr.pfadouble){
        financedvalue = attr.pfadouble;
    }

    if(!financedvalue){
        financedvalue = quote.pfiinvestissement;
    }

    let newMainfinanceamt = mainfinanceamt - (downPaymentMnt - previousDPMnt);
    let newfinancedvalue = financedvalue - (downPaymentMnt - previousDPMnt);
    quote = QuoteUtils.isetQuoteAttribute(quote, QuoteUtils.pfacodes.MAINFINACEAMT.pfacode, {pfadouble: newMainfinanceamt });
    quote = QuoteUtils.isetQuoteAttribute(quote, QuoteUtils.pfacodes.FINANCEDVALUE.pfacode, {pfadouble: newfinancedvalue });
    return change('dealForm', field, quote);

}


export function setResidualValue(quote, field, rvMnt) {
    quote = Immutable(quote);
    var pct = computePctFromAssetCost(quote, rvMnt)
    quote = quote.updateIn(['listdealquoteelement', 0], (element => element.merge({pfrvr: rvMnt, pfrpctvr: pct}))); //First pfirubrique

    return change('dealForm', field, quote);

}

export function searchFirstPaymentAndCreateIt(quote, field){
    quote = Immutable(quote);
    var len = quote.listdealquotepayment.length + 1;
    quote = quote.update('listdealquotepayment', (list) => {
        let found = false;
        let listPay = list.map(payment => {
            if (payment.pfvtypeversement === TYPE_VERSEMENT_NORMAL) {
                found = true;

            }
            return payment
        });
        if (!found) {

            return listPay.concat([{pfvordre:len, pfvtypeversement: TYPE_VERSEMENT_NORMAL, pfvmt: 0.0,  pfvpct: 0.0}])
        }
        return listPay;
    });
    return change('dealForm', field, quote);
}

export function calculateAmoutInclTaxCommission(quote, field) {
    quote = Immutable(quote);
    quote = quote.update('listdealquotecommission', (listCommission) => {
        if (listCommission) {
            let listComm = listCommission.map(commission => {
                var commissionCopy = {};
                Object.assign(commissionCopy, commission);
                Object.assign(commissionCopy, {pcfmttc: commission.pcfmt});
                return commissionCopy;
            });
            return listComm;
        }
    });
    return change('dealForm', field, quote);
}