const express = require('express');
const tmi = require('tmi.js');
const app = express();

const PORT = process.env.PORT || 3000;

const map = {
  q:'й', w:'ц', e:'у', r:'к', t:'е', y:'н', u:'г', i:'ш', o:'щ', p:'з', '[':'х', ']':'ї',
  a:'ф', s:'і', d:'в', f:'а', g:'п', h:'р', j:'о', k:'л', l:';', "'":"'",
  z:'я', x:'ч', c:'с', v:'м', b:'и', n:'т', m:'ь', ',':'б', '.':'ю', '/':'.',
  Q:'Й', W:'Ц', E:'У', R:'К', T:'Е', Y:'Н', U:'Г', I:'Ш', O:'Щ', P:'З', '{':'Х', '}':'Ї',
  A:'Ф', S:'І', D:'В', F:'А', G:'П', H:'Р', J:'О', K:'Л', L:':', '"':'"',
  Z:'Я', X:'Ч', C:'С', V:'М', B:'И', N:'Т', M:'Ь', '<':'Б', '>':'Ю', '?':'.'
};

const userLastMessages = new Map();

const client = new tmi.Client({
  options: { debug: false },
  channels: ['lob0da_'] 
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;
  
  // Ігноруємо повідомлення, що починаються з команд (наприклад, з "!"), 
  // щоб вони не перезаписували нормальний текст.
  if (message.startsWith('!') || message.startsWith('/')) return;

  const username = tags.username.toLowerCase();
  userLastMessages.set(username, message);
});

function translateText(text) {
  return [...text].map(c => map[c] || c).join('');
}

app.get('/fix', (req, res) => {
  const username = req.query.user;
  
  if (!username) {
    return res.send("Помилка: не вказано користувача.");
  }

  const lastMsg = userLastMessages.get(username.toLowerCase());
  
  if (!lastMsg) {
    return res.send("Ще немає повідомлень у пам'яті.");
  }

  const fixed = translateText(lastMsg);
  res.send(`Хотів сказати: ${fixed}`);
});

app.get('/', (req, res) => {
  res.send('Twitch Live Layout Fixer is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
