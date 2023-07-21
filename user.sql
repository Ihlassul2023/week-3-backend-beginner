-- Active: 1689385551112@@127.0.0.1@5432@backend_beginner@public
DELETE FROM recipe WHERE id = 4;

SELECT * FROM users;

ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- buat table recipe
CREATE TABLE
    recipe(
        id SERIAL,
        title VARCHAR NOT NULL,
        ingredients TEXT NOT NULL,
        category VARCHAR ,
        photo VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO recipe(title,ingredients,category,photo,user_id,category_id) VALUES('telur gulung','telur, msg, bihun, saus','appetizer','https://placehold.co/600x400',7,1);

--buat table category
CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);
--mengisi data di table category
INSERT INTO category(name) VALUES('main course');
INSERT INTO category(name) VALUES('desert');
INSERT INTO category(name) VALUES('appetizer');

--buat kolom userId di table recipe
ALTER TABLE recipe ADD COLUMN user_id INT NOT NULL;

--buat kolom created_At di table recipe
ALTER TABLE recipe ADD COLUMN created_At DATE NOT NULL;

ALTER TABLE recipe
ALTER COLUMN created_At TYPE TIMESTAMP ;

--buat kolom userId menjadi foreign key untuk kolom id di table users
ALTER TABLE recipe ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

--buat categoryId di table recipe
ALTER TABLE recipe ADD COLUMN category_id INT NOT NULL;

--buat kolom categoryId menjadi foreign key untuk kolom id dtable category
ALTER TABLE recipe ADD FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE;

--menampilkan table recipe
SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, recipe.user_id, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE user_id = 7 AND title LIKE '%%';

-- ,users.name AS users FROM recipe JOIN users ON recipe.user_id = users.id WHERE user_id ILIKE '%1%'