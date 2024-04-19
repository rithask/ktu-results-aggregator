const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const examDefIdSchema = new mongoose.Schema({
  batchYear : {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  examDefId: {
    type: [String],
    required: true
  }
})

const allresultsSchema = new mongoose.Schema({
  scheme: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  examDefId: [String]
})

examDefIdSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const AllResults = mongoose.model('AllResults', allresultsSchema)
const ExamDefId = mongoose.model('ExamDefId', examDefIdSchema)

module.exports = { AllResults, ExamDefId }
