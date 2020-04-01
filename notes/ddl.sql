/*
 run mysql -u root -p < ddl.sql
 enter root password when prompted
 */

CREATE USER "joe"@"localhost" IDENTIFIED BY "joesql";
CREATE DATABASE boggle;

USE boggle;

CREATE TABLE teacher
(
  teacherID INT AUTO_INCREMENT,
  username VARCHAR(16) UNIQUE NOT NULL,
  email VARCHAR(32),
  forename VARCHAR(16),
  surname VARCHAR(16),
  PRIMARY KEY (teacherID)
);

CREATE TABLE pupil
(
  pupilID INT AUTO_INCREMENT,
  teacherID INT NOT NULL,
  forename VARCHAR(16),
  surname VARCHAR(16),
  username VARCHAR(16) UNIQUE NOT NULL,
  waitingForGame ENUM("True", "False"),
  PRIMARY KEY (pupilID),
  FOREIGN KEY (teacherID) REFERENCES teacher(teacherID)
);

CREATE TABLE game
(
  gameID INT AUTO_INCREMENT,
  dateStarted DATE,
  board VARCHAR(17),
  PRIMARY KEY (gameID)
);

CREATE TABLE player
(
  pupilID INT NOT NULL,
  gameID INT NOT NULL,
  score INT,
  submitted ENUM("True", "False"),
  PRIMARY KEY (pupilID, gameID),
  FOREIGN KEY (pupilID) REFERENCES pupil(pupilID),
  FOREIGN KEY (gameID) REFERENCES game(gameID)
);

CREATE TABLE word
(
  wordID INT AUTO_INCREMENT,
  word VARCHAR(17),
  isWord ENUM("True", "False"),
  PRIMARY KEY (wordID)
);

CREATE TABLE boardWord
(
  gameID INT NOT NULL,
  wordID INT NOT NULL,
  PRIMARY KEY (gameID, wordID),
  FOREIGN KEY (gameID) REFERENCES game(gameID),
  FOREIGN KEY (wordID) REFERENCES word(wordID)
);

CREATE TABLE playerWord
(
  pupilID INT NOT NULL,
  gameID INT NOT NULL,
  wordID INT NOT NULL,
  legitimate ENUM("True", "False"),
  PRIMARY KEY (pupilID, gameID, wordID),
  FOREIGN KEY (pupilID) REFERENCES pupil(pupilID),
  FOREIGN KEY (gameID) REFERENCES game(gameID),
  FOREIGN KEY (wordID) REFERENCES word(wordID)
);

GRANT ALL ON boggle.* TO "joe"@"localhost";
