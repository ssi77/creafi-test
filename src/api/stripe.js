import axios from 'axios'

  const API_BASE_URL = 'http://localhost:8000/api'

  // Chiamata 1: Crea sessione di pagamento Stripe
  export const createCheckoutSession = async (items) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, {
        items: items.map(item => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Converti in centesimi
          },
          quantity: item.quantity,
        })),
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`,
      })
      return response.data
    } catch (error) {
      console.error('Errore creazione sessione:', error)
      throw error
    }
  }

  // Chiamata 2: Verifica stato pagamento
  export const verifyPayment = async (sessionId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-payment`, {
        session_id: sessionId
      })
      return response.data
    } catch (error) {
      console.error('Errore verifica pagamento:', error)
      throw error
    }
  }
