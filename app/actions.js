'use server'

import { revalidateTag } from 'next/cache'
import fs from 'fs'

export async function revalidateUnrelatedTag() {
  // This tag is not used by ANY page in this app.
  fs.appendFileSync('./action-ran.log', 'action ran ' + Date.now() + '\n')
  revalidateTag('totally-unrelated-tag', 'max')
}
