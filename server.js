const express = require('express');
const path = require('path');
const {
  verify
} = require('hcaptcha');
const cors = require("cors");
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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/hCaptchaindex.html'));
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

app.use(router);
app.listen(port, () => console.log(`Server listening on port ${port}`));
