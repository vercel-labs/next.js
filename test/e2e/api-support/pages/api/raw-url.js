export default (req, res) => {
  res.status(200).json({ url: req.url })
}
