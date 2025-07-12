const nodemailer = require('nodemailer');

class Notificador {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async enviarAlerta(usuario, mensaje) {
        const mailOptions = {
            from: 'Control Financiero UPC <notificaciones@upc.edu.pe>',
            to: usuario.correo,
            subject: '🚨 Alerta Financiera UPC',
            html: `
                <div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #2c3e50;">Hola ${usuario.nombre.split(' ')[0]}!</h2>
                    <p style="font-size: 16px; color: #34495e;">${mensaje}</p>
                    <div style="margin-top: 30px; background-color: #fff; padding: 20px; border-radius: 10px;">
                        <p style="font-size: 14px; color: #7f8c8d;">Mensaje automático - Sistema de Control Financiero UPC</p>
                    </div>
                </div>
            `
        };

        await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new Notificador();
