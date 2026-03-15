const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'myappdb';
const collectionName = 'users';

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.get('/result', async (req, res) => {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const user = await collection.findOne({}, { sort: { _id: -1 } });

    if (!user) {
      return res.send('<h1>Данных пока нет. <a href="/">Заполнить форму</a></h1>');
    }

    
    let html = fs.readFileSync(path.join(__dirname, 'views', 'result.html'), 'utf8');
    html = html.replace('{{name}}', user.name);
    html = html.replace('{{email}}', user.email);

    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  } finally {
    await client.close();
  }
});


app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({ name, email, createdAt: new Date() });
    console.log(`Сохранено: ${name}, ${email}`);

    res.redirect('/result');

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при сохранении');
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
