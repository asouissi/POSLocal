'use strict'
import React, {Component} from 'react'
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {connect} from "react-redux";

class SkinDiv extends Component {
    render() {
        return <div className={this.props.skinClass}>{this.props.children}</div>;
    }
}
SkinDiv = connect(
    state => ({
        skinClass: state.authentication.skinClass
    })
)
(SkinDiv);


export default class ModalC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {showModal: false};
    }

    toggle() {
        this.setState({showModal: !this.state.showModal});
    }

    close() {
        this.setState({showModal: false});
    }

    handleCloseEvent = (event) => {
        this.setState({showModal: false});
        this.props.onClose && this.props.onClose(event);
    };

    handleSaveEvent = (event) => {
        this.props.onSave(event);
    };

    handleResetEvent = (event) => {
        this.props.onReset(event);
    };

    render() {
        let props = this.props;

        var buttons = [];

        if (this.props.specificButtons) {
            buttons = buttons.concat(this.props.specificButtons)
        }

        if (this.props.onReset) {
            let resetLabel = this.props.resetLabel ||
                <FormattedMessage id="core.modal.btn.reset" defaultMessage="Reset values"/>;
            buttons.push((
                <button key="resetButton" className="btn btn-danger" type="button"
                        disabled={this.props.resetDisabled}
                        onClick={this.handleResetEvent}> {resetLabel}
                </button>
            ));
        }

        if (this.props.onSave) {
            let saveLabel = this.props.saveLabel ||
                <FormattedMessage id="core.modal.btn.save" defaultMessage="Save values"/>;

            buttons.push((
                <button key="saveButton" className="btn btn-success" type="button"
                        disabled={this.props.saveDisabled}
                        onClick={this.handleSaveEvent}> {saveLabel}
                </button>
            ));
        }

        if (!buttons.length || this.props.onClose) {
            buttons.push(
                <Button key="closeButton"
                        disabled={this.props.closeDisabled}
                        onClick={this.handleCloseEvent}>
                    <FormattedMessage id="core.modal.btn.close" defaultMessage="Close"/>
                </Button>
            );
        }

        return (
            <Modal show={this.state.showModal} ref="modal" className={this.props.className}
                   onHide={this.handleCloseEvent} bsSize="lg">
                <SkinDiv>
                    <form className="ksiop-modal-form">
                        <Modal.Header closeButton={true}>
                            <Modal.Title>{props.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {props.children}
                        </Modal.Body>
                        <Modal.Footer>
                            {buttons}
                        </Modal.Footer>
                    </form>
                </SkinDiv>
            </Modal>);
    }

}
