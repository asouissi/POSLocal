/**
 * Created by zos on 10/10/2016.
 */
import React from 'react'
import{expect, assert, should} from 'chai';
import Immutable from 'seamless-immutable';
import {reducer as formReducer} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {
    IntlProvider, intlShape

} from 'react-intl';
import configureMockStore from "redux-mock-store";
import contractsReducer from '../../../src/app/wholesale/contracts/reducers/contracts';
import * as actionType from '../../../src/app/wholesale/contracts/reducers/actions';
import {getListTypesDocument} from '../../../src/app/wholesale/contracts/reducers/actions';
import ContractSettlementFormContainer from '../../../src/app/wholesale/contracts/components/ContractSettlementFormContainer'

import promiseMiddleware from '../../../src/app/core/config/promiseMiddleware';

let messages = {};
const intlProvider = new IntlProvider({
    locale: 'en', messages, formats: {
                                    number: {
                                        currencyFormat: {
                                            style: 'currency',
                                            currency: 'EUR',
                                            currencyDisplay: 'symbol',
                                            minimumIntegerDigits: 1
                                        },
                                        float: {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    },
                                    currency: 'EUR'}
                            }, {});
const {intl} = intlProvider.getChildContext();

const INIT_EMPTY_STATE = Immutable({
    form: {},
    contracts: {
        dosid: 1,
        settle: {outstandingAmount: 0, fees: 0},
        settleSuccess: 'ko',
        contract : {asset:{}}
    },
    referenceTables: [{
        'lantusparam{"tusnom":"MOTTERRACTOT"}': [{code: 'A', label: 'REASON_A'}, {code: 'B', label: 'REASON_B'}]
    }],
    creditLines: {creditLines: {}},
    settle: {
        outstandingAmount: 0,
        fees: 0
    },
    authentication:{
        user:{
            readonly:true
        }
    },
    isSettled: false,
    canBeConverted: false,
    isLoading: false
});

const isSettle_result = {
    data: true
}
const canBeConverted_result = {
    data: true
}
const computeOtsAmount_result = {
    data: 9999
}
const computeFees_result = {
    data: 1234
}
function nodeWithIntlProp(node) {
    return React.cloneElement(node, { intl });
}
export function mountWithIntl(node, { context, childContextTypes }) {
    return mount(
        nodeWithIntlProp(node),
        {
            context: Object.assign({}, context, {intl}),
            childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes)
        }
    );
}




const mockStore = configureMockStore([promiseMiddleware]);

describe('WholeSale contracts Reducer ', () => {

    it('checks the ws /referencetable?table=landocument&doccontexte=wholesale',()=>{
        const action = getListTypesDocument();
        if(action.data){
        const newState = contractsReducer(INIT_EMPTY_STATE, action);
        assert.isAbove(newState.referenceTables[0]['lantusparam{"tusnom":"MOTTERRACTOT"}'].length, 0, 'reference table lantusparam with tusnom=MOTTERACTOT is not empty');
        }else{
            assert.isUndefined(action.data, 'You are not connected to a wholesale db');
        }

    });
    it('computes outstanding amount', () => {

        const newState = contractsReducer(INIT_EMPTY_STATE, {
            type: actionType.COMPUTE_OUTSTANDING_SUCCESS,
            result: computeOtsAmount_result
        });

        expect(newState.settle.outstandingAmount).equal(9999);
    });
    it('computes fees amount', () => {

        const newState = contractsReducer(INIT_EMPTY_STATE, {
            type: actionType.COMPUTE_FEES_SUCCESS,
            result: computeFees_result
        });

        expect(newState.settle.fees).equal(1234);
    });

    it('fetchs if the contract is settled', () => {

        const newState = contractsReducer(INIT_EMPTY_STATE, {
            type: actionType.IS_SETTLE_SUCCESS,
            result: isSettle_result
        });

        expect(newState.isSettled).equal(true);
    });

    it('fetchs if the contract can be converted', () => {

        const newState = contractsReducer(INIT_EMPTY_STATE, {
            type: actionType.CAN_CONVERT_SUCCESS,
            result: canBeConverted_result
        });

        expect(newState.canBeConverted).equal(true);
    });
});

describe("ContractSettlementFormContainer", () => {
    let store;
    let subject;
    beforeEach(() => {
        //store = createStore(combineReducers({form: formReducer}), INIT_EMPTY_STATE);
        store = mockStore(INIT_EMPTY_STATE);
        const props = {
            routes: [{
                path: '/',
                name: 'Home'
            }, {
                path: 'locations',
                name: 'Locations'
            }, {
                path: ':id',
                name: state => state.location.name
            }],
            params: {dosid: 12, contractId: 11}

        };
        // mount the redux form with <Provider/>.

        subject = mountWithIntl(
            <Provider store={store}>
                <ContractSettlementFormContainer {...props}/>
            </Provider>
            ,
            { intl }
        )
    })



    it("tests that the date field exists", () => {
        const dateEntry = subject.find('.btn.btn-unchecked').first();

        expect(dateEntry).to.have.length.of(1);
        // TODO test showing the text required on mandatory fields
        //dateEntry.simulate('blur');
        //const firstNameHelpBlock = subject.find('.help-block');
        //expect(firstNameHelpBlock.text()).to.equal('Required');

    })
});