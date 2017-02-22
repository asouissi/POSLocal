import{expect, assert, should} from 'chai'
import config from './config'

import axios from 'axios'


import {setupAxiosInterceptors} from '../../../src/app/core/config/axios';
import * as loginActions from '../../../src/app/core/reducers/authentication';
import * as tmActions from '../../../src/app/common/timeline/reducers/actions';

setupAxiosInterceptors(config, (error) => console.log('error', error));

const dealId = 75427; //maby change a day


describe('RESTAPI.TimeLine ', () => {

    before(()=>{
        return loginActions.login('ORFI', 'ORFI').promise(axios);
    });

    after(()=>{
        loginActions.logout().promise(axios);
    });

    it('I want to get a timeline for dosid 75427 ', (done) => {
        
        tmActions.fetchTimeline(dealId).promise(axios).then(response =>{
            assert.equal(response.data.length > 0, true, 'I should be able to fetch a timeline');

            let event = response.data[0];
            assert.deepEqual(Object.keys(event).sort(),
                ['creationdate', 'dealid', 'dprnom', 'dprnumero', 'jalcode', 'jallibelle', 'description', 'usercode', 'userfirstname', 'userlastname', 'receptiondate','type', 'subtype', 'comment'].sort(),
                'Event structure must contains A type, a subType, a username an a creation date');

        }).then(done).catch(done)
    })

});

