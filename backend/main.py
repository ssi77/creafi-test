from fastapi import FastAPI, HTTPException
  from fastapi.middleware.cors import CORSMiddleware
  from pydantic import BaseModel
  from typing import List
  import stripe
  import os
  from dotenv import load_dotenv

  # Carica variabili d'ambiente
  load_dotenv()

  # Configura Stripe
  stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_your_stripe_secret_key")

  # Inizializza FastAPI
  app = FastAPI()

  # Configura CORS
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )

  # Modelli Pydantic
  class PriceData(BaseModel):
      currency: str
      product_data: dict
      unit_amount: int

  class LineItem(BaseModel):
      price_data: PriceData
      quantity: int

  class CheckoutSessionRequest(BaseModel):
      items: List[LineItem]
      success_url: str
      cancel_url: str

  class VerifyPaymentRequest(BaseModel):
      session_id: str

  # Root endpoint
  @app.get("/")
  async def root():
      return {"message": "TechStore API - FastAPI Backend"}

  # Endpoint 1: Crea sessione di checkout Stripe
  @app.post("/api/create-checkout-session")
  async def create_checkout_session(request: CheckoutSessionRequest):
      try:
          # Crea la sessione di checkout Stripe
          session = stripe.checkout.Session.create(
              payment_method_types=['card'],
              line_items=[
                  {
                      'price_data': {
                          'currency': item.price_data.currency,
                          'product_data': item.price_data.product_data,
                          'unit_amount': item.price_data.unit_amount,
                      },
                      'quantity': item.quantity,
                  }
                  for item in request.items
              ],
              mode='payment',
              success_url=request.success_url,
              cancel_url=request.cancel_url,
          )
          
          return {
              "url": session.url,
              "session_id": session.id
          }
      
      except stripe.error.StripeError as e:
          raise HTTPException(status_code=400, detail=str(e))
      except Exception as e:
          raise HTTPException(status_code=500, detail=str(e))

  # Endpoint 2: Verifica stato pagamento
  @app.post("/api/verify-payment")
  async def verify_payment(request: VerifyPaymentRequest):
      try:
          # Recupera la sessione da Stripe
          session = stripe.checkout.Session.retrieve(request.session_id)
          
          return {
              "payment_status": session.payment_status,
              "payment_intent": session.payment_intent,
              "amount_total": session.amount_total,
              "currency": session.currency,
              "customer_email": session.customer_details.email if session.customer_details else None,
              "status": "success" if session.payment_status == "paid" else "pending"
          }
      
      except stripe.error.StripeError as e:
          raise HTTPException(status_code=400, detail=str(e))
      except Exception as e:
          raise HTTPException(status_code=500, detail=str(e))

  # Health check endpoint
  @app.get("/api/health")
  async def health_check():
      return {"status": "healthy", "service": "TechStore API"}

  if __name__ == "__main__":
      import uvicorn
      uvicorn.run(app, host="0.0.0.0", port=8000)
