// Database entity types matching your schema

import { UUID } from "crypto";

export interface Subject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  subject_id: string;
  grade_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Objective {
  id: string;
  lesson_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Level {
  id: string;
  code: 'NB' | 'TH' | 'VD';
  name: string;
  description?: string;
}

export interface QuestionType {
  id: string;
  code: 'MCQ' | 'TF' | 'SHORT' | 'ESSAY';
  name: string;
  description?: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  objective_id: string;
  level_id: string;
  question_type_id: string;
  text: string;
  explanation?: string;
  metadata?: Record<string, any>;
  created_at: string;
  created_by: string;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface ExamMatrix {
  id: string;
  teacher_id: string;
  subject_id: string;
  grade_id: string;
  title: string;
  notes?: string;
  created_at: string;
}

export interface MatrixLesson {
  id: string;
  exam_matrix_id: string;
  lesson_id: string;
}

export interface MatrixObjective {
  id: string;
  matrix_lesson_id: string;
  objective_id: string;
  level_id: string;
  question_type_id: string;
  quantity: number;
}

export interface ExamSpec {
  id: string;
  exam_matrix_id: string;
  version: number;
  notes?: string;
  created_at: string;
}

export interface Exam {
  id: string;
  exam_spec_id: string;
  title: string;
  created_at: string;
  created_by: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  order: number;
  points: number;
}

export type ID = string | UUID

export interface Teacher {
  id: ID
  user_id: ID
  first_name: string
  last_name: string
  email: string
  created_at: string
}

export interface AppUser {
  id: string;
  email: string;
  role: 'teacher' | 'admin';
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface SettingEntry {
  id: string;
  setting_id: string;
  key: string;
  value: string;
}
