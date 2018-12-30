'use strict';

const express = require('express');

module.exports = (db, table, render_pages) => {


  const response = (req,res,data,pref) => {
    if (req.accepts('html', 'json') === 'json') {
        return res.json(data);
    } else if (render_pages) {
        const renders = {};
        renders[table.name] = data;
        return res.render(table.name + pref, renders); 
     } else {
        return res.json(data);
    }
  }

  const create = (req, res) => {
    const newEntry = req.body;

    let sql_columns = ' ';
    let sql_values = ' ';
    let values = [];

    let count = 1;
    for (let i = 0; i < table.columns.length; i++) {
      const label = table.columns[i];
      const value = newEntry[label];
      if (value != null) {
        sql_columns += '"'+label + '",';
        values.push(value);
        sql_values += '$' + (count++) + ",";
      }

    }
    sql_columns = sql_columns.substring(0, sql_columns.length - 1);
    sql_values = sql_values.substring(0, sql_values.length - 1);

    const sql = 'INSERT INTO "' + table.name + '"(' + sql_columns + ') VALUES (' + sql_values + ') RETURNING ' + table.primary_key;

    //console.log(sql);
    //console.log(values);

    db.one(sql, values)
      .then(data => {
        newEntry[table.primary_key] = data[table.primary_key];
        return res.json(newEntry);
        
      })
      .catch(error => {
        console.log(error);
         return res.status(500).send('500: Internal Server Error');
      });

  };



  const readMany = (req, res) => {
    db.any('SELECT * FROM "' + table.name+'"', [])
      .then(function (data) {
          return response(req,res,data,"-show");
      })
      .catch(function (error) {
        console.log(error);
        return res.status(500).send('500: Internal Server Error');
      });
  };


  const readOne = (req, res) => {
    const { _id } = req.params;
    db.any('SELECT * FROM "' + table.name + '" WHERE "' + table.primary_key + '" = $1 ', [_id])
      .then(function (data) {
        return response(req,res,data,"-edit");
      })
      .catch(function (error) {
        console.log(error);
         return res.status(500).send('500: Internal Server Error');
      });
  };



  const update = (req, res) => {

    const newEntry = req.body;
    const { _id } = req.params;
    if (_id == null) return res.status(500).send('500: Invalid ID');

    let sql_set = ' ';
    let values = [];

    let count = 1;


    for (let i = 0; i < table.columns.length; i++) {
      const label = table.columns[i];
      const value = newEntry[label];
      if (value != null) {
        sql_set += '"'+label + '" = $' + (count++) + ',';
        values.push(value)
      }

    }
    sql_set = sql_set.substring(0, sql_set.length - 1);
    values.push(_id);
    const sql = 'UPDATE "' + table.name + '" SET ' + sql_set + ' WHERE ' + table.primary_key + ' = $' + count;

    //console.log(sql);
    //console.log(values);

    db.result(sql, values)
      .then(result => {
        //return res.json(result.rowCount);
        return readOne(req, res);
      })
      .catch(error => {
        console.log(error);
         return res.status(500).send('500: Internal Server Error');
      });



  };


  const remove = (req, res) => {
    const { _id } = req.params;
    db.result('DELETE FROM "' + table.name + '" WHERE "' + table.primary_key + '" = $1 ', [_id])
      .then(result => {
        return res.json("deleted_"+ result.rowCount + "_records");
      })
      .catch(error => {
        console.log(error);
         return res.status(500).send('500: Internal Server Error');
      });
  };

  let router = express.Router();

  router.post('/', create);
  router.get('/', readMany);
  router.get('/:_id', readOne);
  router.put('/:_id', update);
  router.delete('/:_id', remove);
  
  if (render_pages) {
    router.get('/del/:_id', remove);
    router.post('/upd/:_id', update);
  }
  return router;

}