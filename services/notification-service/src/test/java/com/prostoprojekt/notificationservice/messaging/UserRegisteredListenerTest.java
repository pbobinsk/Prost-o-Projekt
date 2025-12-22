package com.prostoprojekt.notificationservice.messaging;

import com.prostoprojekt.notificationservice.mail.MailSender;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;

// Używamy @SpringBootTest, aby Spring stworzył dla nas wszystkie potrzebne beany
@SpringBootTest
class UserRegisteredListenerTest {

    // Wstrzykujemy prawdziwą instancję naszego listenera,
    // którą chcemy przetestować.
    @Autowired
    private UserRegisteredListener listener;

    // Całkowicie zastępujemy prawdziwy MailSender atrapą (mockiem),
    // aby móc weryfikować jego wywołania.
    @MockBean
    private MailSender mailSender;

    @Test
    void handleUserRegistered_shouldCallMailSenderWithCorrectData() {
        // Arrange (Przygotuj)
        // Tworzymy obiekt zdarzenia, który normalnie przyszedłby z kolejki.
        UserRegisteredEvent event = new UserRegisteredEvent("USER_REGISTERED", "direct.call@example.com");

        // Act (Działaj)
        // Wywołujemy metodę naszego listenera BEZPOŚREDNIO.
        // Omijamy całą warstwę RabbitMQ.
        listener.handleUserRegistered(event);

        // Assert (Sprawdź)
        // Weryfikujemy, że mock MailSender został wywołany z poprawnymi argumentami.
        // Nie potrzebujemy już timeoutu, bo wszystko dzieje się natychmiast, w jednym wątku.
        verify(mailSender).sendEmail(
                eq("direct.call@example.com"),
                eq("Witaj w Prost-o-Projekt!"),
                anyString() // W tym teście nie interesuje nas dokładna treść body.
        );
    }
}