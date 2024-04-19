require('dotenv').config()

const RESULT_URL = 'https://api.ktu.edu.in/ktu-web-service/anon/individualresult'

const PORT = process.env.PORT

module.exports = {
    RESULT_URL,
    PORT
}
