/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    // set NEXT_UNOPTIMIZED=1 to compare against the no-optimizer baseline
    unoptimized: process.env.NEXT_UNOPTIMIZED === '1',
  },
}
