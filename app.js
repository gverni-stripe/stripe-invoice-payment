var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const stripeRouter = require('./routes/stripe-invoice')

var app = express()

app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Stripe functions 
app.use('/stripe', stripeRouter)

app.get('/', (req, res) => {
  res.render('new-invoice', {
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log(err)
  // render the error page
  res.status(err.status || 500)
  res.send('error')
})



module.exports = app
