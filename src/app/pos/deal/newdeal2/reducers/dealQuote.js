import dealUtils, * as dconst from '../../utils/dealUtils'
import QuoteUtils, * as qconst  from '../../utils/QuoteUtils'
import {formValueSelector, change, arrayPush} from 'redux-form'
import {batchActions} from 'redux-batched-actions';
import Immutable from 'seamless-immutable'


import merge from "lodash/merge"
//Deal Quote actions
export const NEW_DEAL_QUOTE = 'quote/deal/NEW_DEAL_QUOTE';
export const NEW_DEAL_QUOTE_SUCCESS = 'quote/deal/NEW_DEAL_QUOTE_SUCCESS';
export const NEW_DEAL_QUOTE_FAILURE = 'quote/deal/NEW_DEAL_QUOTE_FAILURE';
export const CHANGE_DEAL_QUOTE = 'quote/deal/CHANGE_DEAL_QUOTE';
export const CHANGE_DEAL_MAIN_QUOTE = 'quote/deal/CHANGE_DEAL_MAIN_QUOTE';

const COMPUTE_PAYMENT = 'quote/COMPUTE_PAYMENT';
const COMPUTE_PAYMENT_SUCCESS = 'quote/COMPUTE_PAYMENT_SUCCESS';
const COMPUTE_PAYMENT_FAIL = 'quote/COMPUTE_PAYMENT_FAIL';

const BALLOON_MNT_CHANGED = 'quote/BALLOON_MNT_CHANGED';
export const VAT_MNT_CHANGED = 'quote/VAT_MNT';


export function addQuote(quote) {
    return (dispatch, getState) => {
        var deal = getState().form.dealQuote.values;
        dispatch({
            types: [NEW_DEAL_QUOTE, NEW_DEAL_QUOTE_SUCCESS, NEW_DEAL_QUOTE_FAILURE],
            promise: (client) => client.post('/deals/quote/init', deal),
            afterSuccess: (dispatch, getState, result) => {
                var newQuote =  merge(result.data, dconst.INITIAL_DEAL().listdealquote[0]); // quote returned by the init ws
                const nextOrder = deal.listdealquote.length + 1; // compute the dpfordre, because it is not done by th webservice
                newQuote.dpfordre = nextOrder; // fill the dpfordre
                newQuote.pfinom = 'Quote #' + nextOrder; // fill the pfinom, cause it is not done by the init webservice

                dispatch(batchActions([
                    arrayPush('dealQuote', 'listdealquote', newQuote),
                    changeQuote(deal.listdealquote.length)
                ]));
            },
        });
    }

}

export function changeQuote(quoteIndex) {
    return {
        type: CHANGE_DEAL_QUOTE,
        quoteIndex
    }
}

export function setMainQuote(quote) {
    return (dispatch, getState) => {

        var deal = Immutable(getState().form.dealQuote.values);
        dispatch({
            type: CHANGE_DEAL_MAIN_QUOTE,
            quote,
            deal
        });
    }
}

export function setSubSubsidy(quote, quoteField, dealerSubsidyMnt, manSubsidyMnt) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetManSubsidyMnt(quote, manSubsidyMnt);
    quote = QuoteUtils.isetDealerSubsidyMnt(quote, dealerSubsidyMnt);
    quote = QuoteUtils.isetSubsidyMnt(quote, (manSubsidyMnt || 0) + (dealerSubsidyMnt || 0));
    quote = computeSubsidyPct(quote);
    return change('dealQuote', quoteField, quote);

}

export function setAssetCost(quote, form, quoteField, assetCost) {

    quote = Immutable(quote);
    quote = QuoteUtils.isetAssetCost(quote, assetCost);
    quote = computeNetAdvanceMnt(quote);
    quote = computeNetAdvancePct(quote);
    quote = computeDepositPct(quote);
    quote = computeVATPct(quote);
    quote = computeBalloonPct(quote);
    quote = computeDocumentationFeePct(quote);
    quote = computeOptionFeePct(quote);
    quote = computeCommissionPct(quote);
    quote = computeSubsidyPct(quote);
    return change(form, quoteField, quote);

}

export function setQuoteType(quote, form, quoteField, quoteType) {
    return (dispatch, getState) => {
        quote = Immutable(quote);
        quote = QuoteUtils.isetQuoteType(quote, quoteType);

        dispatch(batchActions([
            change(form, quoteField, quote)
        ]));

    }

}

export function setCommissionMnt(quote, field, commission) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetCommissionMnt(quote, commission);
    quote = computeCommissionPct(quote, commission);
    return change('dealQuote', field, quote);

}

