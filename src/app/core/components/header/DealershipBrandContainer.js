/**
 * Created by zos on 02/12/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import {FormattedMessage, injectIntl, defineMessages, formatMessage} from 'react-intl';
import {reduxForm, Field, formValueSelector} from 'redux-form'

import SelectField from '../../../core/components/lib/SelectField';

import {updateConfiguration, fetchDealerShips, fetchFinancialBrands, removeCache} from '../../reducers/authentication'
import {createSelector} from 'reselect'

const DEFAULT_EMPTY = [];
const NO_BER_DROWN = 0;
const ONE_BER_DROWN = 1;
const TWO_BER_DROWN = 2;
const messages = defineMessages({
    dealershipPlaceHolder: {id: "core.profile.dealership.placeholder", defaultMessage: 'Select dealership'},
    dealershipBrandPlaceHolder: {
        id: "core.profile.dealershipbrand.placeholder",
        defaultMessage: 'Select dealership/brand'
    },
    brandPlaceHolder: {id: "core.profile.brand.placeholder", defaultMessage: 'Select brand'},
    btnApply: {id: "core.profile.apply.btn", defaultMessage: 'Apply'},
    defaultCheckbox: {id: "core.profile.default.checkbox", defaultMessage: 'Default'}
});

class DealershipBrandContainer extends React.Component {
    componentWillMount() {

        if(this.props.networkStepSelection ) {

            this.props.fetchDealerShips();

            if (this.props.networkStepSelection === TWO_BER_DROWN && this.props.defaultDealership) { // if dealership defined, fetch brands
                this.props.fetchFinancialBrands(this.props.defaultDealership);
            }
        }
    }

    handleChangeDealership = (value) => {
        this.props.fetchFinancialBrands(value.code);
        this.props.updateConfiguration({dealershipcurrent: value.code});
        this.props.removeCache();
    };

    handleBrandChange = (value) => {
        this.props.updateConfiguration({brandcurrent: value.code});
        this.props.removeCache();
    };

    handleApplyOnClick = (data) => {
        if (!data) {
            return;
        }

        let config = {};

        if (this.props.networkStepSelection === TWO_BER_DROWN && data.dealership && data.brand) {
            config.dealershipcurrent = data.dealership;
            config.brandcurrent = data.brand;
        } else {
            let values = data.dealershipbrand.split('-');
            config.dealershipcurrent = values[0];
            config.brandcurrent = values[1];
        }

        if (data.setAsDefault) {
            config.dealershipdefault = config.dealershipcurrent;
            config.branddefault = config.brandcurrent;
        }

        this.props.updateConfiguration(config);

    };

    handleDealerShipBrandChange = (value) => {
        if (this.props.networkStepSelection === ONE_BER_DROWN) {
            let values = value.code.split('-');
            this.props.updateConfiguration({dealershipcurrent: values[0], brandcurrent: values[1]});
            this.props.removeCache();
        }
    };


    render() {
        const {
            handleSubmit, submitting, pristine, dealerships, brands, networkStepSelection
        } = this.props;
        // Prepare fields for the dealerships and brands select
        let dealershipsSelectField = DEFAULT_EMPTY;
        let brandsSelectField = DEFAULT_EMPTY;
        let dealershipPreferenceForm = DEFAULT_EMPTY;
        if (networkStepSelection && networkStepSelection !== NO_BER_DROWN) {
            if (dealerships && dealerships.length > 0) {
                if (networkStepSelection === ONE_BER_DROWN) {
                    dealershipsSelectField = ( <Field name="dealershipbrand"
                                                      title={<FormattedMessage id="core.profile.dealershipBrand.title"
                                                                               defaultMessage="Dealership / Brand"/>}
                                                      component={SelectField}
                                                      placeholder={this.props.intl.formatMessage(messages.dealershipBrandPlaceHolder)}
                                                      options={dealerships}
                                                      onChange={this.handleDealerShipBrandChange}
                    />);
                } else if (networkStepSelection === TWO_BER_DROWN) {
                    dealershipsSelectField = ( <Field name="dealership"
                                                      title={<FormattedMessage id="core.profile.dealership.title"
                                                                               defaultMessage="Dealerships"/>}
                                                      component={SelectField}
                                                      placeholder={this.props.intl.formatMessage(messages.dealershipPlaceHolder)}
                                                      options={dealerships} onChange={this.handleChangeDealership}
                    />);
                    if (brands && brands.length > 0) {
                        brandsSelectField = ( <Field name="brand"
                                                     title={<FormattedMessage id="core.profile.brands.title"
                                                                              defaultMessage="Brands"/>}
                                                     component={SelectField}
                                                     placeholder={this.props.intl.formatMessage(messages.brandPlaceHolder)}
                                                     options={brands}
                                                     onChange={this.handleBrandChange}/>);
                    }
                }


                dealershipPreferenceForm = (
                    <form>
                        {dealershipsSelectField}
                        {brandsSelectField}
                        <div className="row verticalCenter">
                            <div className="col-md-3">
                                <label
                                    htmlFor="setAsDefault">{this.props.intl.formatMessage(messages.defaultCheckbox)}</label>
                            </div>
                            <div className="col-md-1">
                                <div>
                                    <Field name="setAsDefault" id="setAsDefault" component="input" type="checkbox"/>
                                </div>
                            </div>
                            <div className="col-md-8">

                                <button type="submit"
                                        className="form-group btn btn-primary pull-right"
                                        onClick={handleSubmit(this.handleApplyOnClick)}
                                        disabled={submitting}>
                                    {this.props.intl.formatMessage(messages.btnApply)}
                                </button>
                            </div>
                        </div>
                    </form>

                );
            }
        }

        return (
            <div>
                {dealershipPreferenceForm}
            </div>
        );
    }
}

DealershipBrandContainer = reduxForm({
        form: 'preference',
        enableReinitialize: true,
    }
)(DealershipBrandContainer);

// This variable is used inside the mapStateToProps. Think always to use selector for these kind of vars
// otherwise (if declared inside mapStateToProps), for each state change, a new reference is given to this var , so bad perfs
const initValuesFromUserState = createSelector(
    state => state.authentication.user.dealershipcurrent,
    state => state.authentication.user.brandcurrent,
    (dealershipcurrent, brandcurrent) => {
        return {
            dealership: dealershipcurrent
            , brand: brandcurrent
            , dealershipbrand: dealershipcurrent + '-' + brandcurrent
        }
    }
)

const mapStateToProps = (state, props) => {
    return {
        defaultDealership: state.authentication.user.dealershipdefault,
        defaultBrand: state.authentication.user.branddefault,
        currentDealership: state.authentication.user.dealershipcurrent,
        currentBrand: state.authentication.user.brandcurrent,
        dealerships: state.authentication.dealerships,
        brands: state.authentication.brands,
        initialValues: initValuesFromUserState(state),
        networkStepSelection: state.authentication.options.networkstepselection // 0 : don't show dropdows // 1 : show one dropdown with dealership/brand //2 : show two dropdowns
    }

}
const mapDispatchToProps = {
    fetchDealerShips, fetchFinancialBrands, updateConfiguration, removeCache
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(injectIntl(DealershipBrandContainer));