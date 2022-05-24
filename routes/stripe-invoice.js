var express = require('express')
var router = express.Router()
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const CUSTOMER = process.env.STRIPE_CUSTOMER
const PRICE = process.env.STRIPE_PRICE // One off price

const createInvoice = async function () {
  // Create an Invoice Item with the Price, and Customer you want to charge
  const invoiceItem = await stripe.invoiceItems.create({
    // You can create an invoice item after the invoice
    customer: CUSTOMER,
    price: PRICE,
  })

  // Create an Invoice
  const invoice = await stripe.invoices.create({
    customer: CUSTOMER,
  })

  // Finalise the Invoice
  return await stripe.invoices.finalizeInvoice(invoice.id, {
    expand: ['payment_intent'],
  })
}

router.post('/create-invoice', function (req, res, next) {
  createInvoice()
    .then((invoice) => res.send(invoice))
    .catch((error) => {
      console.log(error)
      res.send(error)
    })
})

router.get('/list-invoices', function (req, res, next) {
  stripe.invoices
    .list({
      customer: req.query.customer || CUSTOMER,
      limit: 100,
    })
    .then((list) => {
      res.send(list.data)
    })
    .catch((err) => {
      res.status(500)
      res.send(err)
    })
})

module.exports = router
