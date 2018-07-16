// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE.txt in the project root for license information.
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
var resClient = require('node-rest-client').Client;
 
var timesheet = new resClient();

router.get('/1', function (req, res) {
  console.log(router); // /admin
  res.send('Admin Homepage');
}); 

router.get('/', async function(req, res, next) {
  let parms = { title: 'Timesheet', active: { timesheet: true },source:'http://es-timesheet.fuangmali.info:8081' };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;
    //parms.AccountName = "Wanchai Fuangmali"
    
    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    try {
      // Get the 10 newest messages from inbox
      const result = await client
      .api('/me/')
      //.api('/sites/vstecs.sharepoint.com,2bc30409-966d-4b09-a699-c51039ac1123,61456e60-e4d2-426c-8901-0765e7606b42/lists/ea963403-d79c-4bca-ac2c-18510844028b/items')
      //.version("V1.0") 
      //.query({"$expand":"fields"})
      //.top(10)
      //.expand('fields')
      //.select('id,fields,createdBy,createdDateTime')
      //.select('title')
      //.expand('fields')
      //.filter('createdBy.user.email eq Wanchai@vstecs.co.th')
      //.orderby('createdDateTime DESC')
      .get();
      
      parms.AccountName = result.givenName+' '+result.surname;
      parms.UID= result.id
      //parms.debug = JSON.stringify(parms,null,2);
      res.render('timesheet', parms);
    } catch (err) {
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }
    
  } else {
    // Redirect to home
    res.redirect('/');
  }
});

module.exports = router;