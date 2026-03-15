console.log("Скрипт начал работу...");

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'myappdb';
const collectionName = 'users';

async function initDB() {
  console.log("Пытаемся подключиться к MongoDB...");
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log("Подключились к MongoDB!");

    const db = client.db(dbName);
    console.log("База данных выбрана:", dbName);
    
    await db.createCollection(collectionName);
    console.log(`Коллекция "${collectionName}" создана!`);

  } catch (err) {
    if (err.codeName === 'NamespaceExists') {
      console.log("Коллекция уже существует — всё готово.");
    } else {
      console.log("ОШИБКА:", err.message);
      console.log("КОД ОШИБКИ:", err.code);
    }
  } finally {
    await client.close();
    console.log("Соединение закрыто.");
  }
}

initDB().then(() => {
  console.log("Скрипт завершён.");
}).catch((err) => {
  console.log("Необработанная ошибка:", err.message);
});
