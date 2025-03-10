import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, Users } from "lucide-react"
import { Draft } from "@/types/draft"
import { motion } from "framer-motion"

interface DraftsDisplayProps {
  drafts: Draft[]
  onCopy: (content: string) => void
  onDelete?: (id: string) => void
  loading?: boolean
}

export function DraftsDisplay({ drafts, onCopy, onDelete, loading = false }: DraftsDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
        <p className="text-muted-foreground">Loading drafts...</p>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-medium mb-2">No drafts yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Create some tweets and save them to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 animate-fade-in">
      {drafts.map((draft, index) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="relative border-border hover:border-accent/50 transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-2 text-sm text-muted-foreground flex justify-between items-center">
                <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                {draft.persona && (
                  <div className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    <Users className="h-3 w-3" />
                    <span>{draft.persona}</span>
                  </div>
                )}
              </div>
              <div className="text-sm mb-4">{draft.content}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tone: {draft.tone}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-accent hover:animate-scale-up"
                    onClick={() => onCopy(draft.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:animate-scale-up"
                      onClick={() => onDelete(draft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 