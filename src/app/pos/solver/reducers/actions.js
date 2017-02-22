export const GET_QUOTES_LOADING = 'solver/QUOTES/LOADING';
export const GET_QUOTES_SUCCESS = 'solver/QUOTES/SUCCESS';
export const GET_QUOTES_PROGRESS = 'solver/QUOTES/PROGRESS';
export const GET_QUOTES_FAIL = 'solver/QUOTES/FAIL';

export const CLEAR_QUOTES = 'solver/CLEAR_QUOTES';

export const STATIC_QUOTES_URL = '/staticquotes';
//const STATIC_QUOTES_URL = '%ROOT/data/staticquote.json';

export function getQuotes(quoteParams) {
    return {
        types: [GET_QUOTES_LOADING, GET_QUOTES_SUCCESS, GET_QUOTES_FAIL],
        promise: (client, dispatch) => {
            return client.get(STATIC_QUOTES_URL, {
                params: {
                    sqterm: quoteParams.paymentPeriod,
                    sqmileage: quoteParams.annualMileage,
                    sqdeposit: quoteParams.deposit,
                    sqmonthlymin: quoteParams.monthlyBudgetMin,
                    sqmonthlymax: quoteParams.monthlyBudgetMax
                },
                progress: (event) => {
                    dispatch({
                        type: GET_QUOTES_PROGRESS,
                        progress: event
                    });
                }
            });
        }
    }
}

export function clearQuotes() {
    return {
        type: CLEAR_QUOTES
    };
}
