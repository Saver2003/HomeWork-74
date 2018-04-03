const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = "./messageDb";

const messages = [];
const getFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      files.forEach(file => {
        if (err) {
          reject(err);
        } else {
          messages.push(path + '/' + file);
          resolve(messages);
        }
      })
    });
  });
};

router.get('/', (req, res) => {
  getFiles().then((result) => {
    const readMessages = result.map((message) => {
      return new Promise((resolve, reject) => {
        fs.readFile(message, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(result));
        });
      })
    });
    return Promise.all(readMessages);
  }).then((result) => {
    res.send(result.slice(-5));
  });
});

router.post('/', (req, res) => {
  const data = new Date();
  const newMessage = req.body;
  newMessage.date = data;
  fs.writeFile('./messageDb/' + data + '.txt', JSON.stringify(newMessage, null, 2), (err) => {
    if (err) {
      console.log('error');
    }
    console.log('File saved');
  });
  const message = req.body;
  messages.push(message);
  res.send(message);
});

module.exports = router;