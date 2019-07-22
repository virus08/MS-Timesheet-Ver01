// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE.txt in the project root for license information.
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');


router.get('/', async function(req, res, next) {
  let parms = { title: 'project', active: { project: true },source:'https://es-timesheet.azurewebsites.net' };

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
      const result = await client
      .api('/me/')
      .get();
      
      parms.AccountName = result.givenName+' '+result.surname;
      parms.UID= result.id
      //parms.debug = JSON.stringify(parms,null,2);
      res.render('project', parms);
    } catch (err) {
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }
    
  } else {
    res.redirect('/');
  }
});

module.exports = router;