import React, {Component} from "react";
import classNames from "classnames";
import {Transition} from "react-overlays";
import IntlComponent from "../../components/lib/IntlComponent";
import {connect} from "react-redux";
import {Collapse, ListGroup, Grid, Row, Col, Panel, Button} from "react-bootstrap";
import DashboardRenderer from "./DashboardRenderer";
import DraggableCol from "./DraggableCol";
import {DASHBOARD_EDITOR_ID, fetchEditorConfig, fetchFirstItem, allocateItemKey} from "../dashboardReducer";
import {FormattedMessage} from 'react-intl';
import Loader from '../../components/lib/Loader';

class Item1 extends IntlComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let item = this.props.item;

        let cl = {
            ['list-group-item']: true,
            addItem: true,
            ['addItem' + this.props.itemLevel]: true,
            active: this.props.active
        };

        let title = this.context.intl.formatMessage({id: item.title});
        let subTitle = this.context.intl.formatMessage({id: item.subTitle});

        return (<li className={classNames(cl)} onClick={this.props.onClick}>
            <h4 className="list-group-item-heading">{title}</h4>
            <p className="list-group-item-text">{subTitle}</p>
            <span className="addItemPlus fa fa-arrow-right"></span>
        </li>);
    }
}

class Item2 extends IntlComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let item = this.props.item;

        let cl = {
            ['list-group-item']: true,
            addItem: true,
            ['addItem' + this.props.itemLevel]: true,
            active: this.props.active
        };

        let title = this.context.intl.formatMessage({id: item.title});

        return (<li className={classNames(cl)} onClick={this.props.onClick}>
            {title}
            <span className="addItemPlus fa fa-arrow-right"></span>
        </li>);
    }
}

