package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}") private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendLoanConfirmation(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Confirmación de préstamo de " + dp.getEquipo().getNombreEquipo());
        msg.setText("Tu préstamo ha sido registrado.\n" +
                "Fecha devolución: " + dp.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        mailSender.send(msg);
    }

    public void sendAdminNotification(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("admin@tuorg.com");
        msg.setSubject("Nuevo préstamo registrado");
        msg.setText("Se ha registrado un préstamo de equipo “" +
                dp.getEquipo().getNombreEquipo() + "” por " + dp.getCodigoUsuario() +
                ". Devolución: " + dp.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        mailSender.send(msg);
    }

    public void sendReturnReminder(DetallePrestamo dp, long amount, ChronoUnit unit) {
        String unitName = unit == ChronoUnit.MINUTES ? "minutos" : "horas";

        String formattedFechaFin = dp.getFechaFin()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");  // enviarlo al usuario real
        msg.setSubject("Recordatorio de devolución en " + amount + " " + unitName);
        msg.setText("Hola " + dp.getCodigoUsuario() + ",\n\n"
                + "Tu préstamo de “" + dp.getEquipo().getNombreEquipo() + "” vence el "
                + formattedFechaFin + ".\n\n"
                + "Un saludo,\nTu App de Préstamos");

        mailSender.send(msg);
    }

    public void sendLoanRejection(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");  // o donde quieras enviar
        msg.setSubject("Solicitud de préstamo rechazada");
        msg.setText("Hola " + dp.getCodigoUsuario() + ",\n\n"
                + "Lo sentimos, tu solicitud de préstamo del equipo “"
                + dp.getEquipo().getNombreEquipo()
                + "” ha sido rechazada.\n\n"
                + "Si necesitas más información, contacta con el administrador.\n\n"
                + "Saludos,\n"
                + "Tu App de Préstamos");
        mailSender.send(msg);
    }
}
