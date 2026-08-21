'use server'
import { nanoid } from 'nanoid'
export async function makeId() { return nanoid() }
