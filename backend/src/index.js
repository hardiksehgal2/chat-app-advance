const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use("/api/auth",authRoutes);
app.listen(5000,()=>{
    console.log("Server is running at port 5000");
});