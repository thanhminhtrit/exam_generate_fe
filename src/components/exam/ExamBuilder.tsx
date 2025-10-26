import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  getSubjects,
  getGrades,
  getLessons,
  getObjectives,
  getLevels,
  getQuestionTypes,
} from '@/services/mockData';
import type { Subject, Grade, Lesson, Objective, Level, QuestionType } from '@/types';
import { toast } from 'sonner';

interface ExamBuilderProps {
  onClose: () => void;
}

interface MatrixItem {
  id: string;
  objectiveName: string;
  level: string;
  questionType: string;
  quantity: number;
}

export function ExamBuilder({ onClose }: ExamBuilderProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedObjective, setSelectedObjective] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [quantity, setQuantity] = useState('1');

  const [matrix, setMatrix] = useState<MatrixItem[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const [subjectsData, gradesData, levelsData, questionTypesData] = await Promise.all([
        getSubjects(),
        getGrades(),
        getLevels(),
        getQuestionTypes(),
      ]);
      setSubjects(subjectsData);
      setGrades(gradesData);
      setLevels(levelsData);
      setQuestionTypes(questionTypesData);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedGrade) {
      getLessons(selectedSubject, selectedGrade).then(setLessons);
    }
  }, [selectedSubject, selectedGrade]);

  useEffect(() => {
    if (selectedLesson) {
      getObjectives(selectedLesson).then(setObjectives);
    }
  }, [selectedLesson]);

  const handleAddToMatrix = () => {
    if (!selectedObjective || !selectedLevel || !selectedQuestionType || !quantity) {
      toast.error('Please fill all fields');
      return;
    }

    const objective = objectives.find(o => o.id === selectedObjective);
    const level = levels.find(l => l.id === selectedLevel);
    const questionType = questionTypes.find(qt => qt.id === selectedQuestionType);

    if (!objective || !level || !questionType) return;

    const newItem: MatrixItem = {
      id: Math.random().toString(36).substr(2, 9),
      objectiveName: objective.name,
      level: level.code,
      questionType: questionType.code,
      quantity: parseInt(quantity),
    };

    setMatrix([...matrix, newItem]);
    toast.success('Added to matrix');
    
    // Reset selection
    setSelectedObjective('');
    setSelectedLevel('');
    setSelectedQuestionType('');
    setQuantity('1');
  };

  const handleRemoveFromMatrix = (id: string) => {
    setMatrix(matrix.filter(item => item.id !== id));
  };

  const getLevelStats = () => {
    const stats = { NB: 0, TH: 0, VD: 0 };
    matrix.forEach(item => {
      stats[item.level as keyof typeof stats] += item.quantity;
    });
    return stats;
  };

  const levelStats = getLevelStats();
  const totalQuestions = matrix.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Exam Builder</h1>
          <p className="text-muted-foreground">Create a new exam specification</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Structure Builder */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Structure Builder</CardTitle>
            <CardDescription>Select curriculum elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lesson</Label>
              <Select 
                value={selectedLesson} 
                onValueChange={setSelectedLesson}
                disabled={!selectedSubject || !selectedGrade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objective</Label>
              <Select 
                value={selectedObjective} 
                onValueChange={setSelectedObjective}
                disabled={!selectedLesson}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map(objective => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleAddToMatrix} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add to Matrix
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-heading">Matrix Preview</CardTitle>
              <CardDescription>
                {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} planned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-sm">
                  NB: {levelStats.NB}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  TH: {levelStats.TH}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  VD: {levelStats.VD}
                </Badge>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {matrix.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No items added yet
                  </p>
                ) : (
                  matrix.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.objectiveName}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.level}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.questionType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            ×{item.quantity}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromMatrix(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1 gap-2" disabled={matrix.length === 0}>
              <Eye className="h-4 w-4" />
              Generate Spec
            </Button>
            <Button variant="outline" className="flex-1" disabled={matrix.length === 0}>
              Export
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
