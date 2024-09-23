import axios from 'axios';

export default async (req, res) => {
  const { code } = req.query; // Captura el código de autorización que Kommo envía a esta ruta

  if (!code) {
    return res.status(400).send("Falta el código de autorización");
  }

  try {
    // Intercambia el código de autorización por el token de acceso
    const tokenResponse = await axios.post('https://www.kommo.com/oauth2/token', {
      client_id: "096949f9-6e78-4203-bda8-038221be4c3a",  // Proporcionado por Kommo
      client_secret: "DO6sTwxsOh6OCqvUYxbVLfdwj0SZUsnwsEbP3hCRtUr16nCqvqIzbmvJJ857y1C0",  // Proporcionado por Kommo
      grant_type: "def50200e077f5e148ad7ac44af24dc3ddd12a0fd92261598c763f0aa67c421b555bf00d961d41c0bb93ed591e0e004abd76023a2d071bbec1f90bd98eb17bffa2fe8b4154f54252782e0464e48227af0a0f2c7bab4d6bdeca4aafe70dd636bac24c9d540c61c674686e88dc7b890b92337869f0c9f35e2888f7e546b29f9c0e4b017552a295857bb4352eabbd2474c32507d433aef72932dc37c7870b27a5bd29c96b8a79b05345541fd084348751f0e526f9eef72ee9936d6713575ede4516712ce0de35f614b4f8cfb32a6a613dce65685a4dc5dd19ccc8b549a89da7f7ecc73c9bc534f8b53e7285ae47ed259e4c97b22a1840f470f1bdb9ffe6ea2cc1e24e808ae0c3b6283bf33d1888ebc72628c4b89746a34877a2d92590511f7033e7f41a0b7e97cb05d441f662c8d377f189b3f95cf75ad1875897da3701e61cf5f65383e99b239902134995f3275b1ea0d2dc02af2824e6d80b65fedd2d71194072322060f6d566e55672eed248aadd8d1e0962820278926b5c8274d51b89b3da24575f7cb7d0b65192170ead568c56a8c0dd62567372c9cfc6235e06d25e9d39ba719c61146b209e9c98e8440561c769e05ad9f161bdee4698e79010cfff9702be8a4611994db568185a1ac3ba2b186be9357eb7b45cac34e95427da2f3e78f75f8a92283279ab6d30ca7cc116f836bf59969ed074b2c5c1a01b5a59f5d91c0694",
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
