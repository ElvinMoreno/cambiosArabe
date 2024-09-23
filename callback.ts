import axios from 'axios';

export default async (req, res) => {
  const { code } = req.query; // Captura el código de autorización que Kommo envía a esta ruta

  if (!code) {
    return res.status(400).send("Falta el código de autorización");
  }

  try {
    // Intercambia el código de autorización por el token de acceso
    const tokenResponse = await axios.post('https://www.kommo.com/oauth2/token', {
      client_id: "tu-client-id",  // Proporcionado por Kommo
      client_secret: "tu-client-secret",  // Proporcionado por Kommo
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://cambios-arabe.vercel.app/api/callback"
    });

    const tokenData = tokenResponse.data;

    // Envía el token de vuelta como respuesta
    res.status(200).json(tokenData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al intercambiar el código por token' });
  }
};
