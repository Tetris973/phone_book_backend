const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)

  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    validate: {
      validator: function (v) {
        return /^(0\d{1,2}-\d{7,})$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! A phone number must have a length of 8 or more and be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers. Eg. 09-1234556 and 040-22334455 are valid phone numbers.`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
