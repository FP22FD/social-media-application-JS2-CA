// -----------------------------Posts-------------------------------

async function displayPosts() {
  const response = await fetch(API_BASE + API_POSTS + "?_author=true", {
    headers: {
      Authorization: `Bearer ${load("token")}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  return await response.json();
}

displayPosts().then(console.log);
