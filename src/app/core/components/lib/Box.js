import React from 'react'
import classNames from 'classnames';
import {Panel} from "react-bootstrap"
import Loader from './Loader';

const DEFAULT_EMPTY = [];

export default class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {accessKey, ...props} = this.props;

        if (props.visible === false || props.hidden || (accessKey && accessKey.hidden)) {
            return false;
        }

        var cl = {'box': true};
        if (props.type) {
            cl['box-' + props.type] = true;
        }
        if (props.hideTitle) {
            cl['box-hideTitle'] = true;
        }

        if (props.className) {
            props.className.split(' ').forEach(className => {
                if (!className) {
                    return;
                }

                cl[className] = true;
            });
        }
        if (props.readOnly) {
            cl['read-only'] = true;
        }

        var clHeader = {'box-header': true};
        if (props.withBorder) {
            clHeader['with-border'] = true;
        }

        var body = props.children;
        if (props.error) {
            body = (<span className="fa fa-chain-broken"/>)
        }

        var icon = (props.icon) ? (<i className={"fa fa-" + props.icon}></i>) : [];
        var overlay = props.loading ? (<div key="overlay" className="overlay">
                <Loader/>
            </div>) : [];

        let boxTitleClasses = {
            'box-title': true,
            'truncate': this.props.truncateTitle !== false
        }

        let title = props.title;
        if (this.context.showAccessKeys) {
            title = '"component": "' + this.props.id + '"';
        }

        var header = ((!title || props.hideTitle ) && !this.props.tools && !this.context.showAccessKeys)
            ? DEFAULT_EMPTY
            : (
                <div key="header" className={classNames(clHeader) } style={props.style}>
                    <h3 className={classNames(boxTitleClasses)}>{icon} {title}</h3>
                    {this.props.tools}
                </div>
            );

        return (
            <div className={classNames(cl)} style={props.style}>
                {header}
                <div key="body" className="box-body">
                    {body}
                </div>
                {overlay}
            </div>
        )
    }
}

Box.contextTypes = {
    showAccessKeys: React.PropTypes.bool
};
