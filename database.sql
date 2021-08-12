CREATE TABLE readers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(200),
    user_password VARCHAR(20),
    chapters_read INTEGER,
    books_read INTEGER,
    verses_memorized INTEGER,
    reading_challenges VARCHAR(200)[]
)

ALTER TABLE readers
ADD COLUMN reading_challenges VARCHAR(200)[]

INSERT INTO readers (
    first_name, 
    last_name, 
    email, 
    user_password, 
    chapters_read, 
    books_read, 
    verses_memorized, 
    reading_challenges) 

VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

DROP TABLE if exists reading_challenges;

CREATE TABLE reading_challenges (
    id SERIAL PRIMARY KEY,
    challenge_name VARCHAR(200),
    organization VARCHAR(200),
    challenge VARCHAR(50),
    goal VARCHAR(100),
    challenge_admin INTEGER,
    CONSTRAINT fk_customer
      FOREIGN KEY(challenge_admin) 
	  REFERENCES readers(id)
)

INSERT INTO reading_challenges(
challenge_name,
organization,
challenge,
goal,
challenge_admin)

VALUES ('First Test Challenge', 'admin', 'chapters', 10000, 1)

ALTER TABLE reading_challenges DROP COLUMN id;

ALTER TABLE reading_challenges ADD COLUMN id uuid PRIMARY KEY DEFAULT uuid_generate_v4();

UPDATE readers SET reading_challenges = challenge_name FROM reading_challenges WHERE 

-- Create join/relational/many-to-many table

CREATE TABLE readers_reading_challenges (
    reader_id uuid REFERENCES readers(id) ON DELETE CASCADE,
    challenge_id uuid  REFERENCES reading_challenges(id) ON DELETE CASCADE,
    role INTEGER,
    PRIMARY KEY (reader_id, challenge_id)
)

INSERT INTO readers_reading_challenges (reader_id, challenge_id, role)
VALUES ('98df0f44-2d5e-43fd-b503-65b84e99638f', 'da7a357f-8acc-4482-94c2-5989d1a9e7fb', 0)

INSERT INTO reading_challenges (challenge_name, organization, challenge, goal)
VALUES ()

SELECT challenge_name FROM reading_challenges ch, readers_reading_challenges rch
WHERE ch.id = rch.challenge_id AND rch.reader_id = '60650ec4-71d4-4437-b564-57f930e84f27';


UPDATE readers SET chapters_read WHERE reader_id = '98df0f44-2d5e-43fd-b503-65b84e99638f';

CREATE TABLE additional_readers (
    ad_reader_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    chapters_read INTEGER,
    books_read INTEGER,
    verses_memorized INTEGER
)

CREATE TABLE readers_additional_readers (
    ad_reader_id uuid REFERENCES additional_readers(ad_reader_id) ON DELETE CASCADE,
    reader_id uuid REFERENCES readers(id) ON DELETE CASCADE,
    PRIMARY KEY (ad_reader_id, reader_id)
)

/*add and subtracting from integer */

UPDATE readers
SET chapters_read = chapters_read + $1
WHERE id = $2;

CREATE TABLE family_group (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(200) UNIQUE,
    reader_ids uuid[],
    additional_reader_ids uuid[],
    fg_password VARCHAR(100)
)