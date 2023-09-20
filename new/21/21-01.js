const express=require("express")
const bodyParser=require("body-parser")
const controller=require("./controllers/controller")
const url=require("url")

const hbs = require("express-handlebars").create({
    extname: ".hbs",
    helpers: {
        deny: () => {
            return '<a href="/"">deny</a>';
        },
    },
});

let app=express()

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({extended: false}))
app.use("/static", express.static("public"));

app.get("/",(req,resp)=>{
    resp.render("getAll.hbs",{
        list: controller.getAll(),
        title: "TelephoneList",
        click: true
    })
})
app.get("/add",(req,resp)=>{
    resp.render("post.hbs",{
        list: controller.getAll(),
        title: "TelephoneList",
        click: false
    })
})
app.get("/update",(req,resp)=>{
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    let result = controller.getAll();
    let send;
    for (var i = 0; i < result.length; i++) {
        if (result[i]["FIO"] == query["FIO"]) {
            send = result[i];
            break;
        }
    }
    resp.render("update.hbs",{
        list: controller.getAll(),
        title: "TelephoneList",
        FIO: send["FIO"],
        number: send["number"],
        click: false
    })
})
app.get("/delete",(req,resp)=>{
    resp.render("update.hbs",{
        list: controller.getAll(),
        title: "TelephoneList"
    })
})

app.post("/add",(req,resp)=>{
    controller.add(req.body)
    resp.redirect(303,"/")
})
app.post("/update",(req,resp)=>{
    console.log(req.body)
    controller.update(req.body)
    resp.redirect(303,"/")
})
app.post("/delete/:FIO",(req,resp)=>{
    controller.delete(req.params)
    resp.redirect(303,"/")
})

app.listen(3000)