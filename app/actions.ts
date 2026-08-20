'use server'

function something(v: any): () => Promise<any> & { __errorType?: Error } {
  return {} as any
}

export const actionL = something(async () => {})

function somethingLike(v: any): () => PromiseLike<any> {
  return {} as any
}

export const actionM = somethingLike(async () => {})

export const actionOk = async () => {}
