// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  // wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000)) 

  res.status(200).json({ name: 'John Doe' })
}
