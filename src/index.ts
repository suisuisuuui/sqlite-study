import Database from 'better-sqlite3';

///////////////////////////////
// Open Database
///////////////////////////////
const db = new Database('test.db', { verbose: console.log });

///////////////////////////////
// Create Table
///////////////////////////////
db.exec("CREATE TABLE IF NOT EXISTS users('name' varchar PRIMARY KEY, 'age' INTEGER);");

///////////////////////////////
// Insert
///////////////////////////////
const insert = db.prepare('INSERT INTO users (name, age) VALUES (@name, @age)');

// 1. Use 'for' statement
const insertMany = db.transaction((users) => {
    for (const user of users) insert.run(user);
});

insertMany([
    { name: 'Joey', age: 2 },
    { name: 'Sally', age: 4 },
    { name: 'Junior', age: 1 },
]);

// 2. Not use transaction
insert.run({name: 'AAA',age: 5});

// 3. Standard transaction
const trantest = db.transaction(() => {
    // BEGIN
    insert.run({name: 'BBB',age: 5});
    // COMMIT
    // IF error, ROLLBACK
});
// Do insert
trantest();

///////////////////////////////
// Get
///////////////////////////////
// 1. Get All
const stmt = db.prepare('SELECT * FROM users;');
console.log(stmt.all());

// 2. Get One
const stmt2 = db.prepare("SELECT * FROM users WHERE name = 'BBB';");
console.log(stmt2.all());

///////////////////////////////
// Update
///////////////////////////////
const update = db.prepare("UPDATE users SET age = 10 WHERE name = 'BBB';")
update.run();
console.log(stmt2.all());

///////////////////////////////
// Delete Record
///////////////////////////////
const del = db.prepare("DELETE FROM users WHERE name = 'BBB';");
del.run();
console.log(stmt2.all()); // return []

///////////////////////////////
// Delete Table
///////////////////////////////
// 1. Delete Table Logical
const delTable = db.prepare("DROP TABLE users;");
delTable.run();
// 2. Release Disk Space
const vacuum = db.prepare("VACUUM;");
vacuum.run();
