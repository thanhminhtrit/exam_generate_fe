import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Database, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamBuilder } from '@/components/exam/ExamBuilder';
import { getExams, getCurrentTeacher } from '@/services/mockData';
import type { Exam, Teacher } from '@/types';


const statCards = [
  { title: 'Total Exams', value: '24', icon: FileText, change: '+12%', trend: 'up' },
  { title: 'Questions', value: '486', icon: Database, change: '+8%', trend: 'up' },
  { title: 'Completion Rate', value: '94%', icon: TrendingUp, change: '+3%', trend: 'up' },
];

export default function DashboardHome() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [examsData, teacherData] = await Promise.all([
        getExams(),
        getCurrentTeacher(),
      ]);
      setRecentExams(examsData);
      setTeacher(teacherData);
    };
    loadData();
  }, []);

  if (showBuilder) {
    return <ExamBuilder onClose={() => setShowBuilder(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome back, {teacher?.first_name || 'Teacher'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your exams today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Quick Actions</CardTitle>
          <CardDescription>Start building your next exam</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowBuilder(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Exam
          </Button>
        </CardContent>
      </Card>

      {/* Recent Exams */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Recent Exams</CardTitle>
          <CardDescription>Your latest exam creations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExams.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No exams yet. Create your first exam to get started!
              </p>
            ) : (
              recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{exam.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(exam.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
