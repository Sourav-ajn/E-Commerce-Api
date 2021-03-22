const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const categoriesRoutes = require('./routes/categoryRoute');
const productsRoutes = require('./routes/productRoute');
const usersRoutes = require('./routes/userRoute');
const ordersRoutes = require('./routes/orderRoute');
require('dotenv/config');
const auth = require('./utility/auth'); 

const app = express();

app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(auth);

const port = process.env.PORT || 3500;
const api = process.env.API_URL;
// route

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})

app.listen(port, ()=>{
    console.log("Server is listening on port 3000")
})