DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS comments;

CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   username VARCHAR(225) not null UNIQUE,
   email VARCHAR(255) not null UNIQUE,
   password VARCHAR(255) not null,
   about VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts(
   id SERIAL PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   title VARCHAR(255) NOT NULL,
   url TEXT,
   post TEXT,
   total_comments INTEGER,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
   id SERIAL PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   post_id INTEGER NOT NULL,
   comment_id INTEGER,
   comment TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (username, title, url) VALUES ('guilher', 'Teste', 'http://www.teste.com');
INSERT INTO posts (username, title, url) VALUES ('spongebob', 'Another URL', 'http://www.globo.com');
INSERT INTO posts (username, title, url) VALUES ('mattfewer', 'bla bla bla URL', 'http://www.bla.com');
