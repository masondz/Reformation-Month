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

CREATE TABLE adReaders_reading_challenges (
    ad_reader_id uuid REFERENCES additional_readers(ad_reader_id) ON DELETE CASCADE,
    challenge_id uuid REFERENCES reading_challenges(id) ON DELETE CASCADE,
    PRIMARY KEY (ad_reader_id, challenge_id)
)

/*test route for Bill */

SELECT additional_readers.*
FROM additional_readers
INNER JOIN family_group
  ON (additional_readers.ad_reader_id = ANY(family_group.additional_reader_ids))
JOIN readers
  ON (readers.id = ANY(family_group.reader_ids))
	WHERE readers.id = '8a485680-8574-4210-8cb2-74a34b84f28f'
    ORDER BY additional_readers.name;

/*update a postgres array with append*/
UPDATE player_scores SET round_scores = array_append(round_scores, 100);

UPDATE family_group SET reader_ids = array_append(reader_ids, $1) WHERE family_name = $2 AND fg_password = $3, [reader_id, family_name, fg_password]

SELECT r.first_name, rc.challenge_name
FROM readers r
INNER JOIN readers_reading_challenges rrc
ON rrc.reader_id = r.id
INNER JOIN reading_challenges rc
ON rrc.challenge_id = rc.id
WHERE r.first_name = 'Jimmy'

SELECT r.id, r.first_name, rc.challenge_name
FROM readers r
INNER JOIN readers_reading_challenges rrc
ON rrc.reader_id = r.id
INNER JOIN reading_challenges rc
ON rrc.challenge_id = rc.id
WHERE r.first_name = 'Jimmy'

INSERT INTO adreaders_reading_challenges (ad_reader_id, challenge_id)
             SELECT '09bb081b-07a4-4606-95f4-eab14ba288ef', reading_challenges.id FROM reading_challenges 
             INNER JOIN readers_reading_challenges
                ON reading_challenges.id = readers_reading_challenges.challenge_id
             INNER JOIN readers
                ON readers_reading_challenges.reader_id = readers.id
                WHERE readers.id = '7abc8697-d65e-4265-a844-a18dd2a981e2'
                ON CONFLICT DO NOTHING

SELECT rc.challenge_name FROM reading_challenges rc
INNER JOIN readers_reading_challenges rrc
ON rc.id = rrc.challenge_id
INNER JOIN readers r
ON r.id = rrc.reader_id
WHERE r.first_name = 'Jimmy';


-- array_remove(anyarray, anyelement)

-- c537e5ec-bbd6-4a7d-9b76-b23b89dfbb35 Rocket's Id

SELECT array_remove(family_group.additional_reader_ids, 'c537e5ec-bbd6-4a7d-9b76-b23b89dfbb35');
SELECT readers.first_name, family_group.family_name, family_group.id FROM family_group INNER JOIN readers 
ON readers.id = ANY(family_group.reader_ids)
WHERE readers.id = '7abc8697-d65e-4265-a844-a18dd2a981e2';

-- nutron fg_id = '2a2bf035-5a4f-4297-9948-41896448f43a'



SELECT r.first_name, r.id FROM readers r 
INNER JOIN family_group fg 
ON r.id = ANY(fg.reader_ids)
WHERE fg.id = '2a2bf035-5a4f-4297-9948-41896448f43a';

SELECT ar.name as adreaders_in_tfc FROM additional_readers ar
INNER JOIN adreaders_reading_challenges arc
ON ar.ad_reader_id = arc.ad_reader_id
INNER JOIN reading_challenges rc
ON rc.id = arc.challenge_id
WHERE rc.challenge_name = 'First Test Challenge'


SELECT rc.challenge_name FROM reading_challenges rc
INNER JOIN adreaders_reading_challenges
arc
ON arc.challenge_id = rc.id
INNER JOIN additional_readers ar
ON ar.ad_reader_id = arc.ad_reader_id
WHERE ar.name = 'Rocket';


SELECT (SELECT count(*) as count FROM reading_challenges), challenge_name, organization, goal, challenge, id, challenge_admin 
FROM reading_challenges ch, readers_reading_challenges rch
WHERE ch.id = rch.challenge_id AND rch.reader_id = '7abc8697-d65e-4265-a844-a18dd2a981e2' ORDER BY challenge_name;