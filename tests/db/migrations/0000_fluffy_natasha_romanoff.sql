CREATE TABLE IF NOT EXISTS "next_invite_invite_logs" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"inviteId" varchar,
	"email" varchar,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "next_invite_invites" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"expires" bigint,
	"code" varchar NOT NULL,
	"email" varchar,
	"namespace" varchar DEFAULT 'default' NOT NULL,
	"remainingUses" bigint,
	"invalid" boolean DEFAULT false NOT NULL,
	CONSTRAINT "next_invite_invites_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "next_invite_invite_logs" ADD CONSTRAINT "next_invite_invite_logs_inviteId_next_invite_invites_id_fk" FOREIGN KEY ("inviteId") REFERENCES "next_invite_invites"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
