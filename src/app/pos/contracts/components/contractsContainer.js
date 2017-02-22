import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {fecthContracts} from '../reducers/actions'
import ContractsDetailTable from './contractsDetailTable'
import Box from '../../../core/components/lib/Box'

class ContractsContainer extends Component {
    componentWillMount() {
        this.props.fecthContracts();
    }

    render() {
        const {rows, currencySymbol} = this.props;
        return (
            <div>
                <Box type="primary" title={<FormattedMessage id="pos.contracts.components.mycontracts"
                                                             defaultMessage="My contracts"/>}>
                    <ContractsDetailTable rows={rows} currencySymbol={currencySymbol}/>
                </Box>
            </div>
        );
    }
}

const mapDispatchToProps = {fecthContracts};

export default connect(
    state => ({
        rows: state.contractsList.contracts,
        currencySymbol: state.authentication.user.currencysymbol,
    }),
    mapDispatchToProps
)(ContractsContainer);
