// Hand-maintained types mirroring the Supabase schema.
// To regenerate automatically instead, run:
//   npx supabase gen types typescript --project-id pwuhsatvagenkuljvypl > lib/types/database.ts

export type UserRole = "student" | "teacher" | "admin" | "enterprise" | "parent";
export type LearningMode =
  | "kids"
  | "educational"
  | "pg_adult"
  | "business"
  | "travel"
  | "exam_prep"
  | "immersion";
export type SkillLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced"
  | "fluent";
export type LessonStatus = "locked" | "not_started" | "in_progress" | "completed";
export type ExerciseType =
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "translation"
  | "fill_blank"
  | "matching"
  | "pronunciation"
  | "quiz";
export type ChatRole = "user" | "assistant" | "system";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  native_language: string;
  target_languages: string[];
  age_group: "child" | "teen" | "adult";
  current_skill_level: SkillLevel;
  learning_goals: string | null;
  preferred_mode: LearningMode;
  theme_preference: "light" | "dark" | "system";
  timezone: string;
  role: UserRole;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  parent_user_id: string | null;
  daily_time_limit_minutes: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  flag_emoji: string | null;
  is_active: boolean;
}

export interface Course {
  id: string;
  language_id: string;
  mode: LearningMode;
  title: string;
  description: string | null;
  level: SkillLevel;
  cover_image_url: string | null;
  is_published: boolean;
  order_index: number;
}

export interface Unit {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  order_index: number;
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  description: string | null;
  lesson_type: string;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
}

export interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  order_index: number;
  prompt: string;
  options: string[];
  correct_answer: string | null;
  explanation: string | null;
  audio_url: string | null;
  image_url: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  score: number;
  attempts: number;
  completed_at: string | null;
}

export interface VocabularyWord {
  id: string;
  language_id: string;
  word: string;
  translation: string;
  part_of_speech: string | null;
  pronunciation_audio_url: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  synonyms: string[];
  antonyms: string[];
  difficulty_level: SkillLevel;
  image_url: string | null;
}

export interface SavedWord {
  id: string;
  user_id: string;
  word_id: string;
  tags: string[];
  notes: string | null;
  is_favorite: boolean;
  times_reviewed: number;
  ease_factor: number;
  review_interval_days: number;
  next_review_at: string;
  vocabulary_words?: VocabularyWord;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  mode_context: LearningMode | null;
  language_context: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  goal_date: string;
  xp_target: number;
  xp_earned: number;
  minutes_target: number;
  minutes_spent: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

// Minimal Database type so the typed Supabase client compiles.
// Expand per-table Row/Insert/Update generics as the schema evolves,
// or swap this file entirely for a generated one (see comment above).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
