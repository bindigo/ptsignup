var req = require("request");
var bigint = require('./ptrsa/BigInt');
var rsa = require('./ptrsa/RSA');
var ptc = require('./ptcounter');

// servers setup
//var regservice = 'http://192.168.3.228:8080/service';
var regservice = 'http://192.168.2.21:8080/service';

var loginservice = 'http://192.168.2.44:3000/ptmindservice/user/login';

var num;
var counter_file = 'counter.json';

// email = email_p1 + num + email_p2
var email_p1 = "pttest_abc";
var email_p2 = "@abc.com";
var email;
var password = "PtTest1234";

var pubkey = {};

// init number
try{
  num = ptc.read_num_sync(counter_file);
} catch (e) {
  num = 10;
}
email = email_p1 + num + email_p2;

// request pubkey for registration
initrsa(regservice, function(err, response, body){
  if (err) {
    console.log(err);
  } else {
    // console.log(response.statusCode, body);

    // do register
    register(function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        console.log(response.statusCode, body);

        ++num;
        ptc.write_num_sync(counter_file, num);

        // try login after registration
        doLogin();
      }
    });
  }
});

// request pubkey for login
function doLogin() {
  initrsa('http://192.168.2.44:3000/ptmindservice/user', function(err, response, body){
    if (err) {
      console.log(err);
    } else {
      // do login
      login(function(err, response, body){
        if (err) {
          console.log(err);
        } else {
          console.log(response.statusCode, body);
        }
      });
    }
  });
}

// step 1: making a get request to get module? and exponent
function initrsa(url, cb) {
  var rsaurl = url + '/RSAPassword';

  req(
    {
      url: rsaurl,
      method: 'GET',
      timeout: 30000
    },
    function(err, response, body) {
      // console.log(err.code === 'ETIMEDOUT');
      // console.log(err.connect === true);
      var rtn = JSON.parse(body);
      pubkey.mod = rtn.content.module;
      pubkey.exp = rtn.content.exponent;
      console.log("Modulus: " + pubkey.mod);
      console.log("Exponent: " + pubkey.exp);

      cb(err, response, body);
    }
  );
}

// step 2: encrypt the password
/**
 * 密码加密
 * @param password
 */
function encrypt(password) {
    bigint.setMaxDigits(130);
    var key = new rsa.RSAKeyPair(pubkey.exp, "", pubkey.mod);
    var result = rsa.encryptedString(key, encodeURIComponent(password));
    return result;
}

// step 3: do the registration
function register(cb) {
  var data = {};
  data.userName = email;
  data.password = encrypt(password);
  data.publicKey = pubkey.mod;
  data.channel = 0;

  var regurl = regservice + '/user/register';

  console.log('registering user: ' + email);

  req(
    {
      url: regurl,
      method: 'POST',
      timeout: 30000,
      json: data // does JSON.stringify(data), also will set header content-type
    },
    function(err, response, body) {
      cb(err, response, body);
    }
  );
}

// step 4: Login to the product
function login(cb) {
  var data = {};
  data.userName = email;
  data.password = encrypt(password);
  data.publicKey = pubkey.mod;
  data.rememberPass = false;

  req({
    url: loginservice,
    method: 'POST',
    timeout: 30000,
    json: data
  }, function(err, response, body) {
    cb(err, response, body);
  });
}

// exit
// process.exit(0);
