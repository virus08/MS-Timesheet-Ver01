// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE.txt in the project root for license information.
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');

/* GET /calendar */
router.get('/', async function(req, res, next) {
  let parms = { title: 'Calendar', active: { calendar: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  if (accessToken && userName) {
    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
	//client.DefaultRequestHeaders.Add("Prefer","outlook.timezone=\"SE Asia Standard Time\"");
    // Set start of the calendar view to today at midnight
    // const start = new Date(new Date().setHours(0,0,0));
    // 2018, 10, 1, 0, 0, 0, 0
    const start = new Date(new Date(2018, 12, 1, 0, 0, 0, 0).setHours(0,0,0));
    start.setDate(1);
    // Set end of the calendar view to 7 days from start
    const end = new Date(new Date(start).setDate(start.getDate() + 31));
    try {
      // Get the 10 newest messages from inbox
      const result = await client
      .api('/me/')
	  .headers({"Prefer":"outlook.timezone=\"SE Asia Standard Time\""})
      .get();
      parms.source = 'http://es-timesheet.fuangmali.info:8081'
      parms.AccountName = result.givenName+' '+result.surname;
      parms.UID= result.id
      //parms.debug = JSON.stringify(parms,null,2);
      //res.render('timesheet', parms);
      } catch (err) {
        parms.message = 'Error retrieving messages';
        parms.error = { status: `${err.code}: ${err.message}` };
        parms.debug = JSON.stringify(err.body, null, 2);
        res.render('error', parms);
    }
    try {
      // Get the first 10 events for the coming week
      const result = await client
      .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
      //.header("Prefer","outlook.body-content-type=\"text\"")
	  //.headers({"Prefer":"outlook.body-content-type=\"text\""},{"Prefer":"outlook.timezone=\"SE Asia Standard Time\""})
	  .headers({"Prefer":"outlook.body-content-type=\"text\""})
	  
      .top(100)
      .select('id,subject,body,start,end')
      .orderby('start/dateTime ASC')
      .get();

      parms.events = JSON.stringify(result.value, null, 2);
      //parms.debug = JSON.stringify(parms, null, 2);
      res.render('calendar', parms);
    } catch (err) {
      parms.message = 'Error retrieving events';
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
