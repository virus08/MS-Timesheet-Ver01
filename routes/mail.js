// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE.txt in the project root for license information.

var express = require('express');

var router = express.Router();

var authHelper = require('../helpers/auth');

var graph = require('@microsoft/microsoft-graph-client');



/* GET /mail */

router.get('/', async function(req, res, next) {

  let parms = { title: 'Mail', active: { inbox: true } };



  const accessToken = await authHelper.getAccessToken(req.cookies, res);

  const userName = req.cookies.graph_user_name;



  if (accessToken && userName) {

    parms.user = userName;
    // parms.source = 'https://es-timesheet.azurewebsites.net'
    

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

      .get();

      parms.source = 'https://es-timesheet.azurewebsites.net'

      parms.AccountName = result.givenName+' '+result.surname;

      parms.UID= result.id

      //parms.debug = JSON.stringify(parms,null,2);

      //res.render('timesheet', parms);

      } catch (err) {

        parms.message = 'Error retrieving messages';

        parms.error = { status: `${err.code}: ${err.message}` };

        // parms.debug = JSON.stringify(err.body, null, 2);

        res.render('error', parms);

    }

    try {

      const result = await client

      .api('/me/mailfolders')

      .filter("startswith(displayName, 'TASK')")

      .select('id,displayName')

      .get();

      const xapi ="/me/mailfolders('"+result.value[0].id+"')/messages";

      

      //parms.debug = xapi;

      try {

        // Get the 10 newest messages from inbox

        const xresult = await client

        .api(xapi)

        .top(100)

        .header("Prefer", "outlook.body-content-type=\"text\"")

        .select('subject,body,from,receivedDateTime,isRead')

        .orderby('receivedDateTime DESC')

        .get();

  

        //parms.messages = xresult.value;

        parms.messages=JSON.stringify(xresult.value, null, 2);

        // parms.debug = JSON.stringify(parms, null, 2);

        res.render('mail', parms);

      } catch (err) {

        parms.message = 'Error retrieving messages';

        parms.error = { status: `${err.code}: ${err.message}` };

        // parms.debug = JSON.stringify(err.body, null, 2);

        res.render('error', parms);

      }

    } catch (err) {

      parms.message = 'Error retrieving messages';

      parms.error = { status: `${err.code}: ${err.message}` };

      // parms.debug = JSON.stringify(err.body, null, 2);

      res.render('error', parms);

    }

    



    

  } else {  

    // Redirect to home

    res.redirect('/');

  }

});



module.exports = router;
