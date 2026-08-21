const { useRouter } = require('next/router')
exports.Wrapper = function Wrapper({ children }) {
  const router = useRouter()
  return children
}
