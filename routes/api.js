const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  // console.log("body bulk route: ", {body});
  const bulk = JSON.parse(body);
  // console.log("parse body bulk route: ", bulk);
  Transaction.insertMany(bulk)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log(err);
    });
});

router.get("/api/transaction", (req, res) => {
  
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.json(dbTransaction);
      console.log(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log(err);
    });
});

module.exports = router;