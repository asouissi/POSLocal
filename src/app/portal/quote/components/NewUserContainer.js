'use strict'
import React, {Component} from "react";
import {Field} from "redux-form";
import TextEntry from "../../../core/components/lib/TextEntry";
import Box from "../../../core/components/lib/Box";
import {FormattedMessage} from "react-intl";
import {normalizePhone} from "../../../core/utils/ValidationUtils";

export default class NewUser extends Component {

    render() {
        return (
            <form >
                <Box type="primary" title="Create user">

                    <div className="row">
                        <div className="col-sm-4">
                            <Field name="user.uticode"
                                   component={TextEntry}
                                   groupClassName="input-text-login"
                                   title={<FormattedMessage id="portal.quote.user.username" defaultMessage="Username"/>}
                            />
                        </div>
                        <div className="col-sm-4">
                            <Field name="user.utipwd"
                                   component={TextEntry}
                                   type="password"
                                   groupClassName="input-text-login"
                                   title={<FormattedMessage id="portal.quote.user.password" defaultMessage="Password"/>}
                            />
                        </div>
                        <div className="col-sm-4">
                            <Field name="uticomfirmpwd"
                                   component={TextEntry}
                                   type="password"
                                   groupClassName="input-text-login"
                                   title={<FormattedMessage id="portal.quote.user.confirmpassword"
                                                            defaultMessage="Confirm password"/>}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <Field name="user.utitelecom"
                                   component={TextEntry} normalize={normalizePhone}
                                   title={<FormattedMessage id="portal.quote.user.telecom"
                                                            defaultMessage="Phone number"/>}/>
                        </div>
                        <div className="col-sm-4">
                            <Field name="user.email"
                                   component={TextEntry}
                                   title={<FormattedMessage id="portal.quote.user.email"
                                                            defaultMessage="Email"/>}/>
                        </div>
                    </div>
                </Box>
                <div className="text">
                    <input type="checkbox" className="checkBoxStyle" checked/>
                    I agree to the <font color="blue"><u>disclaimer</u></font> , Terms and conditions apply.
                </div>
            </form>);
    }
}