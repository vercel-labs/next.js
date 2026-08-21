/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // Keep client Router Cache entries around so we can observe whether
    // revalidateTag() blows them away regardless of the tag.
    staleTimes: { dynamic: 300, static: 300 },
  },
}
