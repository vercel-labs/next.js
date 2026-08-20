import isStringNullable from "./utils";

const config = {
  serverUrl: !isStringNullable(process.env.REACT_APP_API_PATH)
    ? process.env.REACT_APP_API_PATH
    : "http://localhost:3000",
  env: process.env.NODE_ENV,
  publicUrl: process.env.PUBLIC_URL,
};

export default config;
