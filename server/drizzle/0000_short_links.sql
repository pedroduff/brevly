CREATE TABLE IF NOT EXISTS "short_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(32) NOT NULL UNIQUE,
  "original_url" varchar(2048) NOT NULL,
  "access_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
