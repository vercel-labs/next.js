import tar from '@napi-rs/tar'

export function register() {
  console.log('instrumentation register, tar.Entry =', tar.Entry)
}
