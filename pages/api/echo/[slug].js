export default function handler(req,res){res.status(200).json({ok:true,route:'dynamic',slug:req.query.slug})}
