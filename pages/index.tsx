// Minimal reproduction for vercel/next.js#97685
// A local variable initialized from a *non-static* expression (member expression
// or call) that is used as a JSX element name, combined with a dynamic `${}`
// interpolation inside `<style jsx>`, sends the next-swc styled-jsx transform
// into an infinite loop: compilation never finishes and never errors.
const Probe = (props: { theme: { color: string; icon: any } }) => {
  const t = props.theme
  const Icon = t.icon // <- derived from a member expression
  return (
    <div className="probe">
      <Icon />
      <style jsx>{`
        .probe {
          color: ${t.color}; /* <- dynamic interpolation */
        }
      `}</style>
    </div>
  )
}

export default function Home() {
  return <Probe theme={{ color: '#f00', icon: 'div' }} />
}
