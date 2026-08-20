use napi_derive::napi;

#[napi]
pub fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
