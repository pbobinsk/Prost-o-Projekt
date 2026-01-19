package com.prostoprojekt.notificationservice.messaging;

// Lombok ułatwia życie, generując gettery, settery, etc.
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisteredEvent {
    private String type;
    private String email;
}