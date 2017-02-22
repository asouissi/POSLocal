/**
 * Created by zos on 10/02/2017.
 */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import{expect, assert, should} from 'chai';
import { shallow } from 'enzyme';
import {Checkbox, Button} from "react-bootstrap";
import ServicesEditPopup from '../../../src/app/pos/deal/newdeal/components/ServicesEditPopup'
import  * as ComponentVar from '../../../src/app/pos/deal/newdeal/components/ServicesEditPopup'



describe("Scale Services Popup", () => {
    let result;
    const renderer = ReactTestUtils.createRenderer();
    let myServices = [
        { pelid: 1, pellibelle: "Service 1", pfpmt:10, ppeflagauto:true },
        { pelid: 2, pellibelle: "Service 2" , pfpmt:200, ppeflagauto:false}
    ];
    beforeEach(()=> {


        renderer.render(<ServicesEditPopup existantServices={myServices}  />);
        result = renderer.getRenderOutput();
    });

    it("renders a Modal", () => {
        assert.equal(result.ref, 'modal', 'should be modal');
    });
    it("renders a griddle with three columns inside Modal", () => {
        let serviceCols=[ComponentVar.COL1,ComponentVar.COL2,ComponentVar.COL3];
        assert.sameMembers(result.props.children.props.columns, serviceCols, 'should be an array with the services columns');
    });
    it("renders a griddle with CheckBoxDisplay", () => {
        assert.equal(result.props.children.props.columnMetadata[0].customComponent.name, 'CheckBoxDisplay', 'should be checkbox' );
    });

});