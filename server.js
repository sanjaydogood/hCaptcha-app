const express = require('express');
const path = require('path');
const {
  verify
} = require('hcaptcha');
const cors = require("cors");
const db = require('./src/assets/db.json');
const {
  connectableObservableDescriptor
} = require('rxjs/internal/observable/ConnectableObservable');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;
const secret = '0x8a185D050c8A08EDf8136ca132F8a7cbF5e6041F';

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/dist/hCaptcha'));
app.use(express.json());
app.use(cors());

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/hCaptcha/index.html'));
});

router.post("/verify-hcaptcha", async function (req, res) {

  const token = req.body.token;
  if (!token) {
    res.status(400).json({
      error: "Token is missing"
    });
  }

  try {
    const {
      success
    } = await verify(secret, token);

    if (success) {
      return res.json({
        success: true
      });
    } else {
      return res.status(400).json({
        error: 'Invalid Captcha'
      });
    }
  } catch (e) {
    return res.status(404).json({
      error: 'There was trouble reaching the server. Try again!'
    });
  }
});

router.post('/sign-in', function (req, res) {

  const {
    username,
    password
  } = req.body;

  const userIndex = db.users.findIndex((user) => user.username === username);
  const doesUserExist = userIndex !== -1 ? true : false;

  console.log(userIndex, doesUserExist);

  if (doesUserExist) {
    if (db.users[userIndex].password === password) {
      return res.json({
        success: true
      });
    }
    return res.json({
      error: 'Incorrect password'
    });
  }

  return res.json({
    error: 'User not found'
  });

});

app.use(router);
app.listen(port, () => console.log(`Server listening on port ${port}`));
