export const dynamic = 'force-dynamic';

export function GET() {
    const bracketKey = 'NEXT_DEPLOYMENT' + '_ID';
    const g = globalThis as Record<string, unknown>;
    return Response.json({
        inlined_NEXT_DEPLOYMENT_ID: process.env.NEXT_DEPLOYMENT_ID ?? null,
        real_env_NEXT_DEPLOYMENT_ID: process.env[bracketKey] ?? null,
        VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID ?? null,
        globalThis_NEXT_DEPLOYMENT_ID: g.NEXT_DEPLOYMENT_ID ?? null,
        globalThis_NEXT_CLIENT_ASSET_SUFFIX: g.NEXT_CLIENT_ASSET_SUFFIX ?? null,
    });
}
