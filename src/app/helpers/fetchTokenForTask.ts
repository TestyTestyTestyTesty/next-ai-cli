export const fetchTokenForTask = async (taskName: string) => {
  try {
    const response = await fetch('http://localhost:3000/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskName }),
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.log(error);
  }
};
