import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  ClipboardList,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Subjects',
    value: '12',
    icon: BookOpen,
    trend: '+2 this month',
    color: 'text-blue-500',
  },
  {
    title: 'Teachers',
    value: '28',
    icon: Users,
    trend: '+5 this month',
    color: 'text-green-500',
  },
  {
    title: 'Questions',
    value: '1,247',
    icon: MessageSquare,
    trend: '+134 this week',
    color: 'text-purple-500',
  },
  {
    title: 'Exams Created',
    value: '89',
    icon: ClipboardList,
    trend: '+12 this month',
    color: 'text-orange-500',
  },
];

const recentActivity = [
  { action: 'New exam created', entity: 'Grade 7 Math Midterm', time: '2 mins ago' },
  { action: 'Question added', entity: 'Algebra Basics', time: '1 hour ago' },
  { action: 'Matrix updated', entity: 'Midterm Math Exam', time: '3 hours ago' },
  { action: 'New teacher registered', entity: 'John Smith', time: '5 hours ago' },
  { action: 'Subject created', entity: 'Advanced Physics', time: '1 day ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage your educational platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.entity}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Create Subject</p>
                <p className="text-xs text-muted-foreground">Add a new subject to the system</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Add Question</p>
                <p className="text-xs text-muted-foreground">Create a new question</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <ClipboardList className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Generate Exam</p>
                <p className="text-xs text-muted-foreground">Create a new exam from matrix</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
