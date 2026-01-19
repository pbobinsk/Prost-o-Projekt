package com.prostoprojekt.notificationservice.mail;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

// To jest prosty test jednostkowy, nie wymaga adnotacji Springa
class FakeMailSenderTest {

    @Test
    void sendEmail_shouldLogCorrectInformation() {
        // Arrange (Przygotuj)
        // W tym prostym przypadku nie mamy co przygotowywać,
        // ale dla testów ważne jest zachowanie tej struktury myślenia.
        // Zamiast logów, w prawdziwym teście przechwycilibyśmy standardowe wyjście.
        // Tutaj po prostu sprawdzimy, czy metoda nie rzuca wyjątku.
        MailSender mailSender = new FakeMailSender();
        String to = "test@example.com";
        String subject = "Test Subject";
        String body = "Test Body";

        // Act (Działaj) & Assert (Sprawdź)
        // assertDoesNotThrow sprawdza, czy wykonanie kodu wewnątrz lambdy
        // nie zakończy się żadnym wyjątkiem.
        assertDoesNotThrow(() -> {
            mailSender.sendEmail(to, subject, body);
        }, "Wysyłka maila nie powinna rzucać wyjątków.");

        // W bardziej zaawansowanym scenariuszu, użylibyśmy narzędzi do przechwytywania
        // logów i sprawdzili, czy zawierają one poprawne dane 'to', 'subject' i 'body'.
        // Na tym etapie to w zupełności wystarczy.
    }
}