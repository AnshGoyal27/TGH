const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');

app.use(cors({
  origin : '*'
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/admin',adminRouter);
app.use('/student',studentRouter);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})