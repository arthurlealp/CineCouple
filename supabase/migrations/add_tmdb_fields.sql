-- Add TMDB enrichment columns to movies table
ALTER TABLE movies
ADD COLUMN IF NOT EXISTS poster_path TEXT,
ADD COLUMN IF NOT EXISTS backdrop_path TEXT,
ADD COLUMN IF NOT EXISTS overview TEXT,
ADD COLUMN IF NOT EXISTS tmdb_id INTEGER,
ADD COLUMN IF NOT EXISTS tmdb_rating DECIMAL(3, 1),
ADD COLUMN IF NOT EXISTS release_year INTEGER,
ADD COLUMN IF NOT EXISTS genres TEXT [],
ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMP
WITH
    TIME ZONE;

-- Add index on tmdb_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies (tmdb_id);

-- Add comment
COMMENT ON COLUMN movies.poster_path IS 'TMDB poster image path (append to https://image.tmdb.org/t/p/)';

COMMENT ON COLUMN movies.backdrop_path IS 'TMDB backdrop image path';

COMMENT ON COLUMN movies.overview IS 'Movie/series description from TMDB';

COMMENT ON COLUMN movies.tmdb_id IS 'The Movie Database ID';

COMMENT ON COLUMN movies.tmdb_rating IS 'Average user rating from TMDB (0-10)';

COMMENT ON COLUMN movies.enriched_at IS 'When TMDB data was last fetched';