import BetterSqlite3 from 'better-sqlite3';

///////////////////////////////
// Open Database
///////////////////////////////
const db: BetterSqlite3.Database = new BetterSqlite3('test.db', { verbose: console.log });

///////////////////////////////
// Create Table
///////////////////////////////
db.exec("CREATE TABLE IF NOT EXISTS users('name' varchar PRIMARY KEY, 'age' INTEGER);");

///////////////////////////////
// Insert
///////////////////////////////
const insert: BetterSqlite3.Statement
    = db.prepare('INSERT INTO users (name, age) VALUES (@name, @age)');

// 1. Use 'for' statement
const insertMany: BetterSqlite3.Transaction = db.transaction((users) => {
    for (const user of users) insert.run(user);
});

insertMany([
    { name: 'AAA', age: 11 },
    { name: 'BBB', age: 12 },
    { name: 'CCC', age: 13 },
]);

// 2. Not use transaction
insert.run({ name: 'DDD', age: 25 });

// 3. Standard transaction
const trantest: BetterSqlite3.Transaction = db.transaction(() => {
    // BEGIN
    insert.run({ name: 'EEE', age: 35 });
    // COMMIT
    // IF error, ROLLBACK
});
// Do insert
trantest();

///////////////////////////////
// Get
///////////////////////////////
// 1. Get All
const get1: BetterSqlite3.Statement = db.prepare('SELECT * FROM users;');
console.log(get1.all());

// 2. Get One
const get2: BetterSqlite3.Statement = db.prepare("SELECT * FROM users WHERE name = 'BBB';");
console.log(get2.all());

///////////////////////////////
// Update
///////////////////////////////
const update: BetterSqlite3.Statement = db.prepare("UPDATE users SET age = 22 WHERE name = 'BBB';")
update.run();
console.log(get2.all());

///////////////////////////////
// Delete Record
///////////////////////////////
const del: BetterSqlite3.Statement = db.prepare("DELETE FROM users WHERE name = 'BBB';");
del.run();
console.log(get2.all()); // return []

///////////////////////////////
// Delete Table
///////////////////////////////
// 1. Delete Table Logical
const delTable: BetterSqlite3.Statement = db.prepare("DROP TABLE users;");
delTable.run();
// 2. Release Disk Space
const vacuum: BetterSqlite3.Statement = db.prepare("VACUUM;");
vacuum.run();
