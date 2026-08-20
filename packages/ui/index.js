const dayjs = require("dayjs");
module.exports.hello = () => "hello from ui at " + dayjs(0).toISOString();
