import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Email transporter oluştur
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // veya 'outlook', 'yahoo' vs.
      auth: {
        user: process.env.EMAIL_USER, // your-email@gmail.com
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    // Email içeriği
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@bilirinsaat.com.tr', // Alıcı email
      subject: `BLR İnşaat - ${subject}`,
      html: `
        <h3>Yeni İletişim Formu Mesajı</h3>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `
    };

    // Email gönder
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email başarıyla gönderildi!' });
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    res.status(500).json({ message: 'Email gönderilemedi!' });
  }
} 