import TemplateExtra from '../components/TemplateExtra'

// Same trick as app/loading.tsx: the chunk is part of the template boundary's
// entryJSFiles, but the client reference itself is not serialized.
const SHOW_EXTRA = process.env.SHOW_EXTRA === '1'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {SHOW_EXTRA ? <TemplateExtra /> : null}
      {children}
    </div>
  )
}
