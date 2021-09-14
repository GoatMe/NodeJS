const path = require('path')
const express =  require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { request } = require('http')
const { resolveObjectURL } = require('buffer')
 
const app = express()
const port = process.env.PORT || 3000  //use heroku port or default port if run locally

const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPAth = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Define paths for Express config
app.set('view engine', 'hbs') //sets handlebars to be used
app.set('views', viewsPAth) //changed Dir from 'views => 'tempaltes
hbs.registerPartials(partialsPath)

// setup static Dir to server
app.use(express.static(publicDirectoryPath))

//Express Route handelers
app.get('', (req,res) =>{
    res.render('index', {
        title: 'Weather App',
        name: 'AAAA'
    })
})
app.get('/about', (req,res) =>{
    res.render('about',{
        title: 'About',
        name: 'AAAA'
    })
})
app.get('/help',(req,res) =>{
    res.render('help',{
        title: 'Help',
        name: 'AAAA',
        hMessage: 'You seek help, MORTAL!'
    })
})

app.get('/weather', (req, res) =>{
if (!req.query.address) {
    return res.send({
        error: 'You must provide an Address!',
        
    })
}
    console.log(req.query.address)

    geocode(req.query.address, (error, {latitude, longitude, location} ={}) =>{
        if (error) {
            return res.send({ error})
        }

        forecast(latitude, longitude, (error, forecastData) =>{
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
})

app.get('/products', (req, res) =>{
   if (!req.query.search) {
      return res.send({
           error: 'Provide search term'
       })
   }

   res.send({
       products: []
   })
})

app.get('/help/*', (req,res) =>{
    res.render('404Page', {
        title: 'Help Article not found'
    })
})

//everything else
app.get('*',(req, res) =>{
    res.render('404Page', {
        title: 'Page 404'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})