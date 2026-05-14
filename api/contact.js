export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { nombre, email, edificio, telefono, consulta } = req.body;

    if (!nombre || !email || !consulta) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const body =
        `Nueva consulta desde interranova.com\n` +
        `\n` +
        `Nombre:             ${nombre}\n` +
        `Email:              ${email}\n` +
        `Edificio/Dirección: ${edificio || '—'}\n` +
        `Teléfono:           ${telefono || '—'}\n` +
        `Consulta:           ${consulta}\n`;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from:     'consultas@interranova.com',
            to:       'info@interranova.com',
            reply_to: email,
            subject:  'Nueva consulta - Web Interranova',
            text: body
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Error al enviar el email' });
    }

    return res.status(200).json({ ok: true });
}
