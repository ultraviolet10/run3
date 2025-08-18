-- Add card_number column to waitlist_entries table
ALTER TABLE "waitlist_entries" ADD COLUMN "card_number" integer NOT NULL DEFAULT 1;

-- Update existing entries with sequential card numbers
WITH numbered_entries AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM waitlist_entries
)
UPDATE waitlist_entries 
SET card_number = numbered_entries.rn
FROM numbered_entries 
WHERE waitlist_entries.id = numbered_entries.id;

-- Remove the default value constraint after updating existing data
ALTER TABLE "waitlist_entries" ALTER COLUMN "card_number" DROP DEFAULT;
