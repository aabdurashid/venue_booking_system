const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();

const adminRouter = require('./routes/adminRoutes');
const ownerRouter = require('./routes/ownerRoutes');
const userRouter = require('./routes/userRoutes');

app.use(cors());
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/admin', adminRouter)
app.use('/owner', ownerRouter)
app.use('/user', userRouter)

const PORT = process.env.PORT || 3105
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
})


/// Login uchun
// admin:
//   username: admin1
//   password: admin123
// owner:
//   username:
//   password: 