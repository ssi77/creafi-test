# TechStore Backend API

  Backend FastAPI per l'e-commerce di smartphone con integrazione Stripe.

  ## Setup Locale

  1. Installa le dipendenze:
  ```bash
  pip install -r requirements.txt
  ```

  2. Crea un file `.env` basato su `.env.example` e aggiungi le tue chiavi Stripe:
  ```bash
  cp .env.example .env
  ```

  3. Avvia il server:
  ```bash
  uvicorn main:app --reload
  ```

  Il server sarà disponibile su `http://localhost:8000`

  ## Deploy su Render

  1. Crea un nuovo Web Service su Render
  2. Connetti il tuo repository GitHub
  3. Usa le seguenti configurazioni:
     - Environment: Python
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  4. Aggiungi la variabile d'ambiente `STRIPE_SECRET_KEY` nelle impostazioni

  ## Endpoints API

  - `POST /api/create-checkout-session` - Crea una sessione di pagamento Stripe
  - `POST /api/verify-payment` - Verifica lo stato di un pagamento
  - `GET /api/health` - Health check dell'API

  ## Test con cURL

  ### Crea sessione di checkout:
  ```bash
  curl -X POST http://localhost:8000/api/create-checkout-session \
    -H "Content-Type: application/json" \
    -d '{
      "items": [{
        "price_data": {
          "currency": "eur",
          "product_data": {
            "name": "iPhone 15 Pro",
            "images": ["https://example.com/image.jpg"]
          },
          "unit_amount": 119900
        },
        "quantity": 1
      }],
      "success_url": "http://localhost:5173/success",
      "cancel_url": "http://localhost:5173/cancel"
    }'
  ```

  ### Verifica pagamento:
  ```bash
  curl -X POST http://localhost:8000/api/verify-payment \
    -H "Content-Type: application/json" \
    -d '{
      "session_id": "cs_test_..."
    }'
  ```
