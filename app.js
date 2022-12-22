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
    express.static('public' , {index: 'index.html'});

});


// get weather data
app.post('/weather/:city', (req, res) => {
    const city = req.params.city;
    const geocoding = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.API_KEY}`;
    const weather =  `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${process.env.API_KEY}`;
    let lat = 0;
    let lon = 0;
    fetch(geocoding)
        .then(response => {
            return response.json();
        }
        )
        .then(data => {
            lat = data[0].lat;
            lon = data[0].lon;
           
            
        }
        )
        .catch(err => {
            res.send(err)
        }
        );
    fetch(weather)
        .then(response => {
            return response.json();
        }
        )
        .then(data => {
            res.send({
                temp: Math.round(  273.15 - data.main.temp),
                feels_like: Math.round(  273.15 - data.main.feels_like),
                temp_min: Math.round(  273.15 - data.main.temp_min),
                temp_max: Math.round(  273.15 - data.main.temp_max),
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                weather: data.weather[0].main,
                description: data.weather[0].description,
            });
        }
        )
        .catch(err => {
            res.send('Shit went sideways');
        }   
        );

    
    
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

