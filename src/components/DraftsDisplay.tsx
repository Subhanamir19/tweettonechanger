import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { Draft } from "@/types/draft"

interface DraftsDisplayProps {
  drafts: Draft[]
  onCopy: (content: string) => void
}

export function DraftsDisplay({ drafts, onCopy }: DraftsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {drafts.map((draft) => (
        <Card key={draft.id} className="relative">
          <CardContent className="p-4">
            <div className="mb-2 text-sm text-muted-foreground">
              {new Date(draft.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm mb-4">{draft.content}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tone: {draft.tone}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => onCopy(draft.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 