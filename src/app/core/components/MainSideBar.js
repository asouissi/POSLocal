import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

import {Link} from 'react-router';

import classNames from 'classnames';

import {fetchDashboards} from '../reducers/navigation'

class MenuItemsComponent extends React.Component {

    renderSubItems(subItems, mainRoute, active) {
        let items = [];
        if (subItems) {
            let childs = subItems.map((subItem, index) => {

                let title = this.props.intl.formatMessage({id: subItem.title, defaultMessage: subItem.title})

                return (
                    <li key={subItem.id || index} className={subItem.active ? 'active' : ''}>
                        <Link to={mainRoute + (subItem.route || '/' + subItem.id)}>
                            <i className="fa fa-circle-o"></i> <span>{title}</span>
                        </Link>
                    </li>
                )
            });


            let cl = {
                'treeview-menu': true,
                // 'menu-open': active === true,
                'menu-close': active === false
            };
            items = (<ul className={classNames(cl)}>{childs}</ul>)
        }
        return items;
    }

    render() {
        let {route, title, icon, subItems, active} = this.props;

        let items = this.renderSubItems(subItems, route, active);

        let cl = {
            'treeview': true,
            'active': active,
            'menu-open': active && subItems
        };

        return (
            <li className={classNames(cl)}>
                <Link to={subItems ? "" : route}>
                    <i className={icon}></i>
                    <span>{title}</span>
                    {subItems ? <i className="fa fa-angle-left pull-right"></i> : ''}
                </Link>
                {items}
            </li>
        )
    }
}

const MenuItems = injectIntl(MenuItemsComponent);

const messages = defineMessages({
    searchPlaceHolder: {id: 'core.main.search.placeholder', defaultMessage: 'Search...'}
})

class MainSideBar extends React.Component {

    componentDidMount() {
        this.props.fetchDashboards();
    }

    render() {
        const menuItems = this.props.menuItems.sort((a, b) => {
            const getIndex = (v) => this.props.accesskeys.findIndex(m => v.route == m.key);
            return getIndex(a) - getIndex(b)
        }).map((menuItem, index) => {
            if (menuItem.visible) {
                return (
                    <MenuItems key={'menuItems-' + index} {...menuItem}/>
                )
            }
        });

        return (
            <aside className="main-sidebar">
                {/* sidebar: style can be found in sidebar.less */}
                <section className="sidebar">
                    <div hidden={this.props.topLeftBarCartoucheVisible == false}>
                        {/* Sidebar user panel */}
                        <div className="user-panel">
                            <div className="pull-left image">
                                <i className="glyphicon glyphicon-user img-circle">

                                </i>

                            </div>
                            <div className="pull-left info">
                                <p>{this.props.username}</p>
                                <a href="#"><i className="fa fa-circle text-success"></i><FormattedMessage
                                    id="core.main.online" defaultMessage="Online"/></a>
                            </div>
                        </div>
                        {/* search form */}
                        <form action="#" method="get" className="sidebar-form">
                            <div className="input-group">
                                <input type="text" name="q" className="form-control"
                                       placeholder={this.props.intl.formatMessage(messages.searchPlaceHolder)}/>
                                <span className="input-group-btn">
                <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i
                    className="fa fa-search"/>
                </button>
              </span>
                            </div>
                        </form>
                    </div>
                    {/* /.search form */}
                    {/* sidebar menu: : style can be found in sidebar.less */}
                    <ul className="sidebar-menu">
                        <li key="header" className="header" hidden={this.props.topLeftBarCartoucheVisible == false}>
                            <FormattedMessage id="core.main.navigation" defaultMessage="Main navigation"/>
                        </li>
                        {/*li><a href="#tasks"><i className="fa fa-book"></i> <span>My Tasks</span></a></li*/}

                        {menuItems}

                    </ul>
                </section>
                {/* /.sidebar */}
            </aside>
        )
            ;
    }
}

export default connect(
    state => ({
        username: state.authentication.username,
        accesskeys: state.authentication.accesskeys,
        menuItems: state.navigation.menuItems,
        topLeftBarCartoucheVisible: state.authentication.options.topLeftBarCartoucheVisible,
    }),
    {fetchDashboards}
)
(injectIntl(MainSideBar));