(function () {
    var back = "http://back.cassiopae.com/CassiopaeBOWSL1";
    var front = "https://front.cassiopae.com/FrontV4FOINNO1";

    var apis = {

        master: {
            hostname: front,
            api:  front +"/RestServices",
            reCaptchaSiteKey: "6LfGcAwUAAAAAP-F-oIoN_yf2SjjcZTkSpT6VJwH",
            reCaptchaSecretKey: "6LfGcAwUAAAAAM_d9lzVdXXifH3bm9_2kCFNNnxn",
            //refTableApi: "/referencetable", //no mandatory
            //loginApi: "/login" //no mandatory
        },

        ksiopBack: {
           hostname: back,
           api:  back +"/RestServices",
        }
    }


    window.cassioPosConfig = {
        hostname: front,
        apis,
        masterApi : 'master' //api which manage session and userconfiguration
    };

})();

