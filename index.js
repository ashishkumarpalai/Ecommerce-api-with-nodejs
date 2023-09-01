const express = require("express")

require("dotenv").config()
const { connection } = require("./configs/db")
const{userRouter}=require("./routes/user.routes")
// const{flightRouter}=require("./routes/flight.routes")
// const{bookingRouter}=require("./routes/booking.routes")
const {authenticate}=require("./middleware/auth.middleware")

const app = express()

app.use(express.json())

app.get("/", async (req, res) => {
    res.send("wellcome to Ecommerce backend")
    console.log("Wellcome Ecommerce backend app")
})

//user registration and login
app.use("/",userRouter)

//authentication
app.use(authenticate)

app.get("/a", async (req, res) => {
    res.send("wellcome to Ecommerce backend")
    console.log(req.body.user)
})
//flight data
// app.use("/api/flights",authenticate,flightRouter)

//booking data
// app.use("/api",authenticate,bookingRouter)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("DataBase is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running ${process.env.port}`)
})