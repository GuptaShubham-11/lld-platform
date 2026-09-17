CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"skeleton_code" text NOT NULL,
	"trade_off_rationale" text,
	"submission_hash" varchar(64) NOT NULL,
	"attempt_status" varchar(50) NOT NULL,
	"duration_sec" integer,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"answer_id" uuid NOT NULL UNIQUE,
	"overall_score" integer NOT NULL,
	"rubric_feedback" json NOT NULL,
	"evaluation_strategy" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"status" varchar(50) NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"difficulty" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "answers_session_id_idx" ON "answers" ("session_id");--> statement-breakpoint
CREATE INDEX "answers_user_id_idx" ON "answers" ("user_id");--> statement-breakpoint
CREATE INDEX "answers_problem_id_idx" ON "answers" ("problem_id");--> statement-breakpoint
CREATE INDEX "feedbacks_answer_id_idx" ON "feedbacks" ("answer_id");--> statement-breakpoint
CREATE INDEX "practice_sessions_user_id_idx" ON "practice_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "practice_sessions_problem_id_idx" ON "practice_sessions" ("problem_id");--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_session_id_practice_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "practice_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_problem_id_problems_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_answer_id_answers_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_problem_id_problems_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE;