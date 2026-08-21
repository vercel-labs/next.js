'use server'

// One registered Server Action so hasServerActions() === true.
export async function noop(formData: FormData): Promise<void> {
  void formData.get('x')
}
