import React from 'react'
import Box from '../../components/lib/Box.js';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';

class ContactList extends React.Component {

    renderContact(contacts) {
        let items = [];
        contacts.forEach(contact => {
            let item = (
                <div className="contact-item" key={contact.email}>
                    <span className="fa fa-user" />
                    <span className="username" >{contact.name}</span>
                    <span className="info"> <span className="fa fa-envelope-o" /><a href={'mailto:'+contact.email}>{contact.email}</a></span>
                    <span className="info "><span className="fa fa-phone" /> <span>{contact.phone}</span></span>
                    <span className="info "><span className="fa fa-skype" /> <span>{contact.skype}</span></span>
                </div>
            );

            items.push(item);
        });

        return items
    }

    render() {
        const {config, intl} = this.props;
        const contactList = this.renderContact(config.contacts);
        return (
            <Box className="contact-list box-primary"
                 title={intl.formatMessage({id: config.title, defaultMessage: config.title})}>
                {contactList}
            </Box>
        );
    }
}

export default injectIntl(ContactList)
