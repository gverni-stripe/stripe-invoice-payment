document.querySelector('#payment-form').addEventListener('submit', handleSubmit)

// Fetches a payment intent and captures the client secret
async function initializePaymentElement(clientSecret) {
  const appearance = {
    theme: 'stripe',
  }
  elements = stripe.elements({ appearance, clientSecret, loader: 'always' })

  const paymentElement = elements.create('payment')
  paymentElement.on('ready', () => {
    setLoading(false)
    document.getElementById('create-btn').style.display = 'none'
  })
  paymentElement.mount('#payment-element')
}

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: window.location.origin + '/invoices-list.html',
    },
  })

  if (error.type === 'card_error' || error.type === 'validation_error') {
    showMessage(error.message)
  } else {
    showMessage('An unexpected error occured.')
  }

  setLoading(false)
}

document.getElementById('create-btn').addEventListener('click', (e) => {
  setLoading(true)
  fetch('/stripe/create-invoice', {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((resJson) => {
      document.getElementById('payment-form').style.display = 'inherit'
      initializePaymentElement(resJson.payment_intent.client_secret)
    })
    .catch((err) => {
      console.error(err)
    })
})

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector('#payment-message')

  messageContainer.classList.remove('hidden')
  messageContainer.textContent = messageText

  setTimeout(function () {
    messageContainer.classList.add('hidden')
    messageText.textContent = ''
  }, 4000)
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector('#submit').disabled = true
    document.querySelector('#spinner').classList.remove('hidden')
    document.querySelector('#button-text').classList.add('hidden')
  } else {
    document.querySelector('#submit').disabled = false
    document.querySelector('#spinner').classList.add('hidden')
    document.querySelector('#button-text').classList.remove('hidden')
  }
}
