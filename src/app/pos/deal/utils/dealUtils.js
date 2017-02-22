import sharedUtils, * as sharedConst from '../../../core/utils/sharedUtils';
import * as ImmutableUtils from '../../../core/utils/ImmutableUtils';
import merge from 'lodash/merge'
import QuoteUtils from './QuoteUtils'
import DealActorUtils from './DealActorUtils'
export const DOC_FEE = 'UKDOFI';
export const DOC_FEE_OPTION = 'UKOPFEEVAT';

export const DEAL_APG_CODE = '06';
export const PROMOTETODEAL = 'PROMOTETODEAL';

export const VALUE_CODE_BUSINESS_TYPE_PRET = 'PRET';
export const VALUE_CODE_BUSINESS_TYPE_CBM = 'CBM';
export const TPGTYPE="TPGTYPE";

export const CLIENT = 'CLIENT';
export const COCLIEN = 'COCLIEN';
export const BORROWER = 'EMPRUNT';
export const COBORROWER = 'COEMPRU';

export const STEP_CARDELI = "CARDELI";
export const STEP_72ADEFI = "72ADEFI";
export const SELF_PAYMENT_SITEOPTION = 'JALCODESELFPAYMENT';

export const INITIAL_DEAL = () => {
    return {
        dealextrainfo: {},
        listdealkeydate: [
            {dclcode: 'DTMEP', ddcordre: 1}
        ],
        listdealactor: [],
        listdealasset: [
            {
                dpmordre: 1,
                listdealassetactor: [],
            }
        ],
        listdealquote: [
            {
                pfinom: "-",
                pfiperiodicite: "030",
                pfinbperiodes: 34,
                pfiapprocheflux: 'LOYFIX',
                pfiterme: "L",
                dpfordre: 1,
                dpfflagretenue: true,
                listdealquoteelement: [{
                    pfrordre: 1
                }],

                listdealquotepayment: [
                    {
                        pfvordre: 1,
                        pfvtypeversement: "DOWNPAYMENTARR",
                    }
                ],

                listdealquoteattribute: [
                    {
                        pfacode: 'TMP_FINANCETYPE',
                        pfachaine: 'HPFI'
                    },
                    {
                        pfacode: 'TMP_QUOTETYPE',
                        pfachaine: 'HP'
                    },
                    {
                        pfacode: "TMP_FINDWHAT"
                    },
                    {
                        pfacode: "TMP_FINDFROM"
                    },
                    {
                        pfacode: "TMP_APR"
                    },
                    {
                        pfacode: "TMP_FLATRATE"
                    },
                    {
                        pfacode: "TMP_NPC"
                    },
                    {
                        pfacode: "TMP_PCTFINVALUE"
                    },
                    {
                        pfacode: "TMP_MTVAT"
                    },
                    {
                        pfacode: "TMP_PCTVAT"
                    },
                    {
                        pfacode: "TMP_MTRV"
                    },
                    {
                        pfacode: "TMP_PCTRV"
                    },
                    {
                        pfacode: "FINANCEDVALUE"
                    },
                    {
                        pfacode: "MAINFINACEAMT"
                    },
                    {
                        pfacode: "ADVANCEPAYMENT"
                    },
                    {
                        pfacode: "DURPROFIL"
                    },
                    {
                        pfacode: "MTMANSUBSIDY"
                    },
                    {
                        pfacode: "MTDEALERSUBSIDY"
                    },
                    {
                        pfacode: "PCTMANSUBSIDY"
                    },
                    {
                        pfacode: "PCTDEALSUBSIDY"
                    },
                    {
                        pfacode: "MTSUBSIDY"
                    },
                    {
                        pfacode: "PCTSUBSIDY"
                    },
                    {
                        pfacode: "NBTERM"
                    },
                    {
                        pfacode: "FOLLOWEDBY"
                    },
                    {
                        pfacode: "BALLOONDATE"
                    },
                    {
                        pfacode: "TMP_NPV"
                    },
                    {
                        pfacode: "TMP_TERMEDIT",
                        pfaentier: 0
                    },
                    {
                        pfacode: "ASSETVATAMOUNT"
                    }
                ],

                listdealquoteservice: [
                    {
                        tprcode: DOC_FEE,
                        rubcode:"VFRAISD",
                        pfpordre: 1
                    },
                    {
                        tprcode: DOC_FEE_OPTION,
                        rubcode:"INSUR",
                        pfpordre: 2
                    }
                ],

                listdealquotecommission: [
                    {
                        tcocode: "UKCOM",
                        rubcode:"COM",
                        pfcordre: 1
                    }
                ]
            }
        ]
    };
}


