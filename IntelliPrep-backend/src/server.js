require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const port = process.env.PORT || 3000;

//console.log("DB url: ", process.env.DATABASE_URL);
pool.query("SELECT NOW()", (err,res)=>{
    if(err){
        console.log("DB connection failed",err);
    }
    else{
        console.log("DB connected at: ", res.rows[0].now);
    }
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});