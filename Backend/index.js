const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors')
const userRouter = require('./routes/userRoute')
const categoriesRouter = require('./routes/categoriesRoute')
require('dotenv').config()

const app = express();

const port = process.env.PORT || 2004
const localhost = process.env.LOCALHOST

//connection db
connectDB()

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//API của thằng user
app.use('/api/v1/', userRouter)
//API cuar categories
app.use('/api/v2/', categoriesRouter)


app.get('/', (req, res) => {
    res.send('hello cac ban')
})

app.listen(port, localhost, () => {
    console.log(`Server started at http://${localhost}:${port}`);

})