/**
 * Created by zos on 14/06/2016.
 */
import{expect, assert, should} from 'chai'
import deepFreeze from 'deep-freeze'
import Immutable from 'seamless-immutable'
import newdeal3 from '../../../src/app/pos/deal/newdeal3/reducers/newdeal3';


describe('NewDeal3 Reducers', () =>{
    it('sets the asset to be drawn into the drawdeal from the listdealasset of the MF', () => {
        const initialSate =Immutable({
                                    deal: {
                                        listdealasset: [
                                            {dosid: 77777, dprversion: 'NEGO', dpmordre: 1,varid:1111},
                                            {dosid: 77777, dprversion: 'NEGO', dpmordre: 2,varid:2222},
                                            {dosid: 77777, dprversion: 'NEGO', dpmordre: 3,varid:3333}
                                        ]},
                                    drawdeal: {
                                        listdealasset: [
                                            {}
                                        ]}
        }) ;
       
        const variantExample = [{"varcode":"GOLF","listVarYear":[],"listLkvcavar":[],"listmakmodel":[],"makid":337,"makcode":null,"paycode":"FR","devcode":"EUR","actid":null,"makservicedistanceunit":null,"makservicedistanceinterval":null,"makservicetimeinterval":null,"maklibelle":null,"maksupportclaimmethod":null,"actnom":null,"actcode":null,"makvariantclass":null,"makoemclass":null,"tpgcode":null,"varid":8671,"varlibelle":"Golf","acacode":null,"mmocode":"GOLF","mmolibelle":null,"mmtcode":"CARAT","mmtlibelle":null,"varfueldelivery":null,"varbodytype":null,"varstatus":null,"vprmtvat":null,"vprmt":27000.0,"varmtprice":null,"varmtpricemin":null,"varmtpricemax":null,"varvehiclecategory":null,"pcrid":null,"pcrordre":null,"vyeyearcode":null,"varnbdoors":null,"vvaunit":null,"varbhp":null,"technicaldata":null,"technicaldatamin":null,"technicaldatamax":null,"operande":null,"vcaid":null,"flagvisible":false,"dosid4carpolicy":null,"listcustomcharacteristic":[],"listoptassignmentcriteriaVO":[],"listvartechnicaldata":[],"napcode":null,"varupdatedate":null,"naplibelle":null,"makoemclasslibelle":null,"varenergytype":null,"varcarbon":null,"taxcode":null,"imagevariant":"/images/variants/vw_golf_GRANDE.png","vardtstart":1446750801000,"vardtend":null,"varcomment":null}];
          
        deepFreeze(initialSate);

        var newstate = newdeal3(initialSate, {
            type: 'newdeal3/SELECT_ASSET_TO_DRAW_SUCCESS',
            dpmordreSelected: '2',
            result: {data :[variantExample] }
        });

        assert.equal(newstate.drawdeal.listdealasset.length, true, 'An asset must be added to the draw deal');

        assert.equal(newstate.drawdeal.listdealasset[0].varid, '2222', 'An asset must be added to the draw deal');

        assert.deepEqual(newstate.variant, [variantExample], 'the variant is set on the state');
    });
});