(function () {
    window.cassioPosConfig.localeCorrespondances = [
        {
            "localeToChange": "en_GB",
            "baseFrom": "en_US",
            "useOverride": true
        },
        {
            "localeToChange": "en_IE",
            "baseFrom": "en_US",
            "useOverride": false
        },
        /*
         Will be triggerdd when the locale is en_GB
         Will load the en_US.json, then the file en_US-override.json, and finally en_GB.json ( if enabled )
         */
    ]
})();