# Stripe Invoice payment through Element

This repo is a proof of concept of payment of an invoice through Stripe Elements. Once the invoice is succesfully paid, the customer is redirected to a success page where they can download a pdf copy of the invoice. 

## Usage 
* Clone the repo 
* Install dependencies
```
npm install
```
* Copy `.env.sample` to `.env`
* FIn `.env` file, add the values for the following variables: 
  * `STRIPE_SECRET_KEY`: Your Stripe secret key
  * `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
  * `STRIPE_CUSTOMER`: The id of an existing customer (ie.e. `cus_***`). The customer doesn't need to have a payment method or an email address associated
  * `STRIPE_PRICE`: A stripe price for a one off product 
* Run the server
```
npm start
```