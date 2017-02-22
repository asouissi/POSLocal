import React, {Component} from 'react'
import {NativeTypes} from 'react-dnd-html5-backend';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';

const fileTarget = {
    drop(props, monitor) {
        const {onDrop} = props;
        const event = {target: {files: monitor.getItem().files}};
        onDrop(event);
    }
};

// When used, the parent component must be in the DragDropContext and HTML5Backend,
// check the documentation or the components ImportCreditLineDetailContainer or AttachmentsContainer.
class FileDropZone extends Component {
    render() {
        const {connectDropTarget, isOver, canDrop} = this.props;

        var cl1 = {
            fileDropZone: true
        }

        this.props.className && this.props.className.split(" ").forEach(c => {
            cl1[c] = true;
        });

        var cl2 = {
            wait: isOver && !canDrop,
            drag: isOver && canDrop,
            hover: isOver,
        }

        return <div className={classNames(cl1)}>
            {connectDropTarget(<div className={classNames(cl2)}>
                {this.props.children}
            </div>)}
        </div>;
    }
}

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(FileDropZone);