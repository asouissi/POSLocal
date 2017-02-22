import Immutable from "seamless-immutable";
import * as d from "./actions";

const initialState = {
    stepIndex: 0,
    validStepIndex: -1,
    showDocumentStep: false,
    recaptchaStatus: 1,
    flagDisclaimer: true,
    filename: null,
    lastModifDate: null,
    loanCost: 10000,
    loanTerm: 24,
    restrictBackTraversal: false,
    aprRate: null,
    monthly: null,
    total: null,
    formValues: {
        user: {
            uticode: null,
            utipwd: null,
            utitelecom: null,
            utinom: null,
            utiprenom: null,
            email: null
        },
        actor: {
            apatitre: null,
            apaprenom: null,
            apamiddlename: null,
            actnom2: null,
            actnom: null,
            actlibcourt: null,
            apasexe: null,
            apadtnaiss: null,
            ugecode: "_ORIG_",
            cjucode: "9000",
            lancode: "EN",
            paycode: "GB",
            devcode: "GBP",
            actflagtaxprof: true,
            paycodecatjuridique: "GB",
            actresidentcode: null,
            uticodecreat: null,
            listactoraddress: [],
            listactortelecom: [
                {
                    atetype: "NET",
                    ateordre: 0,
                    atenum: null
                },
                {
                    atetype: "MOB",
                    ateordre: 1,
                    atenum: null
                }
            ]
        },
        deal: {
            devcode: 'GBP',
            dprversion: 'NEGO',
            actid: 2,
            listdealactor: [{actid: 2, rolcode: 'PARTEN'}],
            taccode: 'PRET',
            tpgcode: 'HPFI'
        }
    }
};

export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {

        case d.STEP_CHANGE:
            return state.set('stepIndex', action.index);

        case d.VALIDSTEP_CHANGE:
            return state.merge({
                validStepIndex: action.validStepIndex,
                stepIndex: action.validStepIndex + 1,
            });

        case d.VERIFY_RECAPTCHA:
            return state.set('recaptchaStatus', action.recaptchaStatus);

        case d.VERIFY_DECLARATION:
            return state.set('flagDisclaimer', action.flagDisclaimer);

        case d.UPDATE_RECAPTCHA:
            return state.merge({
                recaptchaStatus: action.recaptchaStatus,
            });

        case d.UPDATE_VALUES:
            return state.merge({
                recaptchaStatus: action.recaptchaStatus,
                flagDisclaimer: action.flagDisclaimer
            });

        case d.UPLOAD_DOC:
            return state.merge({
                filename: action.filename,
                lastModifDate: action.lastModifDate
            });

        case d.LOAN_DATA:
            return state.merge({
                loanCost: action.data.cost,
                loanTerm: action.data.term,
                aprRate: action.data.aprRate,
                monthly: action.data.monthly,
                total: action.data.total
            });

        case d.SAVE_USERDATA:
            state = state.set("actor", action.actor);
            state = state.set("user", action.user);
            state = state.set("deal", action.deal);
            return state;

        case d.RESTRICT_BACK_TRAVERSAL:
            return state.set('restrictBackTraversal', action.restrict);

        case d.PORTAL_DEAL_SAVE_SUCCESS:
            return state.set('dosid', parseInt(action.result.data.deal.dosid));

        default:
            return state;
    }
}