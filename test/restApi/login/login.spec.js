import{expect, assert, should} from 'chai'
import config from './config'

import axios from 'axios'


import {setupAxiosInterceptors} from '../../../src/app/core/config/axios';
import loginReducer, * as actions from '../../../src/app/core/reducers/authentication';

setupAxiosInterceptors(config, () => actions.redirectToLoginWithMessage('not logged in'));

describe('RESTAPI.Login check login', () => {

    before(()=> {
        return actions.logout().promise(axios);
    })

    afterEach(()=> {
        actions.logout().promise(axios);
    })

    it('I want fail login with bad user ', (done) => {
        actions.login('WRONG', 'USER').promise(axios).catch((response) => {
            expect(response.response.status).equal(401);
        }).then(done).catch(done)

    })

    it('I want login with ORFI user ', (done) => {

        actions.login('ORFI', 'ORFI').promise(axios).then((response) => {
            expect(response.data).equal("Login success");
        }).then(done).catch(done)

    })

    it('I want login with ORFI user and get session', (done) => {

        actions.login('ORFI', 'ORFI').promise(axios).then((response) => {
            expect(response.data).equal("Login success");

            actions.login('', '', actions.SESSION_FAIL).promise(axios).then((response) => {
                expect(response.data).equal("Login success");
            }).then(done).catch(done)

        })


    })


})
