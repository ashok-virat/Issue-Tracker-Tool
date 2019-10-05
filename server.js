  
const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const publicPath = path.join(__dirname, '..', 'Issue-Tracker-Tool/dist/issue-tracker');
const proxy = require('http-proxy-middleware');

/**
 * INITIALIZE EXPRESS APP
 */
const app = express();



/**
 * SET PORT
 */
const _port = process.env.PORT || 4003;

/**
 * SET PROXY TO DEV SERVER
 */


app.use('/api', proxy({target: 'http://localhost:4001', changeOrigin: true}));



/**
 * SET STATIC FILE FOLDERS
 */
app.use(express.static(publicPath));


/**
 * FALLBACK ROUTES REDIRECT TO REACT ROUTER
 */
app.get('*', (req, res)=>{
    return res.sendFile(path.join(publicPath, 'index.html'));
});


/**
 * START THE SERVER
 */
app.listen(_port,()=>{
    console.log(`server listening on port ${_port}`)
})

