export async function POST(request) {
    try {
      const gameData = await request.json();
      
      const response = await fetch(`${process.env.API_BASE_URL}/save-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        return Response.json({ success: false }, { status: 400 });
      }
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error saving game:', error);
      return Response.json({ success: false, message: 'Error saving game' }, { status: 500 });
    }
  }