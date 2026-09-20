ALTER TABLE "feedbacks" ADD COLUMN "key_takeaways" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "progress_delta" text NOT NULL;