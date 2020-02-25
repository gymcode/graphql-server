const express = require('express');
const GraphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

//middleware
app.use(cors());;

//mongodb connection 
const Uri = "mongodb://localhost:27017/Graphql";
mongoose.connect(Uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err) throw err
    console.log("Database connection made succeeefully");
})

app.use('/graphql', GraphqlHTTP({
    schema: schema,
    graphiql: true
}));

const PORT = 4000
app.listen(PORT, (err)=>{
    if (err) throw err
    console.log("Server connection made successfully");
});