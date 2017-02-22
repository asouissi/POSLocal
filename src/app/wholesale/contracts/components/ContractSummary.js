import React from 'react'
import {FormattedMessage, FormattedNumber} from 'react-intl';
import config from './config'
import InterestTable from './InterestTable';
import Box from '../../../core/components/lib/Box';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form'
import RepayementTable from './RepayementTable';
import AssetInformationContainer from './AssetInformationContainer';
import {Link} from 'react-router';
import  {CREDITLINEDETAIL, CONTRACT} from '../../index';

const DEFAULT_EMPTY = [];
class ContractSummary extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {

        let {repayment, interest, formValues, ...props} = this.props;
        const assetActionButtons = this.renderActionButtons();

        return (<div>
            <Box
                title={<FormattedMessage id="wholesale.contract.repayment.box.title"
                                                         defaultMessage=" Principal repayments"/>}>
                <RepayementTable
                    rows={repayment}
                    />
            </Box>

            <Box
                title={<FormattedMessage id="wholesale.contract.interest.box.title"
                                                         defaultMessage=" Interest payments"/>}>
                <InterestTable
                    rows={interest}
                    />
            </Box>

            <AssetInformationContainer
                asset={formValues}>
                {assetActionButtons}
            </AssetInformationContainer>
        </div>);
    }

    renderActionButtons() {
        if (this.props.params.contractId == 0) {
            return DEFAULT_EMPTY
        }
        let disabled = this.props.readonly === "1" ? "disabled" : "";

        return (

            <div className="text-center">

                <span className={this.props.readonly === "1" ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/documents'
                    }} className="glyphicon glyphicon-folder-open">

                    </Link>
                    <FormattedMessage id="wholesale.contract.link.documents"
                                      defaultMessage="Documents"/>
                </span>

                <span
                    className={this.props.isSettled || (this.props.readonly === "1") ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/settle'
                    }} className="fa fa-legal">
                    </Link>
                    <FormattedMessage id="wholesale.contract.link.settle"
                                      defaultMessage="Settle"/>
                </span>
                <span
                    className={this.props.acacode=='USED' || !this.props.canBeConverted || (this.props.readonly === "1") ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/convert'
                    }} className="fa fa-refresh">
                    </Link>
                    <FormattedMessage id="wholesale.contract.link.convert"
                                      defaultMessage="Convert"/>
                </span>

            </div>
        );
    }
}
const selector = formValueSelector('contract');

const mapStateToProps = (state, props) => {

    return {
        interest: state.contracts.interest,
        repayment: state.contracts.repayment,
        formValues: selector(state, 'makid', 'mmocode', 'mmtcode',
            'dosmtproduct', 'dosidtemplate', 'dosdtdeb', 'dosid', 'irccolor', 'iruserialnumber')
    }
};

export default connect(
    mapStateToProps
)(ContractSummary);
