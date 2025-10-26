import { motion } from 'framer-motion'
import { FileText, Download, Printer, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useExams } from '@/hooks/useExams'

export default function Exams() {
  const { data: exams, isLoading, isError } = useExams()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">My Exams</h1>
        <p className="text-muted-foreground">
          View and manage your created exams
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Loading...
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-16 text-center text-red-500">
            Failed to load exams
          </CardContent>
        </Card>
      ) : !exams || exams.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">
              No exams yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first exam
            </p>
            <Button>Create Exam</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => {
            const created = exam.createdAt ? new Date(exam.createdAt) : null
            const questionCount =
              exam.exportedMeta?.questionCount ?? exam.questions?.length ?? 0
            const duration = exam.header?.duration ?? 0

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="shadow-card hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">Generated</Badge>
                    </div>
                    <CardTitle className="font-heading mt-4">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {created ? created.toLocaleString() : '-'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-medium">{questionCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{duration} min</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Print">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
