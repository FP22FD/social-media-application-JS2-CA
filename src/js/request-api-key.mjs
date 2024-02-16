// -------------------function to request API key | Made with Postman ----------------------

async function requestAPIKey() {
  const response = await fetch(API_BASE + API_AUTH + API_KEY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${load("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Tester key",
    }),
  });

  if (response.ok) {
    return await response.json();
  }
  console.error(await response.json());
  throw new Error("Could not register for an API key!");
}

requestAPIKey().then(console.log);