class DashboardAddItem extends IntlComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({item1: null, item2: null, nextItem1: null, nextItem2: null, renderedItem: null});

            if (nextProps.show) {
                if (!nextProps.items || !nextProps.items.length) {
                    this.props.dispatch(fetchEditorConfig(this.props.api));
                }
            }
        }

        if (nextProps.dashboard !== this.props.dashboard) {
            if (nextProps.dashboard.layout[0] !== this.props.dashboard.layout[0]) {
                let cellLayout = nextProps.dashboard.layout[0];

                if (cellLayout.isLoading) {
                    this.setState({renderedItem: null});

                } else {
                    let renderedItem = (<DraggableCol key={cellLayout.$key}
                                                      cellKey={cellLayout.$key}
                                                      cellLayout={cellLayout}
                                                      dashboardContainer={nextProps.dashboardContainer}
                                                      closeAddItem={true}
                                                      enableDrag={true}
                                                      layoutClass={cellLayout.layoutClass}>
                        {DashboardRenderer.renderItem(cellLayout)}
                    </DraggableCol>);

                    this.setState({renderedItem: renderedItem});
                }
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.show !== this.props.show) {
            return true;
        }

        if (nextState.item1 !== this.state.item1) {
            return true;
        }

        if (nextState.item2 !== this.state.item2) {
            return true;
        }

        if (nextState.nextItem1 !== this.state.nextItem1) {
            return true;
        }

        if (nextState.nextItem2 !== this.state.nextItem2) {
            return true;
        }

        if (nextState.renderedItem !== this.state.renderedItem) {
            return true;
        }

        if (nextProps.items !== this.props.items) {
            return true;
        }

        if (nextProps.loading !== this.props.loading) {
            return true;
        }

        if (nextProps.error !== this.props.error) {
            return true;
        }

        if (nextProps.dashboard !== this.props.dashboard) {
            return true;
        }

        if (nextProps.dragging !== this.props.dragging) {
            return true;
        }

        return false;
    }

    onItem1Click(event, item) {
        event.preventDefault();

        let prevItem = this.state.item1;

        if (prevItem === item) {
            return;
        }

        if (!prevItem) {
            this.setState({nextItem1: item, item1: item, item2: null, nextItem2: null});
            return;
        }

        this.setState({
            prevItem1: prevItem,
            nextItem1: null,
            item1: item,
            item2: null,
            nextItem2: null
        });
    }

    onItem2Click(event, item) {
        event.preventDefault();

        let prevItem = this.state.item2;

        if (prevItem === item) {
            return;
        }

        if (!prevItem) {
            this.setState({nextItem2: item, item2: item});

            let itemKey = allocateItemKey();
            this.props.dispatch(fetchFirstItem(DASHBOARD_EDITOR_ID, item.url, itemKey, item.layoutClass, [], this.props.api));
            return;
        }

        this.setState({prevItem2: prevItem, nextItem2: null, item2: item});
    }

    renderLevel1(list) {
        return list.map((item, index) => {
            return <Item1 key={index} item={item} itemLevel="1"
                          active={item === this.state.item1}
                          onClick={(event) => this.onItem1Click(event, item)}/>
        });
    }

    renderLevel2(item) {
        if (!item) {
            return [];
        }

        var list = item.items;

        return list.map((item, index) => {
            return <Item2 key={index} item={item} itemLevel="2"
                          active={item === this.state.item2}
                          onClick={(event) => this.onItem2Click(event, item)}/>
        });
    }


    renderLevel3(item) {
        let preview = [];

        let label = this.context.intl.formatMessage({
            id: "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.MoveToDashboard",
            defaultMessage: "Drag to dashboard"
        });

        return (<Panel className="item3">
            <label className="dnd-label">{label}</label>

            <div className="dnd-zone">
                {this.state.renderedItem || []}
            </div>
        </Panel>);
    }

    animation1exited() {
        this.setState({prevItem1: null, nextItem1: this.state.item1});
    }

    animation2exited() {
        this.setState({prevItem2: null, nextItem2: this.state.item2, renderedItem: null});

        let item = this.state.item2;
        let itemKey = allocateItemKey();
        this.props.dispatch(fetchFirstItem(DASHBOARD_EDITOR_ID, item.url, itemKey, item.layoutClass, [], this.props.api));
    }

    cloneDragReactComponent = (props) => {
        let renderedItem = this.state.renderedItem;
        if (!renderedItem) {
            return null;
        }

        let col = renderedItem.props.children;

        let layout = col.props.layout.setIn(['$key'], allocateItemKey());
        props = {...props, layout};

        let clonedElement = React.cloneElement(col, props);

        return clonedElement;
    }

    render() {
        let cl = {
            'dashboard-add-panel': true,
            'dragging': this.props.dragging
        };

        if (this.props.loading) {
            return (<Collapse in={!!this.props.show} className="dashboard-add-panel">
                <div key="overlay" className="overlay">
                    <Loader/>
                </div>
            </Collapse>);
        }

        if (this.props.error) {
            return (<Collapse in={!!this.props.show} className="dashboard-add-panel">
                <div>Error: {this.props.error}</div>
                <span className="fa fa-chain-broken"/>
            </Collapse>);
        }

        if (!this.props.items || !this.props.items.length) {
            return (<Collapse in={!!this.props.show} className="dashboard-add-panel">
                <div></div>
            </Collapse>);
        }

        return (<Collapse in={!!this.props.show} className={classNames(cl)}>
            <Grid>
                <Row>
                    <Col md={4} key="level1" className="colItems1">
                        <ListGroup componentClass="ul">
                            {this.renderLevel1(this.props.items)}
                        </ListGroup>
                    </Col>
                    <Col md={4} key="level2" className="colItems2">
                        <Transition in={!!this.state.nextItem1} className="items2" enteredClassName="items2-in"
                                    enteringClassName="items2-in" onExited={() => this.animation1exited()}>
                            <ListGroup componentClass="ul">
                                {this.renderLevel2(this.state.prevItem1 || this.state.item1)}
                            </ListGroup>
                        </Transition>
                    </Col>
                    <Col md={4} key="level3" className="colItems3">
                        <Transition in={!!this.state.nextItem2} className="items3" enteredClassName="items3-in"
                                    enteringClassName="items3-in" onExited={() => this.animation2exited()}>
                            <ListGroup componentClass="div">
                                {this.renderLevel3(this.state.prevItem2 || this.state.item2)}
                            </ListGroup>
                        </Transition>
                    </Col>
                </Row>
                <Row>
                    <button type="button" className="btn btn-box-tool" onClick={this.props.onReset}>
                        <i className="fa fa-undo"/> <FormattedMessage id="core." defaultMessage="Reset layout"/>
                    </button>
                </Row>
            </Grid>
        </Collapse>);
    }
}

function mapStateToProps(state, props) {
    const dashboard = state.dashboardsReducer.dashboards[DASHBOARD_EDITOR_ID] || {};
    return {
        dashboard: dashboard,
        items: state.dashboardsReducer.config.types,
        loading: state.dashboardsReducer.config.loading,
        error: state.dashboardsReducer.config.error
    };
}

export default connect(mapStateToProps, null, null, {withRef: true})(DashboardAddItem);