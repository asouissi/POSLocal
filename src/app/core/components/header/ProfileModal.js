import React, {PropTypes} from 'react';
import {Modal, Button, FormGroup, ControlLabel, Row, Col} from 'react-bootstrap';
import {FormattedMessage, defineMessages} from 'react-intl';

import SelectField from '../lib/SelectField'

const messages = defineMessages({
    usLabel: {id: "core.locale.option.us", defaultMessage: 'English (US)'},
    ukLabel: {id: "core.locale.option.uk", defaultMessage: 'English (UK)'},
    ieLabel: {id: "core.locale.option.ie", defaultMessage: 'English (IE)'},
    frLabel: {id: "core.locale.option.fr", defaultMessage: 'French (France)'},
    brLabel: {id: "core.locale.option.br", defaultMessage: 'Portuguese (Brazil)'},
    deLabel: {id: "core.locale.option.de", defaultMessage: 'German (Germany)'},
    itLabel: {id: "core.locale.option.it", defaultMessage: 'Italian (Italy)'},
});

let skins = ["blue", "red", "jade", "cass", "black", "yellow", "purple", "green", "blue-light", "black-light", "red-light", "yellow-light", "purple-light", "oil"];

//adding WS Skins
skins = skins.concat(["white-100_102", "grey-101", "green-103", "white-104_105", "blue-106"]);

//Make the skins list
skins = skins.reduce((skinsList, skinName, key) => {
    skinsList.push({
        "key": key + 1,
        skinClass: "skin-" + skinName,
        "name": skinName.split("-").reduce((name, word) => name + " " + word)
    });
    return skinsList;
}, []);

const SkinItem = (props) => (
    <li className={props.skinClass + " skin-item"} onClick={() => props.onClick(props.skinClass)}>
        <div>
            <div><div className='bg-logo'/><div className='bg-navbar'/></div>
            <div><div className='bg-sidebar' /><div className='bg-content'></div></div>
        </div>
        <p className='text-center no-margin' style={{fontSize: "12px"}}>{props.name}</p>
    </li>
)

export default class ProfileModal extends React.Component {

    render() {
        let {formatMessage} = this.context.intl;
        const locales = [
            {code: 'en-US', label: formatMessage(messages.usLabel)},
            {code: 'en-GB', label: formatMessage(messages.ukLabel)},
            {code: 'en-IE', label: formatMessage(messages.ieLabel)},
            {code: 'fr-FR', label: formatMessage(messages.frLabel)},
            {code: 'pt-BR', label: formatMessage(messages.brLabel)},
            {code: 'de-DE', label: formatMessage(messages.deLabel)},
            {code: 'it-IT', label: formatMessage(messages.itLabel)},
        ];

        let skinItems = skins.map(skin => <SkinItem {...skin} onClick={this.props.onSkinChange}/>);
        let skinSelector = null;
        if (this.props.showSkinSelector) {
            skinSelector = (
                <FormGroup>
                    <ControlLabel>
                        <FormattedMessage id="core.locale.skins.title" defaultMessage="Select a skin"/>
                    </ControlLabel>
                    <ul className="list-unstyled row">
                        {skinItems}
                    </ul>

                </FormGroup>
            )
        }
        return (
            <Modal show={this.props.showModal} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FormattedMessage id="core.profile.modeal.title"
                                          defaultMessage="{name} profile"
                                          values={{name: this.props.username}}/>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <SelectField
                        options={locales}
                        title={<FormattedMessage id="core.locale.select.title" defaultMessage="Select locale"/>}
                        value={this.props.locale}
                        onChange={this.props.onLocaleChange}
                    />

                    {skinSelector}

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.onClose} className="pull-left">
                        <FormattedMessage id="core.local.modal.btn.close" defaultMessage="Close"/>
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

ProfileModal.contextTypes = {
    intl: PropTypes.object.isRequired,
}