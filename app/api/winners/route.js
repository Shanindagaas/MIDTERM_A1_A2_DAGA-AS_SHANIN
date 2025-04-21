export async function GET(request) {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';
    
    try {
      let apiUrl = `${process.env.API_BASE_URL}/games`;
      if (startDate && endDate) {
        apiUrl += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return Response.json([], { status: 400 });
      }
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Error fetching games:', error);
      return Response.json([], { status: 500 });
    }
  }