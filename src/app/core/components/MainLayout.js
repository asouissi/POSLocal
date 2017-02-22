import React from "react";
import {connect} from "react-redux";
import classNames from "classnames";
import HeaderBar from "./header/HeaderBar";
import MainSideBar from "./MainSideBar";
import ControlsSideMenu from "./ControlsSideMenu";
import Notifications from "../components/lib/notify";
const DEFAULT_EMPTY = [];

class MainLayout extends React.Component {

    getChildContext() {
        return {showAccessKeys: this.props.showAccessKeys};
    }

    render() {
        const {main, options, skinClass, ...props} = this.props;

        let hideMenu = props.routes.length && props.routes[props.routes.length - 1].hideMenu;
        let portalMode = props.routes.length && props.routes[props.routes.length - 1].portal;
        let header = hideMenu || options.HideTopBar ? DEFAULT_EMPTY : (<HeaderBar/>);
        let leftSide = hideMenu || options.HideLeftBar ? DEFAULT_EMPTY : (<MainSideBar />);
        let rightSide = hideMenu || options.HideRightBar ? DEFAULT_EMPTY : (<ControlsSideMenu />);

        let classes = 'content';
        if (this.props.routes && this.props.routes.length && this.props.routes[this.props.routes.length - 1].className) {
            classes += ' ' + this.props.routes[this.props.routes.length - 1].className;
        }
        if (portalMode) {
            classes += ' portal';
        }

        let contentClasses = {
            'content-wrapper': true,
            'fixed-Layout': options.fixedLayout,
            'full': options.HideLeftBar,
        };

        const content = (
            <section className={classes}>
                {main}
            </section>
        );

        if (hideMenu) {
            return content;
        }

        return (
            <div className={skinClass}>
                <Notifications/>
                {header}
                {leftSide}


                <div className={classNames(contentClasses)}>
                    {content}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        showAccessKeys: state.authentication.showFields,
        options: state.authentication.options,
        skinClass: state.authentication.skinClass
    })
)(MainLayout);

MainLayout.childContextTypes = {
    showAccessKeys: React.PropTypes.bool
};