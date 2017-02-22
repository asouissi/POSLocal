'use strict'

import React, {Component} from 'react';
import {DropTarget, DragSource, DragDropContext} from 'react-dnd';
import classNames from 'classnames';
import Immutable from 'seamless-immutable';

import DragDropEngine from './DragDropEngine';


import {
    beginDashboardDrag, endDashboardDrag, updateDashboardLayout
} from '../dashboardReducer'

const dragConfig = {

    canDrag(props) {
        return props.enableDrag;
    },

    beginDrag(props, monitor, component) {
//        console.log("Begin drag=", props);
        let dashboardContainer = props.dashboardContainer;

        let newState = {
            dragLayout: dashboardContainer.state.layout || [],
            enableDragAnimation: true,
//            previousTargetKey: null,
            dragging: true,
            previousDraggedCol: null
        };

        if (props.closeAddItem) {
//            newState.addItemShown=false;
        }

        // console.log("BeginDrag: dragLayout=", newState.dragLayout);

        dashboardContainer.setState(newState);

        return {cellKey: props.cellKey, cellLayoutClass: props.layoutClass};
    },

    endDrag(props, monitor, component) {
        let dashboardContainer = props.dashboardContainer;

        dashboardContainer.props.dispatch(endDashboardDrag(dashboardContainer.props.dashboard.id, props.cellKey));

        if (dashboardContainer.state.dragLayout) {
            // console.log("EndDrag: updateLayout=", dashboardContainer.state.dragLayout);

            let newLayoutDescription = dashboardContainer.state.dragLayout.map((l) => l.props.layout);
            dashboardContainer.props.dispatch(updateDashboardLayout(dashboardContainer.props.dashboard.id,
                newLayoutDescription,
                dashboardContainer.props.dashboard.parameters,
                true,
                dashboardContainer.props.showDashboardEditor));

            dashboardContainer.setState({dragLayout: null, dragAnimation: false, dragging: undefined});
        }
    }
}

function dragCollect(collect, monitor) {
    return {
        connectDragSource: collect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class _DraggableCol extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.cellLayout !== this.props.cellLayout) {
            return true;
        }
        if (nextProps.isDragging !== this.props.isDragging) {
            return true;
        }

        return false;
    }

    render() {
        const {isDragging, connectDragSource} = this.props;
        let props = this.props;

        let cl = {
            'dashboard-col': true,
            'col-dragging': isDragging
        };
        let hasXSClass = false;
        if (props.className) {
            props.className.split(' ').forEach((cn) => {
                cl[cn] = true;
                if (/^col-xs-1?[0-9]$/.test(cn))
                    hasXSClass = true;
            });
        }
        if (!hasXSClass)
            cl["col-xs-12"] = true;

        var r = (<div className={classNames(cl)} data-cellKey={props.cellKey}>{props.children}</div>);

        return connectDragSource(r);
    }
}

export default DragSource(DragDropEngine.ItemTypes.SIZE_3, dragConfig, dragCollect)(_DraggableCol);
