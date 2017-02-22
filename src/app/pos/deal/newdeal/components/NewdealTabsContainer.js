import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import NavTabs from "../../../../core/components/lib/NavTabs";
import ListErrors from "../../../../common/components/ListErrors";
import {FormattedMessage} from "react-intl";
import GenericSummary from "../../components/GenericSummary";
import GenericTimeline from "../../components/GenericTimeline";
import {handleFaultyStep} from "../reducers/actions";

class NewdealTabsContainer extends Component {

    handleErrorClick = () => {
        this.props.handleFaultyStep(this.props.syncErrors ,'dealForm')
    }

    render() {
        let {submitFailed, assetIndex, accessKeys, quoteIndex, variant, control, dosid, error, ...props} = this.props;

        let tabs = [{
            key: 'summary',
            title: <FormattedMessage id="pos.deal.summary.title" defaultMessage="Summary"/>,
            body: <GenericSummary form="dealForm" dealPath="deal" variant={variant}
                                  isMF={props.isMF}
                                  accessKeys={accessKeys}
                                  assetIndex={assetIndex}
                                  quoteIndex={quoteIndex}/>
        }, {
            key: 'timeline',
            title: <FormattedMessage id="pos.deal.timeline.title" defaultMessage="Timeline"/>,
            body: <GenericTimeline dosid={dosid}/>
        }];

        if ((submitFailed && error) || (control && control.controlemsgList && control.controlemsgList.length > 0)) {
            tabs.push({
                key: "errors",
                title: <FormattedMessage id="pos.deal.controls" defaultMessage="Controls"/>,
                body: <ListErrors errors={error} control={control} onErrorClick={this.handleErrorClick}/>,
                active: true
            })
        }

        return (
            <NavTabs className="summary" tabs={tabs}/>
        )
    }
}

const mapStateToProps = (state, props) => {
    const isMF = +state.newdeal.isMF;

    return {
        dosid: state.newdeal.formValues.deal.dosid,
        control: state.newdeal.control,
        variant: state.newdeal.variant[state.newdeal.assetIndex],
        assetIndex: state.newdeal.assetIndex,
        quoteIndex: state.newdeal.quoteIndex,
        isMF,
}
};


export default connect(
    mapStateToProps, {handleFaultyStep}
)(NewdealTabsContainer);

NewdealTabsContainer.propTypes = {
    error: PropTypes.array,
    syncErrors: PropTypes.object,
    accessKeys: PropTypes.object,
    submitFailed: PropTypes.bool
}