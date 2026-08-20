'use server'
import { redirect } from 'next/navigation'
export async function redirectToRoute() { redirect('/route') }
export async function redirectToPage() { redirect('/page-target') }
