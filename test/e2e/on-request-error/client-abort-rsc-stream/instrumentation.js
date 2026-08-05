export function onRequestError(error) {
  console.log(
    'ON_REQUEST_ERROR',
    JSON.stringify({ name: error?.name, message: error?.message })
  )
}
