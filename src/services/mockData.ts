import type {
  Subject,
  Grade,
  Lesson,
  Objective,
  Level,
  QuestionType,
  Question,
  QuestionOption,
  ExamMatrix,
  Exam,
  Teacher,
} from '@/types';

// Mock data
export const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', description: 'Math curriculum', created_at: '2024-01-01' },
  { id: '2', name: 'Science', description: 'Science curriculum', created_at: '2024-01-01' },
  { id: '3', name: 'English', description: 'English curriculum', created_at: '2024-01-01' },
];

export const mockGrades: Grade[] = [
  { id: '1', name: 'Grade 7', level: 7, created_at: '2024-01-01' },
  { id: '2', name: 'Grade 8', level: 8, created_at: '2024-01-01' },
  { id: '3', name: 'Grade 9', level: 9, created_at: '2024-01-01' },
];

export const mockLessons: Lesson[] = [
  { id: '1', subject_id: '1', grade_id: '1', name: 'Algebra Basics', description: 'Introduction to algebra', created_at: '2024-01-01' },
  { id: '2', subject_id: '1', grade_id: '1', name: 'Geometry Fundamentals', description: 'Basic geometry concepts', created_at: '2024-01-01' },
  { id: '3', subject_id: '2', grade_id: '1', name: 'Cell Biology', description: 'Study of cells', created_at: '2024-01-01' },
];

export const mockObjectives: Objective[] = [
  { id: '1', lesson_id: '1', name: 'Understand variables', description: 'Learn about variables and constants', created_at: '2024-01-01' },
  { id: '2', lesson_id: '1', name: 'Solve linear equations', description: 'Solve basic linear equations', created_at: '2024-01-01' },
  { id: '3', lesson_id: '2', name: 'Identify shapes', description: 'Recognize basic geometric shapes', created_at: '2024-01-01' },
];

export const mockLevels: Level[] = [
  { id: '1', code: 'NB', name: 'Remember', description: 'Basic recall' },
  { id: '2', code: 'TH', name: 'Understand', description: 'Comprehension' },
  { id: '3', code: 'VD', name: 'Apply', description: 'Application' },
];

export const mockQuestionTypes: QuestionType[] = [
  { id: '1', code: 'MCQ', name: 'Multiple Choice', description: 'Select one correct answer' },
  { id: '2', code: 'TF', name: 'True/False', description: 'Binary choice question' },
  { id: '3', code: 'SHORT', name: 'Short Answer', description: 'Brief written response' },
  { id: '4', code: 'ESSAY', name: 'Essay', description: 'Extended written response' },
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    lesson_id: '1',
    objective_id: '1',
    level_id: '1',
    question_type_id: '1',
    text: 'What is a variable in algebra?',
    explanation: 'A variable is a symbol used to represent an unknown value.',
    metadata: { difficulty: 'easy' },
    created_at: '2024-01-15',
    created_by: 'teacher1',
  },
  {
    id: '2',
    lesson_id: '1',
    objective_id: '2',
    level_id: '2',
    question_type_id: '1',
    text: 'Solve for x: 2x + 5 = 13',
    explanation: 'x = 4',
    metadata: { difficulty: 'medium' },
    created_at: '2024-01-15',
    created_by: 'teacher1',
  },
];

export const mockQuestionOptions: QuestionOption[] = [
  { id: '1', question_id: '1', text: 'A letter representing an unknown', is_correct: true, order: 1 },
  { id: '2', question_id: '1', text: 'A number', is_correct: false, order: 2 },
  { id: '3', question_id: '1', text: 'An equation', is_correct: false, order: 3 },
  { id: '4', question_id: '2', text: '4', is_correct: true, order: 1 },
  { id: '5', question_id: '2', text: '3', is_correct: false, order: 2 },
  { id: '6', question_id: '2', text: '5', is_correct: false, order: 3 },
];

export const mockExamMatrices: ExamMatrix[] = [
  {
    id: '1',
    teacher_id: 'teacher1',
    subject_id: '1',
    grade_id: '1',
    title: 'Midterm Math Exam',
    notes: 'Covers chapters 1-5',
    created_at: '2024-01-20',
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    exam_spec_id: 'spec1',
    title: 'Grade 7 Math Midterm',
    created_at: '2024-02-01',
    created_by: 'teacher1',
  },
  {
    id: '2',
    exam_spec_id: 'spec2',
    title: 'Grade 7 Science Quiz',
    created_at: '2024-02-05',
    created_by: 'teacher1',
  },
];

export const mockCurrentTeacher: Teacher = {
  id: 'teacher1',
  user_id: 'user1',
  first_name: 'Sarah',
  last_name: 'Johnson',
  email: 'sarah.johnson@school.edu',
  created_at: '2024-01-01',
};

// Mock service functions
export const getSubjects = async (): Promise<Subject[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSubjects;
};

export const getGrades = async (): Promise<Grade[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockGrades;
};

export const getLessons = async (subjectId?: string, gradeId?: string): Promise<Lesson[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let filtered = mockLessons;
  if (subjectId) filtered = filtered.filter(l => l.subject_id === subjectId);
  if (gradeId) filtered = filtered.filter(l => l.grade_id === gradeId);
  return filtered;
};

export const getObjectives = async (lessonId?: string): Promise<Objective[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (lessonId) return mockObjectives.filter(o => o.lesson_id === lessonId);
  return mockObjectives;
};

export const getLevels = async (): Promise<Level[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLevels;
};

export const getQuestionTypes = async (): Promise<QuestionType[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockQuestionTypes;
};

export const getQuestions = async (): Promise<Question[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockQuestions;
};

export const getExamMatrices = async (): Promise<ExamMatrix[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockExamMatrices;
};

export const getExams = async (): Promise<Exam[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockExams;
};

export const getCurrentTeacher = async (): Promise<Teacher> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCurrentTeacher;
};
