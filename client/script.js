let btn = document.querySelector(".generate-btn");

btn.addEventListener("click", async () => {
  let topic = document.querySelector("#topic").value.trim();
  let platform = document.querySelector("#platform").value;
  let tone = document.querySelector("#tone").value;
  let length = document.querySelector("#length").value;
  if (!topic) {
    document.querySelector(".warning").style.display = "block";
    if (!existingError) {
      let errorElement = document.createElement("div");
      errorElement.innerHTML = `<p>❗ Please enter a topic</p>`;
      errorElement.classList.add("warning");
      document.querySelector(".main").append(errorElement);
      return;
    }
  } else {
    let existingError = document.querySelector(".warning");
    if (existingError) {
      existingError.remove();
    }
  }

  console.log(topic, platform, tone, length);

  await axios
    .post("http://localhost:5500/generate", {
      topic,
      platform,
      tone,
      length,
    })
    .then((response) => {
      console.log(response.data);
      const jsonString = response.data;

      try {
        const parsed = JSON.parse(jsonString);
        console.log(parsed);
        const { titles, hashtags, description } = parsed;
        let newElement = document.createElement("div");
        document.querySelector(".main").append(newElement);
        newElement.innerHTML = `<h1>Generated Content</h1>`;
      } catch (err) {
        console.error("Failed to parse response:", err);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
