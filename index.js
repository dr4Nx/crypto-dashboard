import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const api_url = "https://pro-api.coinmarketcap.com";

var api_key = process.env.API_KEY || "YOUR_API_KEY";
var ids = ['1'];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var crypto_list_response;

app.get('/', async (req, res) => {
  try {
    const id = req.query.crypto_select || 1;
    const idIndex = ids.indexOf(id);
    if (idIndex !== -1) {
      ids.splice(idIndex, 1);
    }
    ids.unshift(id);
    const content = await axios.get(`${api_url}/v2/cryptocurrency/quotes/latest?id=${ids.join(',')}`, {
      headers: {
      'X-CMC_PRO_API_KEY': api_key
      }
    });
    crypto_list_response = await axios.get(`${api_url}/v1/cryptocurrency/listings/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': api_key
      }
    });
    const crypto_list = crypto_list_response.data.data;
    res.render("index.ejs", { api_key: api_key, id_list: crypto_list, data: content.data.data, ids: ids });
  } catch (err) {
    res.render("index.ejs", { api_key: api_key });
    console.error(err);
  }
});

app.post('/set-api-key', async (req, res) => {
  api_key = req.body.api_key;
  res.redirect('/');
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});