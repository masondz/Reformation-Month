CREATE TABLE readers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(200),
    user_password VARCHAR(20),
    chapters_read INTEGER,
    books_read INTEGER,
    verses_memorized INTEGER,
    reading_challanges VARCHAR(200)[]
)

ALTER TABLE readers
ADD COLUMN reading_challanges VARCHAR(200)[]

INSERT INTO readers (
    first_name, 
    last_name, 
    email, 
    user_password, 
    chapters_read, 
    books_read, 
    verses_memorized, 
    reading_challanges) 

VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

DROP TABLE if exists reading_challanges;

CREATE TABLE reading_challanges (
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

INSERT INTO reading_challanges(
challenge_name = 'Church at the Square',
organization = 'C@TS',
challenge = 'chapters',
goal = 20000,
challenge_admin = 1)