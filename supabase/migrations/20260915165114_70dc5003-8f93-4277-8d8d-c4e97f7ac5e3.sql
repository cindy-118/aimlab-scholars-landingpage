CREATE TABLE public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 8 AND 30),
  role TEXT NOT NULL CHECK (role IN ('parent', 'student')),
  track TEXT NOT NULL CHECK (track IN ('standard', 'independent', 'undecided')),
  needs TEXT CHECK (needs IS NULL OR char_length(needs) <= 1200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.consultation_requests TO anon;
GRANT INSERT ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation request"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 2 AND 120
  AND char_length(phone) BETWEEN 8 AND 30
  AND role IN ('parent', 'student')
  AND track IN ('standard', 'independent', 'undecided')
  AND (needs IS NULL OR char_length(needs) <= 1200)
);