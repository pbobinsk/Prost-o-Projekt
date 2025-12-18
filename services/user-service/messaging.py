# services/user-service/messaging.py
import pika
import json
import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
QUEUE_NAME = "user_registered_queue"

def send_user_registered_message(email: str):
    try:
        # Nawiąż połączenie
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()

        # Upewnij się, że kolejka istnieje (jeśli nie, zostanie utworzona)
        # durable=True oznacza, że kolejka przetrwa restart brokera
        channel.queue_declare(queue=QUEUE_NAME, durable=True)

        # Przygotuj wiadomość
        message = {
            "type": "USER_REGISTERED",
            "email": email
        }

        # Opublikuj wiadomość
        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_NAME,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Uczyń wiadomość trwałą (przetrwa restart brokera)
            ))
        
        print(f" [x] Sent user registration message for {email}")
        connection.close()
    except Exception as e:
        # W prawdziwej aplikacji tutaj powinno być lepsze logowanie i obsługa błędów
        print(f" [!] Error sending message to RabbitMQ: {e}")