import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Target,
  MessageSquare,
  Layers,
  Database,
  FileQuestion,
  FolderKanban,
  FileSpreadsheet,
  ClipboardList,
  Folder,
  Users,
  User,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ],
  },
  {
    title: 'Academics',
    items: [
      { name: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
      { name: 'Grades', icon: GraduationCap, path: '/admin/grades' },
      { name: 'Lessons', icon: FileText, path: '/admin/lessons' },
      { name: 'Objectives', icon: Target, path: '/admin/objectives' },
    ],
  },
  {
    title: 'Question Bank',
    items: [
      { name: 'Questions', icon: MessageSquare, path: '/admin/questions' },
      { name: 'Levels', icon: Layers, path: '/admin/levels' },
      { name: 'Question Types', icon: Database, path: '/admin/question-types' },
    ],
  },
  {
    title: 'Exams',
    items: [
      { name: 'Exam Matrices', icon: FolderKanban, path: '/admin/exam-matrices' },
      { name: 'Exam Specs', icon: FileSpreadsheet, path: '/admin/exam-specs' },
      { name: 'Exams', icon: ClipboardList, path: '/admin/exams' },
    ],
  },
  {
    title: 'Resources & Users',
    items: [
      { name: 'Resources', icon: Folder, path: '/admin/resources' },
      { name: 'Teachers', icon: Users, path: '/admin/teachers' },
      { name: 'App Users', icon: User, path: '/admin/app-users' },
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Admin Portal
        </h1>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-6 p-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              {group !== navGroups[navGroups.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
