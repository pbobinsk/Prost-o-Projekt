package com.prostoprojekt.notificationservice.messaging;

import com.prostoprojekt.notificationservice.mail.MailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
// Nie potrzebujemy już importu ObjectMapper!

@Service
public class UserRegisteredListener {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredListener.class);
    public static final String QUEUE_NAME = "user_registered_queue";

    private final MailSender mailSender;

    // Konstruktor jest teraz znacznie prostszy!
    public UserRegisteredListener(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    // ZMIANA JEST TUTAJ:
    // Metoda przyjmuje bezpośrednio zmapowany obiekt UserRegisteredEvent,
    // a nie surowy String z JSON-em.
    @RabbitListener(queues = QUEUE_NAME)
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("Received fully mapped event from queue {}: {}", QUEUE_NAME, event);

        try {
            String email = event.getEmail();
            String subject = "Witaj w Prost-o-Projekt!";
            String body = "Cześć! Dziękujemy za rejestrację w naszym systemie.";

            mailSender.sendEmail(email, subject, body);

        } catch (Exception e) {
            log.error("Failed to process event: {}", event, e);
        }
    }
}