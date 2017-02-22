import {expect, assert, should} from "chai";
import sinon from "sinon";
import AccessKeysValidator from "../../src/app/common/accesskeys/AccessKeysValidator";
import {GlobalMessages} from "../../src/app/core/intl/GlobalMessages";

describe('Access Keys Validation', () => {
    var sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        // stub some console methods
        sandbox.stub(window.console, "log");
        sandbox.stub(window.console, "error");

    });

    afterEach(()=> {
        sandbox.restore();
    });

    it('When a field is mandatory, an error is thrown', () => {
        const accessKeys = {aField: {mandatory: true}};
        const errors = AccessKeysValidator.validate({}, {accessKeys});

        var object = GlobalMessages.fieldRequire;
        assert.deepEqual(errors.aField, object, 'aField is required');
    });

    it('When a field is mandatory and disabled there is no error', () => {
        const accessKeys = {aField: {mandatory: true, disabled: true}};
        const errors = AccessKeysValidator.validate({}, {accessKeys});

        assert.equal(errors.aField, undefined, 'aField is not required');
    });

    it('When a field is mandatory and hidden there is no error', () => {
        const accessKeys = {aField: {mandatory: true, hidden: true}};
        const errors = AccessKeysValidator.validate({}, {accessKeys});

        assert.equal(errors.aField, undefined, 'aField is not required');
    });

    it('When a field is mandatory and there is a value setted there is no error', () => {
        const accessKeys = {aField: {mandatory: true, hidden: false}};
        const errors = AccessKeysValidator.validate({aField: "hasAvalue"}, {accessKeys});

        assert.equal(errors.aField, undefined, 'aField is setted no error');
    });

    it('When a field is mandatory inside a list, an error is thrown', () => {
        const accessKeys = {"listFoo[0].aField": {mandatory: true}};
        const errors = AccessKeysValidator.validate({listFoo: [{}]}, {accessKeys});

        assert.deepEqual(errors.listFoo[0].aField, GlobalMessages.fieldRequire, 'aField is required');
    });

    it('When a field is mandatory inside a nested list with key in an nested object, an error is thrown', () => {
        const accessKeys = {"listFoo[0].lol.listBar[0].aField": {mandatory: true}};
        const errors = AccessKeysValidator.validate({listFoo: [{lol: {listBar: [{dingoCode: "pluto"}]}}]}, {accessKeys});

        assert.deepEqual(errors.listFoo[0].lol.listBar[0].aField, GlobalMessages.fieldRequire, 'aField is required');
    });

    it('When a field is mandatory inside a nested list with keys, an error is thrown', () => {
        const accessKeys = {"listFoo[0].listBar[0].lol.aField": {mandatory: true}};
        const errors = AccessKeysValidator.validate({
            listFoo: [{
                listBar: [{
                    dingoCode: "pluto",
                    lol: {}
                }]
            }]
        }, {accessKeys});

        assert.deepEqual(errors.listFoo[0].listBar[0].lol.aField, GlobalMessages.fieldRequire, 'aField is required');
    });

    it('When a field is mandatory inside a nested list in an nested object, an error is thrown', () => {
        const accessKeys = {
            "listFoo[0].lol.listBar[0].aField": {mandatory: false},
            "listFoo[0].lol.listBar[1].aField": {mandatory: true}
        };
        const errors = AccessKeysValidator.validate({listFoo: [{lol: {listBar: [{aField: ''}, {}]}}]}, {accessKeys});

        assert.equal(errors.listFoo[0].lol.listBar[0], undefined, 'aField is setted');
        assert.deepEqual(errors.listFoo[0].lol.listBar[1].aField, GlobalMessages.fieldRequire, 'aField is required');
    });

    it('When a field is mandatory and setted inside a nested list in an nested object, NO error is thrown', () => {
        const accessKeys = {
            "listFoo[0].lol.listBar[0].aField": {mandatory: true},
            "listFoo[0].lol.listBar[1].aField": {mandatory: true}
        };
        const errors = AccessKeysValidator.validate({listFoo: [{lol: {listBar: [{}, {aField: 'setted'}]}}]}, {accessKeys});

        assert.equal(errors.listFoo[0].lol.listBar[0].aField, GlobalMessages.fieldRequire, 'aField is setted');
        assert.deepEqual(errors.listFoo[0].lol.listBar[1], undefined, 'aField is required');
    });

    it('When a field is mandatory twice inside a nested list in an nested object, two errors are thrown', () => {
        const accessKeys = {
            "listFoo[0].lol.listBar[0].aField": {mandatory: true},
            "listFoo[0].lol.listBar[1].aField": {mandatory: true},
            "listFoo[1].lol.listBar[0].aField": {mandatory: true},
            "listFoo[1].lol.listBar[1].aField": {mandatory: false},
        };
        const errors = AccessKeysValidator.validate({
            listFoo: [
                {lol: {listBar: [{}, {}]}},
                {lol: {listBar: [{}, {aField: ""}]}}
            ]
        }, {accessKeys});

        assert.deepEqual(errors.listFoo[0].lol.listBar[0].aField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[0].lol.listBar[1].aField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[1].lol.listBar[0].aField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[1].lol.listBar[1], undefined, 'aField is setted');
    });

    it('I can have many access key', () => {
        const accessKeys = {
            "listFoo[0].lol.aSecondField": {mandatory: true},
            "listFoo[0].lol.listBar[0].aField": {mandatory: true},
            "listFoo[0].lol.listBar[1].aField": {mandatory: true},
            "listFoo[1].lol.aSecondField": {mandatory: true},
            "listFoo[1].lol.listBar[0].aField": {mandatory: true},
            "listFoo[1].lol.listBar[1].aField": {mandatory: true},
        };
        const errors = AccessKeysValidator.validate({
            listFoo: [
                {lol: {listBar: [{aField: "setted"}, {}], aSecondField: ""}},
                {lol: {listBar: [{}, {aField: "setted"}], aSecondField: "setted"}}
            ]
        }, {accessKeys});

        assert.deepEqual(errors.listFoo[0].lol.listBar[0], undefined, 'aField is setted');
        assert.deepEqual(errors.listFoo[0].lol.listBar[1].aField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[0].lol.aSecondField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[1].lol.listBar[0].aField, GlobalMessages.fieldRequire, 'aField is required');
        assert.deepEqual(errors.listFoo[1].lol.listBar[1], undefined, 'aField is setted');
        assert.deepEqual(errors.listFoo[1].lol.aSecondField, undefined, 'aSecondField is setted');

        let expectedErrors = {
            listFoo: [{
                lol: {
                    aSecondField: GlobalMessages.fieldRequire,
                    listBar: [
                        ,//nothing for 0 index
                        {aField: GlobalMessages.fieldRequire}]
                },
            }, {
                lol: {
                    listBar: [{
                        aField: GlobalMessages.fieldRequire
                    }]
                }
            }]
        }

        assert.deepEqual(errors, expectedErrors, "errors object is bad")

    });

});