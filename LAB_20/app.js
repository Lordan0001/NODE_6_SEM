const express = require("express");
const app = express();
const customerRouter = require("./routes/customerRouter.js");
const productRouter = require("./routes/productRouter.js");
const registrationRouter = require("./routes/registrationRouter.js");
const technicianRouter = require("./routes/technicianRouter.js");
const incidentRouter = require("./routes/incidentRouter.js");
const customerPageRouter = require("./routes/customerPageRouter.js");
const incidentPageRouter = require("./routes/incidentPageRouter.js")
const productPageRouter = require("./routes/productPageRouter.js");
const registrationPageRouter = require("./routes/registrationPageRouter.js");
const technicianPageRouter = require("./routes/technicianPageRouter.js");

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json())

app.use("/api/technicians", technicianRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/registrations", registrationRouter);
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
app.use("/customers",customerPageRouter)
app.use("/incidents",incidentPageRouter)
app.use("/products",productPageRouter)
app.use("/registrations",registrationPageRouter)
app.use("/technicians",technicianPageRouter)


app.get('/', (req, res) => {
    res.render('index');
});
// app.get('/customers/', (req, res) => {
//     res.render('customers/customers',{});
// });


app.use(function (req, res, next) {
  res.status(404).send("Not Found")
});

app.listen(3000, ()=>console.log("server on 3000"));