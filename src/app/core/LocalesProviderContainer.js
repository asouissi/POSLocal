import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';
import React from 'react';
import {createSelector} from 'reselect'


const formatsSelector = createSelector(
    state => state.locales.currencyCode || state.authentication.user.currencycode,
    state => state.authentication.user.currencysymbol,
    (currencycode, currencysymbol) => {
        return {
            number: {
                currencyFormat: {
                    style: 'currency',
                    currency: currencycode,
                    currencyDisplay: 'symbol',
                    minimumIntegerDigits: 1
                },
                float: {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            },
            currency: currencycode,
            currencySymbol: currencysymbol
        }
    }
);

const messagesSelector = createSelector(
    state => state.locales.messages,
    state => state.authentication.user.localeOverride,
    (messages, localeOverride) => localeOverride ? messages.merge(localeOverride) : messages
);

const mapStateToProps = (state) => {
    const {lang, key} = state.locales;
    return {
        key: key,
        locale: lang,
        messages: messagesSelector(state),
        formats: formatsSelector(state)
    };
}


class SuperIntlProvider extends IntlProvider {
    shouldComponentUpdate(nextProps) {
        //todo: maybe check if key index of -override.
    }
}

export default connect(mapStateToProps)(IntlProvider);