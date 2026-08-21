import type { NextConfig } from 'next'
import { loadEnvConfig } from '@next/env'

const { loadedEnvFiles } = loadEnvConfig(process.cwd())
console.log('REPRO loadedEnvFiles:', loadedEnvFiles)

const nextConfig: NextConfig = {}
export default nextConfig
