import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getQuestions, getLevels, getQuestionTypes, mockLessons } from '@/services/mockData';
import type { Question, Level, QuestionType } from '@/types';

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      const [questionsData, levelsData, typesData] = await Promise.all([
        getQuestions(),
        getLevels(),
        getQuestionTypes(),
      ]);
      setQuestions(questionsData);
      setLevels(levelsData);
      setQuestionTypes(typesData);
    };
    loadData();
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || q.level_id === selectedLevel;
    const matchesType = selectedType === 'all' || q.question_type_id === selectedType;
    return matchesSearch && matchesLevel && matchesType;
  });

  const getLevelBadge = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    return level?.code || 'N/A';
  };

  const getTypeBadge = (typeId: string) => {
    const type = questionTypes.find(t => t.id === typeId);
    return type?.code || 'N/A';
  };

  const getLessonName = (lessonId: string) => {
    const lesson = mockLessons.find(l => l.id === lessonId);
    return lesson?.name || 'Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Question Bank</h1>
          <p className="text-muted-foreground">Manage your question library</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.code} - {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {questionTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.code} - {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">
            Questions ({filteredQuestions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No questions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map(question => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {question.text}
                      </TableCell>
                      <TableCell>{getLessonName(question.lesson_id)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getLevelBadge(question.level_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTypeBadge(question.question_type_id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(question.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