const _mergeDeal = (deal, path, values) => {
    return deal.updateIn(path, (object) => {
        return object.merge(values);
    });
}

const _mergeAsset = (deal, assetIndex, values) => {
    return deal.updateIn(['listdealasset', assetIndex], (asset) => {
        return asset.merge(values);
    });
}

const _mergeQuote = (deal, quoteIndex, values) => {
    return _mergeDeal(deal, ['listdealquote', quoteIndex], values);
}


class dealUtils {
    /**
     * Cutomer methos
     */
    static isetCustomerNumber(deal, actorIndex, actcode) {
        return deal.setIn(['listdealactor', actorIndex], DealActorUtils.isetNumber(deal.listdealactor[actorIndex], actcode))
    }

    static isetCustomerName(deal, actorIndex, actlibcourt) {
        return deal.setIn(['listdealactor', actorIndex], DealActorUtils.isetName(deal.listdealactor[actorIndex], actlibcourt))
    }

    static isetCustomerId(deal, actorIndex, actid) {
        return deal.setIn(['listdealactor', actorIndex], DealActorUtils.isetId(deal.listdealactor[actorIndex], actid))
    }

    static iupdateActor(deal, actorIndex, values) {
        return deal.setIn(['listdealactor', actorIndex], DealActorUtils.iupdateActor(deal.listdealactor[actorIndex], values))
    }

    /**
     * ASSET methods
     */

    static appendNewAsset(deal, asset) {
        return deal.set('listdealasset', deal.listdealasset.concat([asset]))
    }

    static removeAsset(deal, asset) {
        return deal.set('listdealasset', ImmutableUtils.iremoveArrayIndex(deal.listdealasset, this.getAssetIndex(deal, asset)))
    }

    static updateAssetValues(deal, assetIndex, values) {
        return _mergeAsset(deal, assetIndex, values);
    }

    static updateAsset(deal, asset) {
        return deal.setIn(['listdealasset', this.getAssetIndex(deal, asset)], asset);
    }

    static getDealAssetFromDpmOrdre(p_deal, p_dpmordre) {
        let foundAsset = p_deal.listdealasset.find((p_asset) => p_asset.dpmordre == p_dpmordre) || {};

        return foundAsset;
    }

    static getAssetIndex(deal, asset) {
        return deal.listdealasset.findIndex(a => a.dpmordre == asset.dpmordre)
    }

    static getTotalAssetAmount(p_deal) {
        let dpimt = 0;

        p_deal.listdealasset.forEach(p_asset => {
            if (sharedUtils.isValid(p_asset)) {
                dpimt += ( !isNaN(parseFloat(p_asset.dpmmtinvest)) ? parseFloat(p_asset.dpmmtinvest) : 0 )
            }
        });

        return dpimt;
    }
    static getTotalAssetAmounttc(p_deal) {
        let dpimt = 0;

        p_deal.listdealasset.forEach(p_asset => {
            if (sharedUtils.isValid(p_asset)) {
                dpimt += ( p_asset.dpmmtttc ? p_asset.dpmmtttc : 0 )
            }
        });

        return dpimt;
    }
    static getLoyerTTC(p_deal) {
        let amount = dealUtils.getTotalAssetAmounttc(p_deal);
        let nbperiodes = p_deal.listdealquote[0].pfinbperiodes ? p_deal.listdealquote[0].pfinbperiodes : 1;

        amount = amount/nbperiodes;
        return amount;
    }
    static getLoyerHT(p_deal) {
        let amount = dealUtils.getTotalAssetAmount(p_deal);
        let nbperiodes = p_deal.listdealquote[0].pfinbperiodes ? p_deal.listdealquote[0].pfinbperiodes : 1;

        amount = amount/nbperiodes;
        return amount;
    }

