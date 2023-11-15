const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const connectdb = require('./database/connectdb.js');

// Importing routers
const routecategory = require('./router/Category.router.js');
const routecategoryStock = require('./router/CategoryStock.router.js');
const routeproduct = require('./router/Product.router.js');
const routeuser = require('./router/User.router.js');
const routeemployee = require('./router/Employee.router.js');
const routesalarymovement = require('./router/EmployeeSalary.router.js');
const routetable = require('./router/Table.router.js');
const routeorder = require('./router/Order.router.js');
const routeauth = require('./router/Auth.router.js');
const routestockitems = require('./router/StockItem.router.js');
const routestockmanag = require('./router/StockMang.router.js');
const routeexpense = require('./router/Expense.router.js');
const routedailyexpense = require('./router/DailyExpense.router.js');

dotenv.config();
connectdb();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');
  // Any specific logic for new connections can be added here
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://caviar-demo.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/', express.static('public'));
app.use('/', express.static('images'));

// API routes
app.get('/', (req, res) => {
  res.send('beshoy');
});

// Listening to the server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Routing setup
app.use('/api/product', routeproduct);
app.use('/api/category', routecategory);
app.use('/api/user', routeuser);
app.use('/api/employee', routeemployee);
app.use('/api/salarymovement', routesalarymovement);
app.use('/api/table', routetable);
app.use('/api/order', routeorder);
app.use('/api/auth', routeauth);
app.use('/api/categoryStock', routecategoryStock);
app.use('/api/stockitem', routestockitems);
app.use('/api/stockmanag', routestockmanag);
app.use('/api/expenses', routeexpense);
app.use('/api/dailyexpense', routedailyexpense);
