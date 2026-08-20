import { submitContactForm } from './actions'
import BindForm from './BindForm'
import ClosureForm from './ClosureForm'

async function getRecipients() {
  // pretend this comes from a DB / secret store at request time
  return ['SUPER_SECRET_EMAIL@example.com']
}

export default async function Page() {
  const recipients = await getRecipients()
  const bound = submitContactForm.bind(null, recipients)

  async function handleSubmit(prevState, formData) {
    'use server'
    return submitContactForm(recipients, prevState, formData)
  }

  return (
    <main>
      <h2>bind()</h2>
      <BindForm action={bound} />
      <h2>closure</h2>
      <ClosureForm action={handleSubmit} />
    </main>
  )
}
