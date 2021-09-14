const request = require('postman-request')


const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=a37c55961c8eee949f7331f81922b176&query='+ lat + ','+ long +'&units=m'

    request({url: url, json: true}, (error, {body}) =>{
        if (error) {
            callback('Unable to connect to location service!', undefined)
        } else if(body.error){
            callback('Unable to find locaiton. Try another search', undefined)
        }else{
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently: ' + body.current.temperature + ' degrees out. There is a ' + body.current.precip + '% precipitation chance.')
        }
    })
}

module.exports = forecast