import React from 'react';
import {redirectToLoginWithMessage, getConfiguration, getSession, loginGuest, logout} from './reducers/authentication';
import {connect} from 'react-redux';
import Loader from './components/lib/Loader';

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated,
    isLoading: state.authentication.isLoading
});
const mapDispatchToProps = {
    redirectToLoginWithMessage,
    getConfiguration,
    getSession,
    loginGuest,
    logout
};

const privateRoute = (Wrapped) => connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {

    componentDidMount() {
        this.redirectIfNotLogged(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.redirectIfNotLogged(nextProps);
    }

    redirectIfNotLogged(props) {
        const {isAuthenticated, isLoading} = props;

        let route = props.routes.length && props.routes[props.routes.length-1];

        if(route.guestUser){
            if (!isLoading && !isAuthenticated ){
                this.props.logout(false).then(() => this.props.loginGuest())

                //this.props.loginGuest()
            }
            return;
        }

        if (!isLoading && !isAuthenticated) {
            this.props.getSession(); //add get session service java side
        }
    }

    render() {
        const {isAuthenticated, isLoading, ...props} = this.props;
        if (!isAuthenticated || isLoading) {
            return (<Loader/>);
        }
        return <Wrapped {...this.props} />;
    }
});

export default privateRoute;