import {expect, assert, should} from "chai";
import sinon from "sinon";
import {accessKeysSelector} from "../../src/app/common/accesskeys/AccessKeysSelector";

describe('Access Keys Selector', () => {
    var sandbox;
    let keysSelector;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        // stub some console methods
        sandbox.stub(window.console, "log");
        sandbox.stub(window.console, "warn");
        sandbox.stub(window.console, "error");
        keysSelector = accessKeysSelector();
    });

    afterEach(()=> {
        sandbox.restore();
    });

    it('When a field is mandatory', () => {
        const accessKeys = [{key: '/fake/route', rules: [{field: "aField", mandatory: true}]}];

        const acccesskey = keysSelector('/fake/route', accessKeys, {});
        const expectedKeys = {
            aField: {
                mandatory: true,
                hidden: undefined,
                disabled: undefined
            }
        }

        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');
    });


    it('When a field is mandatory with eval', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "aField", mandatory: "(values) => values.test == 'hide'"}]
        }];

        const acccesskey = keysSelector('/fake/route', state, {test: 'hide'});
        const expectedKeys = {
            aField: {
                mandatory: true,
                hidden: undefined,
                disabled: undefined
            }
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');
    });


    it('When a in list  field is mandatory with eval', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "list[$1].aField", mandatory: "(values, conf) => values.list[$1].aField2 === 'hide'"}]
        }];
        const acccesskey = keysSelector('/fake/route', state, {list: [{aField: '', aField2: 'hide'}], test: 'hide'});
        const expectedKeys = {
            "list[0].aField": {
                mandatory: true,
                hidden: undefined,
                disabled: undefined
            }
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');
    });

    it('When a in list without index', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "list[].aField", disabled: true}]
        }];
        const acccesskey = keysSelector('/fake/route', state, {list: [{}, {}]});
        const expectedKeys = {
            "list[0].aField": {mandatory: undefined,hidden: undefined, disabled: true},
            "list[1].aField": {mandatory: undefined,hidden: undefined, disabled: true}
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');
    });


    it('When a field is in a list with key', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "listBar[dingoCode:pluto].aField", mandatory: true}]
        }];
        const acccesskey = keysSelector('/fake/route', state, {listBar: [{dingoCode: 'pluto', aField: ''}]});

        const expectedKeys = {
            "listBar[0].aField": {
                mandatory: true,
                hidden: undefined,
                disabled: undefined
            }
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');

    });

    it('When a field is in a list with key with eval', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "listBar[dingoCode:pluto].aField", hidden: "(values, conf) => values.test === 'hide'"}]
        }];
        const acccesskey = keysSelector('/fake/route', state, {listBar: [{dingoCode: 'pluto', aField: ''}], test: 'hide'});

        const expectedKeys = {
            "listBar[0].aField": {
                mandatory: undefined,
                hidden: true,
                disabled: undefined
            }
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');

    });


    it('When a field is in a deep object', () => {
        const state = [{
            key: '/fake/route',
            rules: [{field: "object.aField", disabled: "(values, conf) => values.test === 'hide'"}]
        }];
        const acccesskey = keysSelector('/fake/route', state, {object: {aField: ''}, test: 'hide'});

        const expectedKeys = {
            "object.aField": {
                mandatory: undefined,
                hidden: undefined,
                disabled: true
            }
        }
        assert.deepEqual(acccesskey, expectedKeys, 'aField is not correctly compute');

    });


    it('I can have many fields, many rules', () => {
        const state = [{
            key: '/fake/route',
            rules: [
                {field: "listFoo[$1].lol.listBar[$2].aField", hidden: "(values, conf) => values.listFoo[$1].lol.listBar[$2].test === 'hide'"},
                {field: "listFoo[$1].lol.aSecondField", disabled: "(values, conf) => values.test === 'disabled'"}
            ]
        }];
        const accesskey = keysSelector('/fake/route', state, {
            listFoo: [
                {lol: {listBar: [{}, {}], aSecondField: ""}},
                {lol: {listBar: [{}, {aField: "toHide", test: 'hide'}], aSecondField: "setted"}}
            ],
            test: 'disabled'});

        const expectedKeys = {
            "listFoo[0].lol.aSecondField": {mandatory: undefined, hidden: undefined, disabled: true},
            "listFoo[0].lol.listBar[0].aField": {mandatory: undefined, hidden: false, disabled: undefined},
            "listFoo[0].lol.listBar[1].aField": {mandatory: undefined, hidden: false, disabled: undefined},
            "listFoo[1].lol.aSecondField": {mandatory: undefined, hidden: undefined, disabled: true},
            "listFoo[1].lol.listBar[0].aField": {mandatory: undefined, hidden: false, disabled: undefined},
            "listFoo[1].lol.listBar[1].aField": {mandatory: undefined, hidden: true, disabled: undefined},
        }
        assert.deepEqual(accesskey, expectedKeys, 'aField is not correctly compute');

    });

    it('When a field is in a list with key is mandatory but this key does not exit we log an error', () => {
        const state = [{
            key: '/fake/route',
            rules: [
                {field: "listBar[dingoCode:pluto].aField", mandatory: true}
            ]
        }];

        const accesskey = keysSelector('/fake/route', state, {listBar: [{}]});

        sinon.assert.calledOnce(console.warn);
        sinon.assert.calledWithExactly(console.warn, "An access key rules is defined but field does not exist:", [{}], "dingoCode", "pluto")
    });

    it('When a field is in a list is mandatory but this list does not exist we throw an error', () => {
       // const accessKeys = {"listBar[].aField": {mandatory: true}};

        const state = [{
            key: '/fake/route',
            rules: [
                {field: "listBar[].aField", mandatory: true}
            ]
        }];

        const accesskey = keysSelector('/fake/route', state, {});

        sinon.assert.calledOnce(console.warn);
        sinon.assert.calledWithExactly(console.warn, "An access key rules is defined but field does not exist:", "listBar")
    });

    it('When a field is in an object is mandatory but this object does not exist we throw an error', () => {
      //  const accessKeys = {"toto.aField": {mandatory: true}};

        const state = [{
            key: '/fake/route',
            rules: [
                {field: "toto.aField", mandatory: true}
            ]
        }];
        const accesskey = keysSelector('/fake/route', state, {});

        sinon.assert.calledOnce(console.warn);
        sinon.assert.calledWithExactly(console.warn, "An access key rules is defined but field does not exist:", "toto");
    });
    //TODO : add some test to tag your name here

});