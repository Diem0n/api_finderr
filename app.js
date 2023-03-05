import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());

// default route
app.get('/', (req, res) => {
    res.send('index.html' , { root: "public" });
});


// get weather data
app.post('/weather', (req, res) => {
    const city = req.body.city;
    const geocoding = `http://pro.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.API_KEY}`;
    let lat = 0;
    let lon = 0;
    const cnt = 15;
    let weather = `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${process.env.API_KEY}`;
    fetch(geocoding)
    .then(response => {
        if (!response.ok) {
          throw new Error('Geocoding API call failed');
        }
        return response.json();
      })
      .then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
      fetch(weather)
      .then(response => {
        if (!response.ok) {
          throw new Error('Weather API call failed');
        }
        return response.json();
      })
      .then(data => {
        res.send({
          forecast : data['list']
        });
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
    
});
// get recommedation data
app.post('/recommendation', (req, res) => {
    const category = req.body.category;
    const url = 'https://travel-places.p.rapidapi.com/';
    const query = `query{getPlaces(categories:["${category}"], includeGallery: true, limit: 10) 
    { 
       name , 

     }}`;
    const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': `${process.env.API_RAPID_PLACES}`,
          'X-RapidAPI-Host': 'travel-places.p.rapidapi.com'
        },
        body: 
          JSON.stringify({query: query})
      };

    fetch(url, options)
    .then(response => {
        if (!response.ok) {
          throw new Error('Recommendation API call failed');
        }
        return response.json();
      }
    )
    .then(data => {
        res.send({
          data: data
        });
      }
    )
    .catch(err => {
        res.status(500).send(err.message);
      }
    );

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

