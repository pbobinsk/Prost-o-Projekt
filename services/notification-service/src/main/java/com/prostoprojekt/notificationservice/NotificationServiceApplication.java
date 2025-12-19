package com.prostoprojekt.notificationservice;

import com.prostoprojekt.notificationservice.messaging.UserRegisteredListener;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

    /**
     * Ten bean mówi Springowi, aby automatycznie konwertował przychodzące
     * wiadomości z formatu JSON na obiekty Javy.
     * Mimo że jest oznaczony jako przestarzały, ten mechanizm wciąż działa
     * w obecnych wersjach Spring Boot i jest najprostszym sposobem
     * na włączenie globalnej konwersji JSON dla RabbitMQ.
     */
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Queue userRegisteredQueue() {
        // Nazwa kolejki, durable = true (przetrwa restart brokera)
        return new Queue(UserRegisteredListener.QUEUE_NAME, true);
    }
}