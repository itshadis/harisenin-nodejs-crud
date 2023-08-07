require('dotenv').config();
const cors = require('cors');
const express = require('express');
const PORT = process.env.SERVER_PORT || 3001;
const { sequelize } = require('./models')

const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: true, credentials:true}));

sequelize.authenticate().then(function () {
  console.log('database connection has successfully connected');
}).catch(function (err) {
  console.log('unable to connect to database' + err)
})

app.use('/api/products', productRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRoute);

app.listen(PORT, () => console.log(`Server runnig on ${PORT}`));