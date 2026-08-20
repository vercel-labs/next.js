'use server';

export async function showSearchParams(params: URLSearchParams) {
  return {
    ctor: params?.constructor?.name ?? typeof params,
    isURLSearchParams: params instanceof URLSearchParams,
    toString: String(params),
    json: JSON.stringify(params),
  };
}
