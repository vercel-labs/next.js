/** @type {import('next').NextConfig} */
module.exports = {
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
}
