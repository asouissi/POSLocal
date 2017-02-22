import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import NavTabs from "../../../core/components/lib/NavTabs";
import ListErrors from "../../../common/components/ListErrors.js";
import ContractSummary from "./ContractSummary";

class ContractTabsContainer extends Component {

    render() {
        let {submitFailed, control, params, error, ...props} = this.props;

        let tabs = [
            {
                key: 'summary',
                title: <FormattedMessage id="wholesale.contract.summary.title" defaultMessage="Summary"/>,
                body: <ContractSummary form="dealForm" dealPath="deal" params={params}/>
            }
        ];

        if ((submitFailed && error) || (control && control.controlemsgList && control.controlemsgList.length > 0)) {
            tabs.push({
                key: "errors",
                title: <FormattedMessage id="wholesale.contract.summary.controls" defaultMessage="Controls"/>,
                body: <ListErrors errors={error} control={control}/>,
                active: true
            })
        }

        return (
            <NavTabs className="summary" tabs={tabs}/>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        control: state.contracts.control
    }
};


export default connect(
    mapStateToProps
)(ContractTabsContainer);

ContractTabsContainer.propTypes = {
    error: PropTypes.array,
    syncErrors: PropTypes.object,
    accessKey: PropTypes.object,
    submitFailed: PropTypes.bool
}