/** @type {import('next').NextConfig} */
module.exports = {
  rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/echo',
          has: [{ type: 'host', value: '(?<matchedHost>.+)' }],
          destination: '/api/echo?matchedHost=:matchedHost',
        },
      ],
    }
  },
}
