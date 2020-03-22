const db = require('./db');
const app = require('./app');

app.post('/api/students', (req, res, next) => {
  db.createStudent(req.body)
    .then(student => res.send(student))
    .catch(next);
});

const port = process.env.PORT || 3000;

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