export function setDepositMnt(quote, field, deposit) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetDepositMnt(quote, deposit);
    quote = computeDepositPct(quote);
    quote = computeNetAdvanceMnt(quote);
    quote = computeNetAdvancePct(quote);
    return change('dealQuote', field, quote);

}

export function setSubsidyMnt(quote, quoteField, subsidyMnt) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetSubsidyMnt(quote, subsidyMnt);
    quote = computeSubsidyPct(quote);
    return change('dealQuote', quoteField, quote);

}

export function setMargin(quote, quoteField, margin) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetMargin(quote, margin);
    quote = computeTotalNominal(quote);
    return change('dealQuote', quoteField, quote);
}

export function setCostOfFunds(quote, quoteField, cof) {
    quote = Immutable(quote);
    quote = QuoteUtils.isetCostOfFunds(quote, cof);
    quote = computeTotalNominal(quote);
    return change('dealQuote', quoteField, quote);
}

export function setDocumentationFeeMnt(quote, quoteField, documentationFeeMnt) {
    quote = Immutable(quote)
    quote = QuoteUtils.isetDocumentationFeeMnt(quote, documentationFeeMnt);
    quote = computeDocumentationFeePct(quote);
    return change('dealQuote', quoteField, quote)
}

export function setOptionFeeMnt(quote, quoteField, optionFeeMnt) {
    quote = Immutable(quote)
    quote = QuoteUtils.isetOptionFeeMnt(quote, optionFeeMnt);
    quote = computeOptionFeePct(quote);
    return change('dealQuote', quoteField, quote)
}

export function setBalloonMnt(quote, quoteField, balloonMnt) {
    quote = Immutable(quote)
    quote = QuoteUtils.isetBalloonMnt(quote, balloonMnt);
    quote = computeBalloonPct(quote);
    return change('dealQuote', quoteField, quote)

}

export function setVATMnt(quote, quoteField, vatMnt) {
    quote = Immutable(quote)
    quote = QuoteUtils.isetVATMnt(quote, vatMnt);
    quote = computeVATPct(quote);
    return change('dealQuote', quoteField, quote)
}


// Recalculate deal payments
export function computePayment(p_dpfordre, onSuccess, onError) {
    return (dispatch, getState) => {

        dispatch({

            types: [COMPUTE_PAYMENT, COMPUTE_PAYMENT_SUCCESS, COMPUTE_PAYMENT_FAIL],
            dpfordre: p_dpfordre,
            promise: (client) => client.post('/deals/financial/applyscaleandcomputeschedule', getState().form.dealQuote.values),//(client) => client.post('/deals/financial/computepayment?dpfordre=' + p_dpfordre, getState().form.dealQuote.values),

            afterSuccess: (dispatch, getState, result) => {
                var quoteIndex = getState().newdeal2.quoteIndex;
                const selector = formValueSelector('dealQuote');
                const quoteField = 'listdealquote[' + quoteIndex + ']';

                var resultQuote = dealUtils.getQuote(result.data, quoteIndex);
                var payment = QuoteUtils.getPaymentMnt(resultQuote);
                var quote = Immutable(selector(getState(), quoteField));

                quote = QuoteUtils.isetPaymentMnt(quote, payment);

                quote = quote.set('listdealquoteelementschedule', resultQuote.listdealquoteelementschedule);
                quote = quote.set('listdealquotecommission', resultQuote.listdealquotecommission);
                quote = quote.set('listdealquoteservice', resultQuote.listdealquoteservice);
                quote = computeFlatRate(quote);
                quote = computeNPV(quote);
                dispatch(change('dealQuote', quoteField, quote));
                payment && onSuccess(payment);
            },
            afterError: (dispatch, getState, result) => {
                onError();
            }
        });
    }

}

//reducer
export default function quote(state, action) {
    switch (action.type) {

        case CHANGE_DEAL_QUOTE:
            return state.set('quoteIndex', action.quoteIndex);

        case CHANGE_DEAL_MAIN_QUOTE:
            return state.set('deal', dealUtils.isetSelectedQuote(action.deal, action.quote));

        default:
            return state;

    }
}


function computeName(deal) {
    // hack: set code of the finance type, should use label
    deal.dprnom = dealUtils.getFinanceType(deal) + ' (quote)';
}


