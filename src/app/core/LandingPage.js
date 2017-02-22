import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {DASHBOARD} from './reducers/navigation'
import {FormattedMessage} from 'react-intl';

const mapStateToProps = (state) => ({
    landingPage: state.authentication.options.landingpage,
    dashboards:  state.navigation.menuItems.find(item => item.route === DASHBOARD)
     
});
const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component {

    redirectToLandingPage(props){
        const {landingPage, dashboards} = props;
        if (landingPage) {
            hashHistory.push(landingPage);
        } else if (dashboards && dashboards.visible && dashboards.subItems) {
            let item = dashboards.subItems[0];
            hashHistory.push(DASHBOARD + (item.route || '/'+item.id));
        }

    }

    componentDidMount() {
        this.redirectToLandingPage(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const {landingPage, dashboards} = this.props;
        if( (nextProps.landingPage && nextProps.landingPage !== landingPage)
            || (!nextProps.landingPage && nextProps.dashboards.subItems &&
            (!dashboards.subItems || nextProps.dashboards.subItems.length !== dashboards.subItems.length) )){
            this.redirectToLandingPage(nextProps);
        }
    }

    render() {
       return (
           <div>
               <FormattedMessage id="core.landingpage.configuration.required" 
                                 defaultMessage="No landing page and no dashboard have been defined in resource /userconfiguration" />
           </div>
       )
    }
});
