import axios from 'axios'

const isAbsoluteURL = url => {
    return /^([a-z]+:)?\/\//i.test(url);
};

const isRoot = url => {
    return
};

const setupAxiosInterceptors = (rootConfig, onUnauthenticated) => {

    const onRequestSuccess = (config) => {
        let rootExp = /^%ROOT\/(.+)$/i.exec(config.url);
        if (rootExp) {
            return {...config, url: rootExp[1]};
        }

        if (isAbsoluteURL(config.url)) {
            return config;
        }

        if (config.requestBack || rootConfig.frontServices || rootConfig.backServices || rootConfig.restServices) {
            const baseURL = config.requestBack
                ? rootConfig.backServices || rootConfig.frontServices || rootConfig.restServices
                : rootConfig.frontServices || rootConfig.restServices || rootConfig.backServices;

            return {...config, url: baseURL + config.url, withCredentials: true};
        }

        let api = rootConfig.apis[(config.api || rootConfig.masterApi)];
        const baseURL = api.api;
        return {...config, url: baseURL + config.url, withCredentials: true};
    };

    const onResponseSuccess = (response) => {
        return Promise.resolve(response)
    };
    const onResponseError = error => {
        if (error.response && error.response.status === 401) {
            //onUnauthenticated();
        }
        return Promise.reject(error);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export {
    setupAxiosInterceptors
};