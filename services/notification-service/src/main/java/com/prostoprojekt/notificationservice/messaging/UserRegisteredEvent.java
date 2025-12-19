package com.prostoprojekt.notificationservice.messaging;

// Lombok ułatwia życie, generując gettery, settery, etc.
import lombok.Data;

@Data // Adnotacja Lombok
public class UserRegisteredEvent {
    private String type;
    private String email;
}