import Immutable from 'seamless-immutable'
import * as a from './actions';
import {CLEAR_CACHE} from "../../../core/reducers/authentication";
import actorUtils from "../actorUtils"
// Reducer file for ActorSearch
// It contains the reducer and all actions for the Actor Search page

// Action names

const FETCH = 'actors/FETCH';
const FETCH_SUCCESS = 'actors/FETCH_SUCCESS';
const FETCH_FAIL = 'actors/FETCH_FAIL';
export const INITIAL_ACTOR = () => {
    return {
        actid: null,
        actcode: null,
        ugecode: "_ORIG_",
        cjucode: null,
        lancode: "EN",
        uticodecreat: null,
        paycode: "GB",
        actlibcourt: null,
        actnom: null,
        uticodemaj: null,
        atenum: null,
        nafcode: null,
        devcode: "GBP",
        actnom2: null,
        apamiddlename: null,
        actsiret: null,
        actchannel: null,
        actchannelcode: null,
        acttype: null,
        actextdepartment: null,
        actresidentcode: null,
        actdtexthiring: null,
        actflagtaxprof: true,
        actdtcreat: null,
        actdtmaj: null,
        acttvace: null,
        actcodercm: null,
        actfinmoisfisc: null,
        actnumrcm: null,
        actmemo: null,
        actcapital: null,
        actlibcheque: null,
        actregimetva: null,
        actflagagrement: null,
        actrattachement: null,
        actdtimmatriculation: null,
        acteffectif: null,
        naccode: null,
        actflagnondeclassable: null,
        domcode: null,
        actflaggroupe: null,
        actdtdebnaf: null,
        paycodenaf: null,
        paycodecatjuridique: "GB",
        apavillenaiss: null,
        apanompatronymique: null,
        apapaycode: null,
        apaflaginterditbancaire: null,
        apapctcapital: null,
        apaanexperactivite: null,
        apaanexperiencefonction: null,
        apacodeniveauetude: null,
        apaflagsuccessionpret: null,
        apaflaghommecle: null,
        apachgregimematrim: null,
        apaflagdirigeant: null,
        apadirfonction: null,
        apadtpermisdeconduire: null,
        apaprenom: null,
        apadtregimemariage: null,
        apadtnaiss: null,
        apadeptnaiss: null,
        apacomnaiss: null,
        apanbenfant: null,
        apasexe: null,
        apaemployeur: null,
        apasitfam: null,
        apaflagpropriete: null,
        apatitre: null,
        apanommarital: null,
        aparegimematrim: null,
        apacalbirthday: null,
        ageemetteur: null,
        tdrcodeprl: null,
        tdrcodeprlaccelere: null,
        tdrcodevir: null,
        tdrcodeeffet: null,
        rubid: null,
        taxcode: null,
        tciid: null,
        agelogo: null,
        agecib: null,
        agedelaiexigible: null,
        ageserviric: null,
        ageemetvir: null,
        agedelaisoldant: null,
        ageflagirfacture: null,
        ageflagirchq: null,
        agemtfacmini: null,
        ageficp: null,
        calid: null,
        acttaxregime: null,
        tcicode: null,
        rubcode: null,
        ainnbparttotal: null,
        atetype: null,
        actflagprospect: null,
        listactoraddress: [],
        listactorallocationpriority: [],
        listactorcomplement: [],
        listactorcontact: [],
        listactornonhierarchicalrelationship: [],
        listactorphase: [],
        listactorascendingrelationship: [],
        listactordescendingrelationship: [],
        listactorbankaccount: [],
        listactorbillingcenter: [],
        listactorrole: [],
        listactormanagementdepartment: [],
        listactorrating: [],
        listactortelecom: [],
        listactorassent: [],
        listactoruser: [],
        listactorfiscalyear: [],
        listactorcompanybuyoutpenalty: [],
        listactorcompanyrole: [],
        listactorcompanyrolereserve: [],
        listcustomcharacteristic: [],
        listactorcontactnote: [],
        listcontactnote: []
    }
};

const initialState = {
    actorsData: [],
    actor: INITIAL_ACTOR(),
    addressIndex: 0,
};

// Actions
export function fetchActors(actorParams) {
    let roles = actorParams.actroles ? actorParams.actroles.toString() : undefined;

    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/actors', {params: actorParams})
    };
}



// Reducer
export default function actorSearchReducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case FETCH_SUCCESS:
            return state.set('actorsData', action.result.data);

        case a.NEW:
            var actor = INITIAL_ACTOR();
            actor.uticodecreat = action.uticode;
            actor.listactorrole.push({rolcode: action.rolcode || 'CLIENT'});
            actor = actorUtils.addMissingTelecomFields(actor);

            if (action.customFields) {
                actor.listcustomcharacteristic = action.customFields.map((key) =>{
                    let value = key.field.split(/[\][.]+/)[1].split(':')[1]
                    return {cchvaluecode: value}
                } )
            }

            return state.set('actor', actor);

        case a.FETCH_ACTOR_SUCCESS:
            var actor = actorUtils.addMissingTelecomFields(action.result.data);
            actor = computeCustomFields(actor, action.customFields);//todo : immutable

            return state.set('actor', actor);

        case a.ACTOR_SAVE_SUCCESS:
            return state.set('actor', action.result.data);

        case a.CHANGE_ADDRESS:
            return state.set('addressIndex', action.addressIndex);
        case CLEAR_CACHE:
            return Immutable(initialState);
        default:
            return state;
    }
}


const computeCustomFields = (actor, customFields) => {
    if (!customFields || !customFields.length)  return actor;

    let listcustomcharacteristic = [...actor.listcustomcharacteristic];
        customFields.forEach(key => {
        let customCharacteristics = listcustomcharacteristic.find(item => item.cchvaluecode === key.cchvaluecode);
        if (!customCharacteristics) {
            listcustomcharacteristic.push({
                cchvaluecode: key.cchvaluecode,
            })
        }
    });

    return {...actor, listcustomcharacteristic: listcustomcharacteristic}
};

