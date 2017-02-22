import expect from 'expect'
import * as quotes from '../../../src/app/pos/deal/newdeal2/reducers/dealQuote'
import Immutable from 'seamless-immutable'
import {reducer as formReducer} from 'redux-form'
import {createStore, combineReducers} from 'redux'

describe('Quotes Reducer', () => {

    let store
    beforeEach(() => {
        store = createStore(combineReducers({form: formReducer}))

    })
    it('PCTSUBSIDY should be recalc when handle SUBSIDY_CHANGED or FINANCEDVALUE_CHANGE ', () => {
        const initialSate = Immutable( {
            deal: {
                listdealquote: [{
                    listdealquoteattribute: [
                        {pfacode: "MAINFINACEAMT", pfadouble: 200},
                        {pfacode: "MTSUBSIDY"},
                        {pfacode: "PCTSUBSIDY"}
                    ]
                }]
            }
        });


        store.dispatch(quotes.setSubsidyMnt(initialSate.deal.listdealquote[0],
            'listdealquote[0]', 50
        ));

        expect(store.getState().form.dealQuote.values).toEqual({
                    listdealquote: [{
                        listdealquoteattribute: [
                            {pfacode: "MAINFINACEAMT", pfadouble: 200},
                            {pfacode: "MTSUBSIDY", pfadouble: 50},
                            {pfacode: "PCTSUBSIDY", pfadouble: 25},
                            {pfacode: 'PCTMANSUBSIDY', pfadouble: undefined},
                            {pfacode: 'PCTDEALSUBSIDY', pfadouble: undefined}
                        ]
                    }]
            }
        )

    })
})
