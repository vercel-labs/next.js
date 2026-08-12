import {
  guardWithFalsyTest,
  guardWithFalsyTestAndThrow,
  guardViaParameter,
  guardWithStrictNull,
} from './lib/tenant'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>
}) {
  const { v } = await searchParams
  const tenant =
    v === 'throw'
      ? await guardWithFalsyTestAndThrow()
      : v === 'parameter'
        ? await guardViaParameter()
        : v === 'strict-null'
          ? await guardWithStrictNull()
          : await guardWithFalsyTest()
  return <p id="tenant">{tenant.name}</p>
}
