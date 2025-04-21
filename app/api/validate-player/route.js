export async function GET(request) {
    const url = new URL(request.url);
    const studentNumber = url.searchParams.get('studentNumber');
    
    try {
     const response = await fetch(`${process.env.API_BASE_URL}/validate-player?studentNumber=${studentNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return Response.json({ valid: false }, { status: 400 });
      }
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error validating player:', error);
      return Response.json({ valid: false, message: 'Error validating player' }, { status: 500 });
    }
  }