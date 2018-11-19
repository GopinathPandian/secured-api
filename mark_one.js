var express = require('express');
var http = require('http');
var app = express();
var jwt    = require('jsonwebtoken');

var secret = "BrickbyBrick";
var port = process.env.PORT || 8080;
// const key = "2b7e151628aed2a6abf7158809cf4f3c"
app.use(express.static('.'));
http.createServer(app).listen(port);
console.log('Server listening at port ', port);
app.set('Secret', secret);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const  ProtectedRoutes = express.Router(); 
app.use('/api', ProtectedRoutes);

var user = {
    first_name: 'Designer',
    last_name: 'MicroApps',
    password : 'designer@123'
};
app.post('/getToken', function(req, res){
    console.log(`Requested METHOD:${req.method} URL:${req.url} BODY:${JSON.stringify(req.body)}`);
    if (user.password === req.body.password){
        console.log(`User Authentication Successfull for user:${req.body.email_id}`);
        let token = jwt.sign(req.body, app.get('Secret'), {
            expiresIn: '24h' // expires in 1 hour
        });
        res.status(200).json({
            first_name: user.first_name,
            last_name:  user.last_name,
            access_token: token
        });
    } else{
        console.log(`Authentication failed for user:${user.first_name}`);
        res.status(401).send("Authentication failed!!");
    }

});

ProtectedRoutes.use((req, res, next) =>{
    // check header or url parameters or post parameters for token
    var token = req.headers['access-token'];
  
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes    
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({ 
          message: 'Access token not found!!' 
      });
  
    }
});

ProtectedRoutes.get('/getXML', (req, res)=>{
    console.log(JSON.stringify(req.headers));
    xml_res = '<accountLookupResults> \
<status>success</status> \
<variables> \
    <variable name="IsMatch" value="N"/> \
    <variable name="DigitalIDStatus" value="12345678:active,87654321:barred"/> \
    <variable name="DigitalIDCount" value="2"/> \
    <variable name="ActiveDigitalIDCount" value="1"/> \
    <variable name="WSResult" value="success"/> \
</variables> \
</accountLookupResults>'

    res.set('Content-Type', 'text/xml');
    res.send(xml_res);
    res.status(200).send();
});

ProtectedRoutes.get('/getJson', (req, res)=>{
    console.log(JSON.stringify(req.headers));
    res.status(200).json({"DigitalIDStatus":"999999:active,111111:barred","DigitalIDCount": "2"});
});

app.get('/getXml', (req, res)=>{
    console.log(JSON.stringify(req.headers));
    console.log(JSON.stringify(req.body));
    xml_res = '<accountLookupResults> \
<status>success</status> \
<variables> \
    <variable name="IsMatch" value="N"/> \
    <variable name="DigitalIDStatus" value="12345678:active,87654321:barred"/> \
    <variable name="DigitalIDCount" value="2"/> \
    <variable name="ActiveDigitalIDCount" value="1"/> \
    <variable name="WSResult" value="success"/> \
</variables> \
</accountLookupResults>'

    res.set('Content-Type', 'application/xml');
    res.send(xml_res);
    res.status(200).send();
});
