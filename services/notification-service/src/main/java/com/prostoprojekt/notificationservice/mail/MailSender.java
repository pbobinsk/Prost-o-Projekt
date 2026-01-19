package com.prostoprojekt.notificationservice.mail;


public interface MailSender {
    void sendEmail(String to, String subject, String body);
}