    static isetAssetCategory(deal, assetIndex, acacode) {
        return deal.setIn(['listdealasset', assetIndex, 'acacode'], acacode);
    }


    static isetAssetModel(deal, assetIndex, mmocode) {
        return _mergeAsset(deal, assetIndex, {
            mmocode: mmocode,
            mmtcode: null,
            varid: null
        });
    }

    static isetAssetFinish(deal, assetIndex, mmtcode) {
        return _mergeAsset(deal, assetIndex, {
            mmtcode: mmtcode,
            varid: null
        });
    }

    static isetAssetVariant(deal, assetIndex, varid) {
        return _mergeAsset(deal, assetIndex, {
            varid: varid
        });
    }

    static isetFinanceType(deal, tpgcode) {
        return deal.set('tpgcode', tpgcode);
    }

    static isetDealName(deal, tpgcode) {
        return deal.set('dprnom', tpgcode + ' (drawn deal)');
    }

    /**
     * QUOTE methods
     */
    static isetTermEditable(deal, quoteIndex, termEditable) {
        let quote = this.getQuote(deal, quoteIndex);
        quote = QuoteUtils.isetTermEditable(quote, termEditable);
        return dealUtils.updateQuote(deal, quoteIndex, quote);

    }

    static isetFirstPayement(deal, quoteIndex, firstPayment) {
        return _mergeQuote(deal, quoteIndex, {pfimtpremierloyer: firstPayment});
    }

    static isetScale(deal, quoteIndex, values) {
        return _mergeQuote(deal, quoteIndex, values);
    }

    static isetMileage(deal, quoteIndex, kilometrage, unite) {
        return _mergeQuote(deal, quoteIndex, {
            pfikilometrage: kilometrage,
            pfiunitemesure: unite
        });
    }

    static updateQuoteValues(deal, quoteIndex, values) {
        return _mergeQuote(deal, quoteIndex, values);
    }

    static updateQuote(deal, quote, quoteIndex = 0) {
        return deal.setIn(['listdealquote', quoteIndex], quote);
    }

    static findQuoteIndex(deal, quote) { //TODO: voir si avec immutable ne pas travailler directement avec dpfordre
        let quoteIndex = 0;
        deal.listdealquote.forEach((q, index) => {
            if (q.dpfordre === quote.dpfordre) {
                quoteIndex = index;
            }
        });

        return quoteIndex;
    }

    static findDealKeydate(deal, key) {
        var listdealkeydate = deal.listdealkeydate;
        var dealKeydate = listdealkeydate ? listdealkeydate.find((p) => p.dclcode === key) || {} : {};
        return dealKeydate;
    }

    static getDealKeyDateField(deal, key) {
        var listdealkeydate = deal.listdealkeydate;
        var index = listdealkeydate ? listdealkeydate.findIndex((p) => p.dclcode === key): {};
        return 'listdealkeydate[' + index + ']';
    }

    static getQuote(deal, quoteIndex = 0) {
        return deal.listdealquote[quoteIndex] || {};
    }

    static getQuoteFromDpfordre(p_deal, p_dpfordre) {
        if (!p_deal) {
            return {};
        }

        let l_foundQuote = p_deal.listdealquote.find((p_quote) => p_quote.dpfordre == p_dpfordre) || {};

        return l_foundQuote;
    }

    static getQuoteElement(deal, quoteIndex) {
        var quote = this.getQuote(deal, quoteIndex);
        return quote.listdealquoteelement && quote.listdealquoteelement.length ? quote.listdealquoteelement[0] : {}
    }

    static findQuoteAttribute(deal, key, quoteIndex) {
        var listdealquoteattribute = this.getQuote(deal, quoteIndex).listdealquoteattribute;
        if (!listdealquoteattribute) return {};

        var dealQuoteAttribute = listdealquoteattribute.find((p) => p.pfacode === key);

        return dealQuoteAttribute || {};
    }

