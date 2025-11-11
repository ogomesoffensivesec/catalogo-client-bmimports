import sharp from 'sharp';

export default async function handler(req, res) {

  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Parâmetro "url" é obrigatório.' });
  }

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Falha ao buscar a imagem original');
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    const optimizedImage = await sharp(Buffer.from(imageBuffer))
      .rotate()
      .resize({
        width: 500,
        height: 375,
        fit: sharp.fit.inside,
        position: sharp.strategy.attention
      })
      .webp({ quality: 80 })
      .toBuffer();

    res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate');
    res.setHeader('Content-Type', 'image/webp');

    res.status(200).send(optimizedImage);

  } catch (error) {
    console.error('Erro ao otimizar imagem:', error.message);
    res.status(500).json({ error: 'Falha ao processar a imagem.' });
  }
}