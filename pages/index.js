import { motion } from 'framer-motion'
import { format } from 'date-fns'
export default function Home() {
  return <motion.div>hello {format(new Date(0), 'yyyy')}</motion.div>
}
