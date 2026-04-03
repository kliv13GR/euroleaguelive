export default async function handler(req, res) {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    // Χρησιμοποιούμε μια υπηρεσία bypass για να προσπεράσουμε το Cloudflare της Euroleague
    const bypassUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(bypassUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Euroleague/Bypass responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Στέλνουμε τα δεδομένα στο site σου
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
