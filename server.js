const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Словник замін розкладки (англійська -> українська)
const map = {
  q:'й', w:'ц', e:'у', r:'к', t:'е', y:'н', u:'г', i:'ш', o:'щ', p:'з', '[':'х', ']':'ї',
  a:'ф', s:'і', d:'в', f:'а', g:'п', h:'р', j:'о', k:'л', l:';', "'":"'",
  z:'я', x:'ч', c:'с', v:'м', b:'и', n:'т', m:'ь', ',':'б', '.':'ю', '/':'.',
  Q:'Й', W:'Ц', E:'У', R:'К', T:'Е', Y:'Н', U:'Г', I:'Ш', O:'Щ', P:'З', '{':'Х', '}':'Ї',
  A:'Ф', S:'І', D:'В', F:'А', G:'П', H:'Р', J:'О', K:'Л', L:':', '"':'"',
  Z:'Я', X:'Ч', C:'С', V:'М', B:'И', N:'Т', M:'Ь', '<':'Б', '>':'Ю', '?':'.'
};

// Тимчасове сховище для останніх повідомлень користувачів у пам'яті сервера
const userLastMessages = new Map();

function translateText(text) {
  return [...text].map(c => map[c] || c).join('');
}

// Ендпоінт, до якого звертається Nightbot через urlfetch
app.get('/fix', (req, res) => {
  const username = req.query.user;
  
  if (!username) {
    return res.send("Помилка: не вказано користувача.");
  }

  const lastMsg = userLastMessages.get(username.toLowerCase());
  
  if (!lastMsg) {
    return res.send("Не знайдено останніх повідомлень.");
  }

  const fixed = translateText(lastMsg);
  res.send(`Хотів сказати: ${fixed}`);
});

// Простий вебхук або тестова сторінка
app.get('/', (req, res) => {
  res.send('Twitch Layout Fixer Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
