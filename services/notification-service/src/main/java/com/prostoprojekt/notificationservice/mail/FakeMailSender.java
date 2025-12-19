package com.prostoprojekt.notificationservice.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component // Oznaczamy jako komponent Springa, aby można go było wstrzyknąć
public class FakeMailSender implements MailSender {

    private static final Logger log = LoggerFactory.getLogger(FakeMailSender.class);

    @Override
    public void sendEmail(String to, String subject, String body) {
        // Zamiast prawdziwej wysyłki, po prostu logujemy wiadomość
        log.info("========================================");
        log.info("Sending fake email...");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("Body: {}", body);
        log.info("Email sent successfully (simulation).");
        log.info("========================================");
    }
}