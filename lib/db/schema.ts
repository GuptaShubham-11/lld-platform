import { defineRelations } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

export const users = p.pgTable('users', {
  id: p.uuid().defaultRandom().primaryKey(),
  name: p.varchar({ length: 255 }).notNull(),
  password: p.varchar({ length: 255 }).notNull(),
});

export const problems = p.pgTable('problems', {
  id: p.uuid().defaultRandom().primaryKey(),
  title: p.varchar({ length: 255 }).notNull(),
  description: p.text().notNull(),
  difficulty: p.varchar({ length: 50 }).notNull(),
});

export const practiceSessions = p.pgTable(
  'practice_sessions',
  {
    id: p.uuid().defaultRandom().primaryKey(),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    problemId: p
      .uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
  },
  (t) => [
    p.index('practice_sessions_user_id_idx').on(t.userId),
    p.index('practice_sessions_problem_id_idx').on(t.problemId),
  ]
);

export const answers = p.pgTable(
  'answers',
  {
    id: p.uuid().defaultRandom().primaryKey(),
    sessionId: p
      .uuid('session_id')
      .notNull()
      .references(() => practiceSessions.id, { onDelete: 'cascade' }),
    userId: p
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    problemId: p
      .uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    skeletonCode: p.text('skeleton_code').notNull(),
    tradeOffRationale: p.text('trade_off_rationale'),
    submissionHash: p.varchar('submission_hash', { length: 64 }).notNull(),
    attemptStatus: p.varchar('attempt_status', { length: 50 }).notNull(),
    durationSec: p.integer('duration_sec'),
    version: p.integer().default(1).notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    p.index('answers_session_id_idx').on(t.sessionId),
    p.index('answers_user_id_idx').on(t.userId),
    p.index('answers_problem_id_idx').on(t.problemId),
  ]
);

export const feedbacks = p.pgTable(
  'feedbacks',
  {
    id: p.uuid().defaultRandom().primaryKey(),
    answerId: p
      .uuid('answer_id')
      .notNull()
      .unique() // 1-to-1 relation with answers
      .references(() => answers.id, { onDelete: 'cascade' }),
    overallScore: p.integer('overall_score').notNull(),
    rubricFeedback: p.json('rubric_feedback').notNull(),
    evaluationStrategy: p.varchar('evaluation_strategy', { length: 100 }).notNull(),
    createdAt: p.timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [p.index('feedbacks_answer_id_idx').on(t.answerId)]
);

// 2. RELATIONS DEFINITION

export const relations = defineRelations(
  { users, problems, practiceSessions, answers, feedbacks },
  (r) => ({
    // Users Relations
    users: {
      practiceSessions: r.many.practiceSessions({
        from: r.users.id,
        to: r.practiceSessions.userId,
      }),
      answers: r.many.answers({
        from: r.users.id,
        to: r.answers.userId,
      }),
    },

    // Problems Relations
    problems: {
      practiceSessions: r.many.practiceSessions({
        from: r.problems.id,
        to: r.practiceSessions.problemId,
      }),
      answers: r.many.answers({
        from: r.problems.id,
        to: r.answers.problemId,
      }),
    },

    // Practice Sessions Relations
    practiceSessions: {
      user: r.one.users({
        from: r.practiceSessions.userId,
        to: r.users.id,
      }),
      problem: r.one.problems({
        from: r.practiceSessions.problemId,
        to: r.problems.id,
      }),
      answers: r.many.answers({
        from: r.practiceSessions.id,
        to: r.answers.sessionId,
      }),
    },

    // Answers Relations
    answers: {
      session: r.one.practiceSessions({
        from: r.answers.sessionId,
        to: r.practiceSessions.id,
      }),
      user: r.one.users({
        from: r.answers.userId,
        to: r.users.id,
      }),
      problem: r.one.problems({
        from: r.answers.problemId,
        to: r.problems.id,
      }),
      feedback: r.one.feedbacks({
        from: r.answers.id,
        to: r.feedbacks.answerId,
      }),
    },

    // Feedbacks Relations (1-to-1)
    feedbacks: {
      answer: r.one.answers({
        from: r.feedbacks.answerId,
        to: r.answers.id,
      }),
    },
  })
);
