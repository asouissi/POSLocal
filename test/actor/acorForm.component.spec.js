import ActorCreationPage from "../../src/app/common/actor/components/ActorCreationPage";
import {IntlProvider} from 'react-intl';
import React from "react";
import {expect} from "chai";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import promiseMiddleware from '../../src/app/core/config/promiseMiddleware';
import authentication from '../../src/app/core/reducers/authentication';
import referenceTables from '../../src/app/core/reducers/referenceTable';
import actorReducer from '../../src/app/common/actor/reducers/actor'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {reducer as formReducer} from 'redux-form'
import Immutable from 'seamless-immutable'

//import sinon from 'sinon'
const createStoreM = applyMiddleware(promiseMiddleware)(createStore);


//TODO just init a details, add expect
describe("ActorFormContainer", () => {
    const getStoreState = {
        authentication: {accesskeys: [{key: "/actor"}], user: {uticode: 'UTI_TEST'}},
        actor: {actor: {}}
    };
    let store
    //let onSave
    let subject
    beforeEach(() => {
        store = createStoreM(combineReducers({
            form: formReducer,
            authentication,
            referenceTables,
            actor: actorReducer
        }), Immutable(getStoreState))
        // store = mockStore(getStoreState);
        // onSave = sinon.stub().returns(Promise.resolve())
        const props = {
            route: {path: '/actor'}
        }

        subject = mount(
            <Provider store={store}>
                <IntlProvider>
                    <ActorCreationPage {...props}/>
                </IntlProvider>
            </Provider>
        )
    })


    it("shows help text when first name is set to blank", () => {
        const input = subject.find('input').at(0)
        // Our form component only shows error messages (help text) if the
        // field has been touched. To mimic touching the field, we simulate a
        // blur event, which means the input's onBlur method will run, which
        // will call the onBlur method supplied by Redux-Form.
        // input.simulate('change', {target: {value: ''}})

        input.simulate('blur')
        const firstNameHelpBlock = subject.find('.help-block')
        // Ensure only one node is returned, otherwise our call to text() below will yell at us.
        //expect(firstNameHelpBlock).to.have.length.of(1)
        //expect(firstNameHelpBlock.text()).to.equal('Required')
    })

    it("calls onSave", () => {
        const form = subject.find('form')
        const input = subject.find('input').first()
        // Our form, when connected to Redux-Form, won't submit unless it's
        // valid. Thus, we type a first name here to make the form's inputs,
        // and thus the form, valid.
        input.simulate('change', {target: {value: 'Joe'}})
        form.simulate('submit')
        // expect(onSave.callCount).to.equal(1)
    })
})
