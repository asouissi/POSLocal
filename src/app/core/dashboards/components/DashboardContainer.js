'use strict'

import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import {DropTarget, DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {Row, Dropdown, MenuItem, Clearfix} from "react-bootstrap";
import FlipMove from "react-flip-move";
import classNames from "classnames";
import Immutable from "seamless-immutable";
import DashboardRenderer, {ColorScheme} from "./DashboardRenderer";
import ParameterBox from "./ParameterBox";
import DragDropEngine from "./DragDropEngine";
import DraggableCol from "./DraggableCol";
import DashboardAddItem from "./DashboardAddItem";
import {
    DEFAULT_DASHBOARD_ID,
    DASHBOARD_EDITOR_ID,
    fetchDashboardLayout,
    fetchItem,
    setParameter,
    resetParameters,
    drillUp
} from "../dashboardReducer";

const dropConfig = {

    canDrop(props) {
        return true;
    },

    hover(props, monitor, component) {
        let dashboardContainer = props.dashboardContainer;

        const clientOffset = monitor.getClientOffset();
        const domNode = ReactDOM.findDOMNode(component);
        const componentRect = domNode.getBoundingClientRect();

        const mouseX = clientOffset.x;// - componentRect.left;
        const mouseY = clientOffset.y;// - componentRect.top;

        //console.log("MouseX=", mouseX, "MouseY=", mouseY, "clientOffset=", clientOffset);

        if (this._lastX) {
            let d2 = Math.sqrt(Math.pow(mouseX - this._lastX, 2) + Math.pow(mouseY - this._lastY, 2));
//            console.log("d2=", d2, mouseX, mouseY);
            if (d2 < 8) {
                return;
            }
        }
        this._lastX = mouseX;
        this._lastY = mouseY;

        let cells = ReactDOM.findDOMNode(component.refs.flipMove).children;
        var infos = {};
        [...cells].find((cellNode) => {
            if (cellNode.getAttribute("data-animating")) {
                infos = null;
                return true;
            }

            let cellKey = cellNode.getAttribute("data-cellKey");
            if (!cellKey) {
                return false;
            }
            cellKey = parseInt(cellKey);

            const cellRect = cellNode.getBoundingClientRect();

            if (mouseY < cellRect.top || mouseY > cellRect.bottom) {
                return false;
            }

            if (mouseX < cellRect.left) {
                if (infos.domNode && infos.cellRect.left < cellRect.left) {
                    return false;
                }
            }

            if (mouseX > cellRect.right) {
                if (infos.domNode && infos.cellRect.right > cellRect.right) {
                    return false;
                }
            }

            const border = 25;

            infos.domNode = cellNode;
            infos.cellKey = cellKey;
            infos.cellRect = cellRect;
            infos.borderTop = (mouseY < cellRect.top + border);
            infos.borderBottom = (mouseY > cellRect.bottom - border);
            infos.borderLeft = (mouseX < cellRect.left + border);
            infos.borderRight = (mouseX > cellRect.right - border);

//            console.log("Find=>", child, cellName);
            return mouseX >= cellRect.left && mouseX <= cellRect.right;
        });

        //console.log("infos=", infos);

        let dragSourceInfo = monitor.getItem();

        if (!infos || (infos.cellKey === dragSourceInfo.cellKey && !infos.borderRight)) {
            return;
        }

        let layout = dashboardContainer.state.dragLayout;
        let sourcePos = layout.findIndex((cell) => cell.props.layout.$key === dragSourceInfo.cellKey);
        let targetPos = layout.findIndex((cell) => cell.props.layout.$key === infos.cellKey);
        // console.log("sourcePos=", sourcePos, "targetPos=", targetPos,"borderRight=",infos.borderRight);

        if (targetPos < 0 && layout.length) {
            return;
        }

        if (sourcePos < 0) {
            let prev = dashboardContainer.state.previousDraggedCol;

            if (!prev) {
                prev = dashboardContainer.cloneDragReactComponent({
                    layoutClass: dragSourceInfo.cellLayoutClass
                });

                dragSourceInfo.cellKey = prev.props.layout.$key;
                dashboardContainer.setState({previousDraggedCol: prev});
            }

            let l = layout.asMutable();
            l.splice(targetPos, 0, prev);
            layout = Immutable(l);

        } else {
            if (infos.borderRight && targetPos < layout.length && targetPos !== sourcePos) {
                targetPos++;
            }

            //console.log("prev=", component.state.previousTargetKey, "cur=", layout[targetPos].props.layout.$key);

            if (sourcePos !== targetPos) {
                //component.state.previousTargetKey = layout[targetPos].props.layout.$key;

                let prev = layout[sourcePos];
                let l = layout.asMutable();
                l.splice(sourcePos, 1);
                l.splice(targetPos, 0, prev);

                layout = Immutable(l);
            }
        }

        dashboardContainer.setState((state) => {
            var old = state.dragLayout;
            if (layout === old) {
                return;
            }
            if (layout && old && layout.length == old.length) {
                if (!layout.find((obj, idx) => obj !== old[idx])) {
                    return;
                }
            }

            return {dragLayout: layout, dragAnimation: true};
        });
    },

    drop(props, monitor, component) {
    }
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        dropOver: monitor.isOver(),
        dragItem: monitor.getItem(),
        itemType: monitor.getItemType(),
        dragging: !!monitor.getItemType()
    }
}


