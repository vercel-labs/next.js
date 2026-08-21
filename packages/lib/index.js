const { headers } = require('next/headers');
module.exports.getHost = async () => (await headers()).get('host');
