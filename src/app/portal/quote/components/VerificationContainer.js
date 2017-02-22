/**
 * Created by PrashantK on 11-11-2016.
 */

'use strict'
import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import Box from "../../../core/components/lib/Box";
import {verifyRecaptcha, verifyTermsConditions} from "../reducers/actions";


// importing js file provided by Google to support recaptcha widget


var Recaptcha = require('react-gcaptcha');
var imported = document.createElement('script');
imported.setAttribute('async', true);
imported.setAttribute('defer', true);
imported.src = 'https://www.google.com/recaptcha/api.js?';
document.head.appendChild(imported);
const DEFAULT_EMPTY = "";

class VerificationCaptcha extends React.Component {

    callback = (key) => {
        if (key) {
            this.props.verifyRecaptcha();
        }
    };


    handleDeclaration = (event) => {
        this.props.verifyTermsConditions(event.target.checked);
    }

    render() {
        const {
            recaptchaStatus, flagDisclaimer, reCaptchaKeys, ...props
        } = this.props;

        var boxClass = recaptchaStatus == 0 ? "has-error" : DEFAULT_EMPTY;
        var chkBoxClass = flagDisclaimer == false ? "has-error" : "checkbox-alignment";

        return (
            <div>
                <Box type="primary" title="Verification details" withBoder="true" className={boxClass}>

                    <Recaptcha
                               sitekey={reCaptchaKeys.siteKey}
                               secretkey={reCaptchaKeys.secretKey}
                               verifyCallback={this.callback}
                    />

                </Box>
                <div id="app"></div>
                <div className={"text " + chkBoxClass}>
                    <input type="checkbox" name="chkDeclaration" className="checkBoxStyle"
                           onChange={this.handleDeclaration} checked={flagDisclaimer}/>
                    I agree to the <font color="blue"><u>disclaimer</u></font> ,Terms and conditions apply.
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {
    return {
        reCaptchaKeys: state.authentication.reCaptchaKeys,
        recaptchaStatus: state.portalquote.recaptchaStatus,
        flagDisclaimer: state.portalquote.flagDisclaimer,
    }
};

const mapDispatchToProps = {
    verifyRecaptcha, verifyTermsConditions
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(VerificationCaptcha));


