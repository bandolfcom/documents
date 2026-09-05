import { parseContentSegments, preprocessCallouts } from '../../lib/markdown'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Tabs } from './Tabs'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const processed = preprocessCallouts(content)
  const segments = parseContentSegments(processed)

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'tabs' && segment.tabs) {
          return <Tabs key={`tabs-${index}`} tabs={segment.tabs} />
        }
        if (segment.content) {
          return <MarkdownRenderer key={`md-${index}`} content={segment.content} />
        }
        return null
      })}
    </>
  )
}