function computeNPV(quote) {
    var cashflows = QuoteUtils.getProfile(quote) * QuoteUtils.getPaymentMnt(quote);
    var groscharges = cashflows - QuoteUtils.getNetAdvanceMnt(quote);
    var margin = QuoteUtils.getMargin(quote);
    var myyield = QuoteUtils.getYield(quote);
    var npv;
    if (!margin) {
        npv = 0;
    } else if (myyield && groscharges) {
        npv = groscharges * margin / myyield;
    }
    return QuoteUtils.isetNPV(quote, npv);
}

function computeFlatRate(quote) {
    var mnt = QuoteUtils.getYield(quote) * 0.55;
    return QuoteUtils.isetFlatRate(quote, mnt);
}

function computeDepositPct(quote) {
    var ac = QuoteUtils.getAssetCost(quote);
    var depositMnt = QuoteUtils.getDepositMnt(quote);
    var pct = 0;
    if (ac && ac > 0 && depositMnt) {
        pct = depositMnt / ac * 100;
    }
    return QuoteUtils.isetDepositPct(quote, pct);
}

function computeVATPct(quote) {
    var ac = QuoteUtils.getAssetCost(quote);
    var vatMnt = QuoteUtils.getVATMnt(quote);
    if (ac && vatMnt) {
        var pct = vatMnt / ac * 100;
        return QuoteUtils.isetVATPct(quote, pct);
    }
    return quote
}

function computeBalloonPct(quote) {
    var ac = QuoteUtils.getAssetCost(quote);
    var balloonMnt = QuoteUtils.getBalloonMnt(quote);
    if (ac && balloonMnt) {
        var pct = balloonMnt / ac * 100;
        return QuoteUtils.isetBalloonPct(quote, pct);
    }
    return quote
}

function computeDocumentationFeePct(quote) {
    var na = QuoteUtils.getAssetCost(quote) || 0;
    var documentationFeeMnt = QuoteUtils.getDocumentationFeeMnt(quote);
    if (na && documentationFeeMnt) {
        var pct = documentationFeeMnt / na * 100;
        return QuoteUtils.isetDocumentationFeePct(quote, pct);
    }
    return quote
}

function computeOptionFeePct(quote) {
    var ac = QuoteUtils.getAssetCost(quote);
    var optionFeeMnt = QuoteUtils.getOptionFeeMnt(quote);
    if (ac && optionFeeMnt) {
        var pct = optionFeeMnt / ac * 100;
        return QuoteUtils.isetOptionFeePct(quote, pct);
    }

    return quote
}

function computeTotalNominal(quote) {
    var cof = QuoteUtils.getCostOfFunds(quote) || 0;
    var margin = QuoteUtils.getMargin(quote) || 0;

    return QuoteUtils.isetYield(quote, cof + margin);
}

function computeNetAdvanceMnt(quote) {
    var assetCost = QuoteUtils.getAssetCost(quote) || 0;
    var deposit = QuoteUtils.getDepositMnt(quote) || 0;

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

function computeCommissionPct(quote) {
    var na = QuoteUtils.getNetAdvanceMnt(quote);
    var mnt = QuoteUtils.getCommissionMnt(quote);
    if (na && mnt) {
        var pct = mnt / na * 100;
        return QuoteUtils.isetCommissionPct(quote, pct);
    }
    return quote;
}

function computeSubsidyPct(quote) {

    var na = QuoteUtils.getNetAdvanceMnt(quote) || 0;
    var subsidyMnt = QuoteUtils.getSubsidyMnt(quote);
    if (na && subsidyMnt) {
        var pct = subsidyMnt / na * 100;
        quote = QuoteUtils.isetSubsidyPct(quote, pct);
    } else {
        quote = QuoteUtils.isetSubsidyPct(quote, undefined);
    }

    quote = computeManSubsidyPct(quote);
    quote = computeDealerSubsidyPct(quote);
    return quote;
}

function computeManSubsidyPct(quote) {
    var na = QuoteUtils.getNetAdvanceMnt(quote) || 0;
    var subsidyMnt = QuoteUtils.getManSubsidyMnt(quote);
    if (na && subsidyMnt) {
        var pct = subsidyMnt / na * 100;
        return QuoteUtils.isetManSubsidyPct(quote, pct);
    } else {
        return QuoteUtils.isetManSubsidyPct(quote, undefined);
    }
}

function computeDealerSubsidyPct(quote) {
    var na = QuoteUtils.getNetAdvanceMnt(quote) || 0;
    var subsidyMnt = QuoteUtils.getDealerSubsidyMnt(quote);
    if (na && subsidyMnt) {
        var pct = subsidyMnt / na * 100;
        return QuoteUtils.isetDealerSubsidyPct(quote, pct);
    } else {
        return QuoteUtils.isetDealerSubsidyPct(quote, undefined);
    }
}