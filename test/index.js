import style from "../node_modules/mocha/mocha.css"

var context = require.context('.', true, /.+\.spec\.js?$/);
context.keys().forEach(context);
module.exports = context