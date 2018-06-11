DROP TABLE accessTokens;
DROP TABLE followers;
DROP TABLE sessions;
DROP TABLE users;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE users_id_seq
  START WITH 1;
CREATE TABLE users (
  id          NUMBER        NOT NULL,
  firstname   VARCHAR2(50)  NOT NULL,
  lastname    VARCHAR2(50)  NOT NULL,
  email       VARCHAR2(100) NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  accessl     INTEGER       NOT NULL,
  description VARCHAR(255),
  avatar      VARCHAR(255),
  cover       VARCHAR(255),
  CONSTRAINT PK_USERS PRIMARY KEY (id)
);
CREATE OR REPLACE TRIGGER users_id_trigger
  BEFORE INSERT
  ON users
  FOR EACH ROW
  BEGIN
    SELECT users_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

INSERT INTO users VALUES (NULL, 'Don', 'Baron', 'don@baron.com', '63a9f0ea7bb98050796b649e85481845', 1, '', '', '');

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE sessions_id_seq
  START WITH 1;
CREATE TABLE sessions (
  id      INT NOT NULL,
  user_id INT,
  token   VARCHAR2(64),
  CONSTRAINT PK_SESSIONS PRIMARY KEY (id),
  CONSTRAINT FK_SESSIONS FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE OR REPLACE TRIGGER sessions_id_trigger
  BEFORE INSERT
  ON sessions
  FOR EACH ROW
  BEGIN
    SELECT sessions_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;
-- SHA256(email+session.id+randomstring(10));
INSERT INTO sessions VALUES (NULL, 6, '513B7D6DB79318D174F827738A34C3F4C94602289C27BECC4633B171D629F88D');

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE auth_id_seq
  START WITH 1;
CREATE TABLE auth (
  id      INT NOT NULL,
  user_id INT NOT NULL,
  token   VARCHAR2(64),
  CONSTRAINT PK_AUTH PRIMARY KEY (id),
  CONSTRAINT FK_AUTH FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE OR REPLACE TRIGGER auth_id_trigger
  BEFORE INSERT
  ON auth
  FOR EACH ROW
  BEGIN
    SELECT auth_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;
INSERT INTO auth VALUES (NULL, 6, '513B7D6DB79318D174F827738A34C3F4C94602289C27BECC4633B171D629F88D');

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE genre_id_seq
  START WITH 1;
CREATE TABLE genre (
  id   NUMBER       NOT NULL,
  name VARCHAR2(90) NOT NULL,
  CONSTRAINT PK_GENRE PRIMARY KEY (id)
);
CREATE OR REPLACE TRIGGER genre_id_trigger
  BEFORE INSERT
  ON genre
  FOR EACH ROW
  BEGIN
    SELECT genre_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

CREATE OR REPLACE PROCEDURE POPULATE_GENRE AS
  TYPE VARR IS VARRAY (1000) OF VARCHAR2(255);
  GENRE_LIST VARR := VARR('Alternative', 'Anime', 'Blues', 'Children’s Music', 'Classical', 'Comedy', 'Commercial',
                          'Country', 'Dance', 'Disney', 'Easy Listening', 'Electronic', 'Enka', 'French Pop',
                          'German Folk', 'German Pop', 'Fitness & Workout', 'Hip-Hop/Rap', 'Holiday', 'Indie Pop',
                          'Industrial', 'Inspirational', 'Instrumental', 'J-Pop', 'Jazz', 'K-Pop', 'Karaoke',
                          'Kayokyoku', 'Latin', 'New Age', 'Opera', 'Pop', 'R&B/Soul', 'Reggae', 'Rock',
                          'Singer/Songwriter', 'Soundtrack', 'Spoken Word', 'Tejano', 'Vocal', 'World');
  BEGIN
    FOR IDX IN 1..GENRE_LIST.COUNT - 1 LOOP
      INSERT INTO GENRE VALUES (NULL, GENRE_LIST(IDX));
    END LOOP;
  END;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE cds_id_seq
  START WITH 1;
CREATE TABLE cds (
  id         NUMBER        NOT NULL,
  artist     VARCHAR2(100) NOT NULL,
  duration   NUMBER        NOT NULL,
  label      VARCHAR2(50),
  genre_id   NUMBER        NOT NULL,
  owner_id   NUMBER        NOT NULL,
  owner_type VARCHAR2(5)   NOT NULL,
  CONSTRAINT PK_CDS PRIMARY KEY (id),
  CONSTRAINT FK_CDS FOREIGN KEY (genre_id) REFERENCES genre (id)
);
CREATE OR REPLACE TRIGGER cds_id_trigger
  BEFORE INSERT
  ON cds
  FOR EACH ROW
  BEGIN
    SELECT cds_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE cassetes_id_seq
  START WITH 1;
CREATE TABLE cassetes (
  id         NUMBER        NOT NULL,
  artist     VARCHAR2(100) NOT NULL,
  duration   NUMBER        NOT NULL,
  title      VARCHAR2(100) NOT NULL,
  state      NUMBER        NOT NULL, --NEW=1 OLD=0
  channel    NUMBER        NOT NULL, --stereo mono
  type       NUMBER        NOT NULL, --casetofon magnetofon
  label      VARCHAR2(50),
  genre_id   NUMBER        NOT NULL,
  owner_id   NUMBER        NOT NULL,
  owner_type VARCHAR2(5)   NOT NULL,
  CONSTRAINT PK_cassetes PRIMARY KEY (id),
  CONSTRAINT FK_cassetes FOREIGN KEY (genre_id) REFERENCES genre (id)
);
CREATE OR REPLACE TRIGGER cassetes_id_trigger
  BEFORE INSERT
  ON cassetes
  FOR EACH ROW
  BEGIN
    SELECT cassetes_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE groups_id_seq
  START WITH 1;
CREATE TABLE groups (
  id       NUMBER        NOT NULL,
  name     VARCHAR2(100) NOT NULL,
  owner_id NUMBER        NOT NULL,
  CONSTRAINT PK_groups PRIMARY KEY (id),
  CONSTRAINT FK_groups FOREIGN KEY (owner_id) REFERENCES users (id)
);
CREATE OR REPLACE TRIGGER groups_id_trigger
  BEFORE INSERT
  ON groups
  FOR EACH ROW
  BEGIN
    SELECT groups_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE belongs_id_seq
  START WITH 1;
CREATE TABLE belongs (
  id        NUMBER NOT NULL,
  group_id  NUMBER NOT NULL,
  member_id NUMBER NOT NULL,
  CONSTRAINT PK_belongs PRIMARY KEY (id),
  CONSTRAINT FK_group_belongs FOREIGN KEY (group_id) REFERENCES groups (id),
  CONSTRAINT FK_member_belongs FOREIGN KEY (member_id) REFERENCES users (id)
);
CREATE OR REPLACE TRIGGER belongs_id_trigger
  BEFORE INSERT
  ON belongs
  FOR EACH ROW
  BEGIN
    SELECT belongs_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;
------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE tickets_id_seq
  START WITH 1;
CREATE TABLE tickets (
  id         NUMBER        NOT NULL,
  event_name VARCHAR2(100) NOT NULL,
  label      VARCHAR2(100) NOT NULL,
  start_date VARCHAR2(100) NOT NULL,
  owner_id   NUMBER        NOT NULL,
  owner_type VARCHAR2(5)   NOT NULL,
  CONSTRAINT PK_tickets PRIMARY KEY (id)
);
CREATE OR REPLACE TRIGGER tickets_id_trigger
  BEFORE INSERT
  ON tickets
  FOR EACH ROW
  BEGIN
    SELECT tickets_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

------------------------------------------------------------------------------------------------------------------------

CREATE SEQUENCE vinyl_id_seq
  START WITH 1;
CREATE TABLE vinyl (
  id           NUMBER        NOT NULL,
  rpm          NUMBER        NOT NULL,
  state        NUMBER        NOT NULL,
  color        VARCHAR2(50)  NOT NULL,
  channel      NUMBER        NOT NULL,
  weight       NUMBER        NOT NULL,
  special      NUMBER        NOT NULL,
  condition    NUMBER        NOT NULL,
  artist       VARCHAR2(100) NOT NULL,
  release_year NUMBER        NOT NULL,
  title        VARCHAR2(100) NOT NULL,
  label        VARCHAR2(100) NOT NULL,
  genre_id     NUMBER        NOT NULL,
  owner_id     NUMBER        NOT NULL,
  owner_type   VARCHAR2(5)   NOT NULL,
  CONSTRAINT PK_vinyl PRIMARY KEY (id),
  CONSTRAINT FK_vinyl FOREIGN KEY (genre_id) REFERENCES genre (id)
);
CREATE OR REPLACE TRIGGER vinyl_id_trigger
  BEFORE INSERT
  ON vinyl
  FOR EACH ROW
  BEGIN
    SELECT vinyl_id_seq.nextval
    INTO :new.id
    FROM dual;
  END;

------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
-------------------------------------THINGS THINGS THINS THINS THINS THINS----------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------

CREATE TABLE accessTokens (
  id      INT NOT NULL,
  user_id INT NOT NULL,
  token   VARCHAR(128),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE followers (
  id      INT NOT NULL,
  user_id INT NOT NULL,
  follows INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (follows) REFERENCES users (id)
);

INSERT INTO users VALUES (NULL, 'Don', 'Baron', 'don@baron.com', '63a9f0ea7bb98050796b649e85481845', 1, '', '', '');
INSERT INTO users VALUES (NULL, 'Mon', 'Jov', 'mon@gmail.com', '63a9f0ea7bb98050796b649e85481845', 1, '', '', '');


SELECT *
FROM users;
WHERE email = 'email2@email.com' AND PASSWORD = 'bucabuca';
SELECT user_id
FROM sessions;

SELECT *
FROM sessions;

SELECT *
FROM genre;
SELECT *
FROM users;
SELECT *
FROM groups;
COMMIT;
DELETE FROM groups
WHERE id IN (21, 23);

SELECT *
FROM groups;
SELECT *
FROM belongs;
-- gr 1
SELECT *
FROM belongs
  JOIN users ON belongs.member_id = users.id
WHERE group_id = 1
SELECT *
FROM belongs b
  JOIN users s ON b.member_id = s.id
WHERE group_id = 1;
INSERT INTO belongs VALUES (NULL, 1, 67);
INSERT INTO belongs VALUES (NULL, 1, 105);

SELECT *
FROM belongs
  JOIN groups ON belongs.group_id = groups.id
  JOIN users ON belongs.member_id = users.id
WHERE users.id = 105;
select * from groups;
select count(*) from tickets where event_name = "name" and owner_type="group" and owner_id="id";

select * from tickets;