    static getQuoteAttributeDouble(deal, key, quoteIndex) {
        return this.findQuoteAttribute(deal, key, quoteIndex).pfadouble;
    }

// Promoted
    static setPromoted(deal, p) {
        if (p) {
            if (!deal.listdealdecision) deal.listdealdecision = [];
            var listdealdecision = deal.listdealdecision;
            let decision = listdealdecision.find((p) => p.adecode === 'PROMOTETODEAL');
            if (decision) return;
            decision = {adecode: 'PROMOTETODEAL', ddedt: new Date().getTime(), ddeordre: 1};
            listdealdecision.push(decision);
        } else {
            // todo - but should not happen
        }
    }

    static isPromoted(deal) {
        if (!deal || !deal.listdealdecision) return false;
        if (deal.listdealdecision.find((p) => p.adecode === 'PROMOTETODEAL')) return true;
        return false;
    }

    static setFinanceType(p_deal, value) {
        let l_quote = dealUtils.getSelectedQuote(p_deal);

        if (l_quote) {
            l_quote.tpgcode = value;
        }
    }

    static getFinanceType(p_deal) {
        let l_quote = dealUtils.getSelectedQuote(p_deal);

        if (l_quote) {
            return l_quote.tpgcode;
        }
        else {
            return null;
        }
    }

    static setQuoteType(deal, value, quoteIndex) {
        let attr = dealUtils.findQuoteAttribute(deal, 'TMP_QUOTETYPE', quoteIndex);
        attr.pfachaine = value;
    }


    static isetKeyDate(deal, attribute, values) {
        return deal.update('listdealkeydate', (list) => {
            return list.map(attr => {
                if (attr.pfacode == attribute) {
                    return attr.merge(values)
                }
                return attr
            })
        });
    }
// Start Date
    static setStartDate(deal, dt) {
        return dealUtils.isetKeyDate(deal, 'DTMEP', {ddcdt: dt});
    }

    static getStartDate(deal) {
        let attr = dealUtils.findDealKeydate(deal, 'DTMEP');
        return attr.ddcdt;
    }

    static getStartDateField(deal) {
        return dealUtils.getDealKeyDateField(deal, 'DTMEP') + ".ddcdt";
    }

// Term
    static isetTerm(deal, t) {
        return deal.set('pfinbperiodes', t);
    }

    static getTerm(deal) {
        return deal.pfinbperiode;
    }

    static getDTMEP(deal) {
        return this.getStartDate(deal);
    }


    static getSelectedQuote(p_deal) {
        let l_quote = null;

        p_deal.listdealquote.forEach(p_quote => {
            if (p_quote.dpfflagretenue) {
                l_quote = p_quote;
            }
        });

        return l_quote;
    }

    static isetSelectedQuote(deal, quote) {
        let list = deal.listdealquote.map(q => {
            return q.set('dpfflagretenue', q.dpfordre === quote.dpfordre);
        });

        return deal.set('listdealquote', list);
    }

    static getSelectedOrElseFirstQuote(p_deal) {
        let l_quote = getSelectedQuote(p_deal);

        if (!l_quote) {
            if (p_deal.listdealquote.length > 0) {
                l_quote = p_deal.listdealquote[0];
            }
        }

        return l_quote;
    }

    static getCurrentPhaseCode(p_deal) {
        if (!p_deal || !p_deal.listdealphase) {
            return null;
        }

        let l_currentPhase = p_deal.listdealphase.find((p_dealphase) => {
            return !p_dealphase.dphdtend;
        })

        return l_currentPhase.phacode;
    }

    static getCurrentJalCode(p_deal) {
        return p_deal.jalonCode
    }

    static addNewQuote(deal, quote) {

        quote = merge(quote, INITIAL_DEAL().listdealquote[0]);
        const nextOrder = _.max(deal.listdealquote.map(quote => quote.dpfordre)) + 1;
        quote.dpfordre = nextOrder;
        quote.pfinom = 'Quote #' + nextOrder;
        quote.dpfflagretenue = false; //tmp

        return deal.set('listdealquote', deal.listdealquote.concat([quote]));
    }
}

export default dealUtils;
