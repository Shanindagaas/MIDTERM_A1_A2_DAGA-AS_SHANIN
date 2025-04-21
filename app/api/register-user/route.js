export async function POST(request) {
    try {
      const userData = await request.json();
      
      // Validate student number format
      if (!userData.studentNumber.startsWith('C') || !/^C\d+$/.test(userData.studentNumber)) {
        return Response.json(
          { success: false, message: 'Student number must start with C followed by numbers only' }, 
          { status: 400 }
        );
      }
      
      const response = await fetch(`${process.env.API_BASE_URL}/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return Response.json({ success: false, message: errorData.message || 'Error registering user' }, { status: 400 });
      }
      
      const data = await response.json();
      return Response.json({ success: true, ...data });
    } catch (error) {
      console.error('Error registering user:', error);
      return Response.json({ success: false, message: 'Error registering user' }, { status: 500 });
    }
  }