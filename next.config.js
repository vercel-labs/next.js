/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    // wide allowlists so the load script can request many distinct variants
    deviceSizes: [480, 484, 488, 492, 496, 500, 504, 508, 512, 516, 520, 524, 528, 532, 536, 540, 544, 548, 552, 556, 560, 640, 828, 1920],
    qualities: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    minimumCacheTTL: 60,
  },
}