class Spacer extends Component {
    render() {
        return <div className="dashboard-spacer">&nbsp;</div>;
    }
}

class _Grid extends Component {

    animationStart = (child, domNode) => {
        domNode.setAttribute("data-animating", "true");
    }

    animationFinish = (child, domNode) => {
        domNode.removeAttribute("data-animating");
    }

    componentWillReceiveProps(nextProps) {
        let dashboardContainer = this.props.dashboardContainer;
        let dragLayout = dashboardContainer.state.dragLayout;

        if (!nextProps.dropOver && nextProps.canDrop && this.props.dropOver && nextProps.dragItem && dragLayout) {
            let sourcePos = dragLayout.findIndex((cell) => cell.props.layout.$key === nextProps.dragItem.cellKey);

            //console.log("DropOver sourcePos=", sourcePos);

            if (sourcePos >= 0) {
                let prev = dragLayout[sourcePos];
                let l = dragLayout.asMutable();
                l.splice(sourcePos, 1);
                dragLayout = Immutable(l);

                //console.log("DragLeave: newLayout=", dragLayout);

                dashboardContainer.setState({
                    previousDraggedCol: prev,
                    dragLayout: dragLayout,
                    dragAnimation: true
                });
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.layout !== this.props.layout) {
            return true;
        }
        if (nextProps.enableDrag !== this.props.enableDrag) {
            return true;
        }

        return false;
    }

    renderDraggableCells() {
        let layout = this.props.layout;
        if (!layout) {
            return [];
        }


        let testKeys = {};
        return layout.map((item) => {
            let cellLayout = item.props.layout;

            if (testKeys[cellLayout.$key]) {
                //console.log("************** SAME KEY");

                // Probleme de synchronisme entre le Layout de 'props' et le 'states' du dashboard
                return [];
            }
            testKeys[cellLayout.$key] = true;

            return (<DraggableCol key={cellLayout.$key}
                                  cellKey={cellLayout.$key}
                                  cellLayout={cellLayout}
                                  dashboardContainer={this.props.dashboardContainer}
                                  enableDrag={this.props.enableDrag}
                                  className={cellLayout.layoutClass}>
                    {item}
                </DraggableCol>);
        });
    }

    render() {
        let cl = {
            container: true,
            'dashboard-cell-body': true
        };

        return this.props.connectDropTarget(<div className={classNames(cl)}>
            <Row>
                <FlipMove ref="flipMove" disableAllAnimations={!this.props.enableDragAnimation}
                          onStart={this.animationStart} onFinish={this.animationFinish} leaveAnimation="none">
                    {this.renderDraggableCells()}
                </FlipMove>
            </Row>
        </div>);

    }
}

const DroppableGrid = (DropTarget(DragDropEngine.ItemTypes.SIZE_3, dropConfig, dropCollect)(_Grid));

export class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.dragLayout !== this.state.dragLayout) {
            return true;
        }
        if (nextState.layout !== this.state.layout) {
            return true;
        }

        if (nextProps.skinClass !== this.props.skinClass) {
            return true;
        }

        if (nextState.dragging !== this.state.dragging) {
            return true;
        }
        if (nextState.addItemShown != this.state.addItemShown) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        this.props.dispatch(fetchDashboardLayout(this.props.resources || this.props.params.config, this.props.requestBack))
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.resources && nextProps.params.config && nextProps.params.config !== this.props.params.config
            || nextProps.skinClass !== this.props.skinClass) {
            this.setState({layout: undefined});

            if (nextProps && nextProps.routeParams) {
                this.props.dispatch(fetchDashboardLayout(nextProps.routeParams.config, this.props.api));
            }
            return;
        }

        if (!nextProps.dashboard.layout) {
            this.setState({layout: []});
            return;
        }
        if(nextProps.dashboard.layout.length == 0)
            this.setState({addItemShown: this.state.addItemShow || (nextProps.showDashboardEditor && nextProps.dashboard.editable)});

        if (nextProps.dashboard.id !== this.props.dashboard.id) {
            this.updateLayout(nextProps);

        } else if (nextProps.dashboard.layout !== this.props.dashboard.layout) {
            //console.log("Update layout detected !");
            this.updateLayout(nextProps);
        }

        if (this.state.addItemShown && !(nextProps.showDashboardEditor && nextProps.dashboard.editable ))
            this.setState({addItemShown: false});
    }

    updateLayout(nextProps) {

        let nextLayoutDescription = nextProps.dashboard.layout
        this.setState((state) => {
            let previousLayout = state.layout || [];

            let newLayout = nextLayoutDescription.map((layoutDescription) => {
                if (!layoutDescription.type && !layoutDescription.isLoading && !layoutDescription.error) {
                    let params = this.serializeDashboardParameters(nextProps.dashboard.parameters);

                    this.props.dispatch(fetchItem(nextProps.dashboard.id, layoutDescription.url, layoutDescription.$key, params, null, nextProps.api));

                    return DashboardRenderer.renderItem(layoutDescription);
                }

                let previousCell = previousLayout.find((cellLayout) => cellLayout.props.layout === layoutDescription);

                if (previousCell) {
                    return previousCell;
                }

                return DashboardRenderer.renderItem(layoutDescription, this.handleDrillDown, this.handleDrillUp);
            });

            return {layout: newLayout};
        });
    }

    handleDrillUp = (layoutConfig, drillUpConfig) => {
        //console.log("HandleDrillUp", "layout=", layoutConfig, "drillUpConfig=", drillUpConfig);
        this.props.dispatch(drillUp(this.props.resources || this.props.params.config, layoutConfig.$key, drillUpConfig))
    }

    handleDrillDown = (layoutConfig, point, config) => {
        //console.log("HandleDrillDown", "layout=", layoutConfig, "point=", point, "config=", config);

        this.props.dispatch(fetchItem(this.props.resources || this.props.params.config,
            point.link + '?drill=' + point.key,
            config.$key,
            this.serializeDashboardParameters(this.props.dashboard.parameters),
            config, this.props.api)
        );
    }

    serializeDashboardParameters(parameters) {
        if (!parameters) {
            return [];
        }
        return parameters.map(parameter => {
            return {key: parameter.key, value: parameter.value};
        });
    }

    onParameterChange(parameter) {
        this.props.dispatch(setParameter(this.props.dashboard.id, parameter))
    }

    submitParameters(parameters) {
        let params = this.serializeDashboardParameters(parameters || this.props.dashboard.parameters);
        this.props.dashboard.layout.forEach((cell) => {
            this.props.dispatch(fetchItem(this.props.dashboard.id, cell.url, cell.key, params, this.props.api));
        });
    }

    resetParameters() {
        this.props.dispatch(resetParameters(this.props.dashboard.id));
        this.submitParameters(this.props.dashboard.initialParameters);
    }

    handleAddItemClick = (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        this.setState({addItemShown: true});
    }

    handleCloseClick = (event) => {
        event.preventDefault();

        this.setState({addItemShown: false});
    }

    handleResetLayoutClick = () => {
        localStorage.removeItem('dashboard:layout:' + this.props.dashboard.id);
        this.props.dispatch(fetchDashboardLayout(this.props.resources || this.props.params.config, this.props.api))
    }

    cloneDragReactComponent(props) {
        return this.refs.addItem.refs.wrappedInstance.cloneDragReactComponent(props);
    }

    render() {
        let dashboardClasses = {
            dashboard: true,
            'dashboard-dragging': !!this.state.dragging
        };

        let addItemButton = [];
        if (this.props.showDashboardEditor && this.props.dashboard.editable) {
            if (!this.state.addItemShown) {
                if (!this.state.dragging) {
                    addItemButton = (
                        <button className="dashboard-addItem-btn" onClick={this.handleAddItemClick}>
                            <i className="fa fa-angle-down icon-circle"/>
                        </button>
                    );

                    let addItemButton2 = (
                        <Dropdown id="editDashboardButton" pullRight className="dashboard-addItem-btn">
                            <Dropdown.Toggle>
                                <i className="fa fa-angle-down icon-circle"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <MenuItem onSelect={this.handleAddItemClick}>Add a new item</MenuItem>
                                <MenuItem divider/>
                                <MenuItem onSelect={this.handleResetLayoutClick}>Layout reset</MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>);
                }
            } else {
                addItemButton = (<button className="dashboard-close-btn" onClick={this.handleCloseClick}>
                    <i className="fa fa-angle-up icon-circle"/>
                </button>);
            }
        }

        var cl = {
            'dashboard': true,
        }

        if (this.props.route && this.props.route.className) {
            dashboardClasses[this.props.route.className] = true;
        }

        return (
            <form className={classNames(dashboardClasses)}>
                <ColorScheme skinClass={this.props.skinClass}/>
                <ParameterBox parameters={this.props.dashboard.parameters}
                              onChange={this.onParameterChange.bind(this)}
                              onSubmit={() => this.submitParameters()}
                              onReset={this.resetParameters.bind(this)}
                />
                <DashboardAddItem show={this.state.addItemShown} dashboardContainer={this} ref="addItem"
                                  dragging={this.state.dragging} onReset={this.handleResetLayoutClick}/>
                {/* <Trash show={this.state.dragging || true} dashboardContainer={this}/> */}

                <DroppableGrid layout={this.state.dragLayout || this.state.layout} dashboardContainer={this}
                               enableDrag={this.state.addItemShown}
                               connectDropTarget={this.props.connectDropTarget}
                               enableDragAnimation={this.state.enableDragAnimation}/>
                {addItemButton}
            </form>
        );
    }
}

function mapStateToProps(state, props) {
    let dashboardId = props.resources || props.params.config || DEFAULT_DASHBOARD_ID;
    const dashboard = state.dashboardsReducer.dashboards[dashboardId] || {};
    const dashboardEditor = state.dashboardsReducer.dashboards[DASHBOARD_EDITOR_ID];
    return {
        dashboard,
        dashboardEditor,
        skinClass: state.authentication.skinClass, //just for reload after change, soons use by ColorScheme
        showDashboardEditor: state.authentication.options.showDashboardEditor && props.showDashboardEditor !== false//just for reload after change, soons use by ColorScheme
    }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(Dashboard));