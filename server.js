const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/login', (req, res) => {
  const db = router.db; // lowdb instance
  const users = db.get('users').value();
  const { username, password } = req.body;

  const user = users.find(user => user.email === username && user.password === password);

  if (user) {
    res.json({ status: 'success', user: user });
  } else {
    res.status(401).json({ status: 'failure', message: 'Invalid username or password' });
  }
});

server.post('/vendor/sign-up', (req, res) => {
  const db = router.db;
  const newUser = { ...req.body, role: 'vendor', email: req.body.email, password: req.body.userName };
  db.get('users').push(newUser).write();
  res.json({ status: 'success', message: 'Vendor successfully registered' });
});

server.post('/buyer/signup', (req, res) => {
  const db = router.db;
  const newUser = { ...req.body, role: 'buyer', email: req.body.email, password: req.body.userName };
  db.get('users').push(newUser).write();
  res.json({ status: 'success', message: 'Buyer successfully registered' });
});

server.use(router);
server.listen(5000, '0.0.0.0', () => {
  console.log('JSON Server is running 0.0.0.0:5000');
});

