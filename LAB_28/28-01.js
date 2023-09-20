const app = require("express")();
const express = require("express");
const fs = require("fs");
// Используем динамический импорт для модуля "webdav"
import("webdav")
  .then((webdav) => {
    const { createClient, AuthType } = webdav;
    const app = express();


    const client = createClient("https://webdav.yandex.ru", {
      username: "username",
      password: "password",
    });

    const Error408 = (res) => {
      res.status(408).send("Request Timeout");
    };
    const Error404 = (res) => {
      res.status(404).send("Resource not found");
    };

    app.post("/md/:name", (req, res) => {
      const nameFile = `/${req.params.name}`;
      client.exists(nameFile).then((result) => {
        if (!result) {
          client.createDirectory(nameFile);
          res.status(200).send(`directory --${nameFile}-- was created`);
        } else {
            Error408(res);
            console.log('already exist')
        }
      });
    });

    app.post("/rd/:name", (req, res) => {
      const nameFile = `/${req.params.name}`;
      client.exists(nameFile).then((result) => {
        if (result) {
          client.deleteFile(nameFile);
          res.status(200).send(`directory --${nameFile}-- was deleted`);
        } else Error404(res);
      });
    });

    app.post("/up/:name", (req, res) => {
      try {
        const filePath = './files/' +  req.params.name;

        if (!fs.existsSync(filePath)) {
          Error404(res);
          return;
        }

        let rs = fs.createReadStream(filePath);
        let ws = client.createWriteStream(req.params.name);
        rs.pipe(ws);

        res.status(200).send("File was uploaded to your store");
      } catch (err) {
        Error408(res);
      }
    });


    app.post("/down/:name", (req, res) => {
      const filePath = "/" + req.params.name;
      client
        .exists(filePath)
        .then((alreadyExists) => {
          if (alreadyExists) {
            let rs = client.createReadStream(filePath);
            let ws = fs.createWriteStream(Date.now() + req.params.name
            );
            rs.pipe(ws);
            rs.pipe(res);
          } else {
            Error404(res);
          }
        })
        .then((message) => (message ? res.json(message) : null))
        .catch((err) => Error404(err));
    });

    app.post("/del/:name", (req, res) => {
      const nameFile = './files/'+ req.params.name;
      client.exists(nameFile).then((result) => {
        if (result) {
          client.deleteFile(nameFile);
          res.status(200).send("File was deleted");
        } else Error404(res);
      });
    });

    app.post("/copy/:from/:to", (req, res) => {
      const nameFrom = req.params.from;
      const nameTo = `${req.params.to}`;
      client
        .exists(nameFrom)
        .then((result) => {
          if (result) {
            client.copyFile(nameFrom, nameTo);
            res.status(200).send("File was copied");
          } else Error404(res);
        })
        .catch(() => {
          Error408(res);
        });
    });

    app.post("/move/:from/:to", (req, res) => {
      const nameFrom = req.params.from;
      const nameTo = req.params.to;
      client
        .exists(nameFrom)
        .then((result) => {
          if (result) {
            client.moveFile(nameFrom, nameTo);
            res.status(200).send("File was moved");
          } else Error404(res);
        })
        .catch(() => {
          Error408(res);
        });
    });

    app.use((err, req, res, next) => {
      res.send(err);
    })

    app.listen(5000, () => {
      console.log("Server running in http://localhost:5000");
    });

  })
  .catch((error) => {
    console.error("Ошибка при загрузке модуля 'webdav':", error);
  });