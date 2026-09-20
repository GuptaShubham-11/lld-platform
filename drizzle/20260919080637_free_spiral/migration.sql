CREATE TYPE "evaluation_status" AS ENUM('pending', 'evaluating', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "evaluation_status" "evaluation_status" DEFAULT 'pending'::"evaluation_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "evaluation_failure_reason" text;--> statement-breakpoint
ALTER TABLE "practice_sessions" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "practice_sessions" DROP COLUMN "started_at";--> statement-breakpoint
ALTER TABLE "practice_sessions" DROP COLUMN "ended_at";--> statement-breakpoint
CREATE UNIQUE INDEX "answers_session_hash_idx" ON "answers" ("session_id","submission_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "answers_session_version_idx" ON "answers" ("session_id","version");