import React from 'react';
import {Button, Checkbox, InputGroup} from 'react-bootstrap';
import {createSelector} from 'reselect'
import {screenSizes} from '../../adminLTE/adminLTE';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import isEmpty from 'lodash/isEmpty'
import {FormattedMessage, injectIntl, defineMessages, formatMessage} from 'react-intl';
import TimelineMenu from './TimelineMenu';

import {updateConfiguration} from '../../reducers/authentication'
import {getGlobalTimeLine, readItem} from '../../../common/timeline/reducers/actions'
import {timelineSelector} from '../../../common/timeline/TimelineSelector'
import ProfileModal from './ProfileModal';
import {fetchLocale} from '../../reducers/locales'
import DealershipBrandContainer from './DealershipBrandContainer'

export const TIMELINE = '/timeline';
const DEFAULT_EMPTY = [];

class HeaderBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeline: [],
            nbNewTimeline: 0,
            showProfileModal: false
        }
    }

    componentWillUnmount() {
        this.stopTimeLinePoll();
    }

    componentWillReceiveProps(nextProps) {
        let hasTimeline = nextProps.menuItems.filter(item => item.route == TIMELINE && item.visible).length;

        if (hasTimeline && !this.timeLineInterval) {
            this.startTimeLinePoll();
        }
    }

    startTimeLinePoll() {

        this.stopTimeLinePoll();
        this.props.dispatch(getGlobalTimeLine('global', new Date().getTime(), 5));
        this.timeLineInterval = setInterval(() => this.props.dispatch(getGlobalTimeLine('global', new Date().getTime(), 5)), 1000 * 60 * 2);
    }

    stopTimeLinePoll() {
        if (this.timeLineInterval) {
            clearInterval(this.timeLineInterval);
            this.timeLineInterval = undefined
        }
    }


    pushMenu() {
        var body = document.body;
        if (body.clientWidth > screenSizes.sm - 1) {
            if (body.className.indexOf('sidebar-collapse') === -1) {
                body.className += ' sidebar-collapse';
            } else {
                body.className = body.className.replace(' sidebar-collapse', '');
            }
        } else {
            if (body.className.indexOf('sidebar-open') === -1) {
                body.className += ' sidebar-open';
            } else {
                body.className = body.className.replace(' sidebar-open', '');
            }
        }
    }

    handleReadItem(item, isRead) {
        this.props.dispatch(readItem(item, 'page', isRead)); //dont pass dealId
    }

    closeProfile = () => {
        this.setState({showProfileModal: false});
    }

    openProfile = () => {
        this.setState({showProfileModal: true});
    }

    handleLocaleChanged = (event) => {
        var value = event.code;
        this.props.dispatch(updateConfiguration({skin: this.props.skinClass, locale: value.replace('-', '_')},
            (dispatch)=>dispatch(fetchLocale(value)) //fetchLocale after success
        ))
        this.closeProfile();
    };

    handleChangeSkin = (skinClass) => {
        this.closeProfile();
        this.props.dispatch(updateConfiguration({skin: skinClass, locale: this.props.locale}))
    };

    render() {
        const {
            handleSubmit, submitting, pristine, contract, reset, dealerships, brands
        } = this.props;

        let numberOfNew = this.props.timeline.reduce((total, element) => total += element.isNew ? 1 : 0, 0);
        let hasTimeline = this.props.menuItems.filter(item => item.route == TIMELINE && item.visible).length;
        let timeline = DEFAULT_EMPTY;
        if (hasTimeline) {
            timeline = (
                <li className="dropdown messages-menu">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <i className="fa fa-envelope-o"/>
                        <span className="label label-success">{numberOfNew}</span>
                    </a>
                    <TimelineMenu timeline={this.props.timeline} menuItems={this.props.menuItems}
                                  nbNewTimeline={numberOfNew}
                                  onReadItem={(item, isRead) => this.handleReadItem(item, isRead)}/>

                </li>

            )
        }

        const logos = <Link to="/" className="logo">
            <span className="logo-mini">{isEmpty(this.props.topLeftItem.toplefttitleimagemin) ? (
                <b>{this.props.topLeftItem.toplefttitle.substring(0, 1)}</b>) : (
                <img src={this.props.topLeftItem.toplefttitleimagemin}/>)}</span>
            <span className="logo-lg truncate">{isEmpty(this.props.topLeftItem.toplefttitleimage) ? (
                <b>{this.props.topLeftItem.toplefttitle}</b>) : (
                <img src={this.props.topLeftItem.toplefttitleimage}/>)}</span>
        </Link>


        return (
            <header className="main-header">
                <ProfileModal showModal={this.state.showProfileModal} onClose={this.closeProfile}
                              showSkinSelector={this.props.showSkinSelector}
                              username={this.props.username}
                              locale={this.props.locale}
                              onLocaleChange={this.handleLocaleChanged}
                              onSkinChange={this.handleChangeSkin}
                />

                {logos}

                <nav className="navbar navbar-static-top" role="navigation">
                    <div className="sidebar-toggle" data-toggle="offcanvas" role="button" onClick={this.pushMenu}>
                        <span className="sr-only">Toggle navigation</span>
                    </div>

                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">

                            {timeline}

                            <li className="dropdown user user-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <i className="glyphicon glyphicon-user user-image"/>
                                    <span className="hidden-xs">{this.props.username}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    {/* User image*/}
                                    <li className="user-header">
                                        <i className="glyphicon glyphicon-user img-circle"/>
                                        <p>
                                            {this.props.username} - {this.props.groupLabel}
                                            <small>Since Nov. 2015</small>
                                        </p>
                                    </li>

                                       {/* DropDowns for dealership and financial brands selection */}

                                        <DealershipBrandContainer />

                                    {/* Menu Footer*/}
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <button onClick={this.openProfile} className="btn btn-default btn-flat">
                                                Profile
                                            </button>
                                        </div>
                                        <div className="pull-right">
                                            <Link to="logout" className="btn btn-default btn-flat" >
                                                <FormattedMessage id="core.header.profile.signount"
                                                                  defaultMessage="Sign out"/>
                                            </Link>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                </nav>
            </header>
        );
    }
}

const makeMapStateToProps = () => {
    const getTimeLine = timelineSelector()
    const mapStateToProps = (state) => ({
        username: state.authentication.user.firstname,
        groupLabel: state.authentication.user.groupelabel,

        skinClass: state.authentication.skinClass,
        showSkinSelector: state.authentication.options.showskinselector,
        topLeftItem: logosSelector(state),
        timeline: getTimeLine(state.timeline.global), //todo: remove common dep
        menuItems: state.navigation.menuItems,
        locale: state.locales.lang,
        defaultDealership: state.authentication.user.dealershipdefault,
        defaultBrand: state.authentication.user.branddefault,
    });

    return mapStateToProps;
};

const logosSelector = createSelector(
    state => state.authentication.options.toplefttitle,
    state => state.authentication.options.toplefttitleimage,
    state => state.authentication.options.toplefttitleimagemin,
    (toplefttitle, toplefttitleimage, toplefttitleimagemin) => {
        return {
            toplefttitle: toplefttitle,
            toplefttitleimage: toplefttitleimage,
            toplefttitleimagemin: toplefttitleimagemin
        }
    }
)

export default connect(makeMapStateToProps)
(HeaderBar);