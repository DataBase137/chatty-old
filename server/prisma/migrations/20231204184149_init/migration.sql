-- CreateTable
CREATE TABLE "chatlogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),

    CONSTRAINT "chat logs_pkey" PRIMARY KEY ("id")
);
