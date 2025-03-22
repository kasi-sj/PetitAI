package com.example.PetitAi.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {

        try{
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true); //true is passed so that we can pass the attachment
//        SimpleMailMessage message = new SimpleMailMessage();
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text,true);
        mailSender.send(message);
    }
    catch(Exception e){
        e.getMessage();
    }
    }
}
