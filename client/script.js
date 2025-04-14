const btn = document.querySelector(".generate-btn");
const warning = document.querySelector(".warning");

btn.addEventListener("click", async () => {
  let topic = document.querySelector("#topic").value.trim();
  let platform = document.querySelector("#platform").value;
  let tone = document.querySelector("#tone").value;
  let length = document.querySelector("#length").value;
  if (!topic) {
    warning.style.display = "block";
    return;
  } else {
    warning.style.display = "none";
  }
  console.log(topic, platform, tone, length);
  getData(topic, platform, tone, length);
});

async function getData(topic, platform, tone, length) {
  let response = await axios.post("https://linedropper.onrender.com/generate", {
    topic,
    platform,
    tone,
    length,
  });
  const jsonString = response.data;
  try {
    const parsed = JSON.parse(jsonString);
    console.log(parsed);
    generateContent(parsed);
  } catch (err) {
    console.error("Failed to parse response:", err);
  }
}
function generateContent(data) {
  let { titles, hashtags, description } = data;
  let contentDiv = document.querySelector(".content");
  contentDiv.innerHTML = "";
  contentDiv.innerHTML = `<h1 style="color:#5FB0B7;">Generated Content</h1>`;

  let titleDiv = document.createElement("div");
  titleDiv.classList.add("titles");
  titleDiv.innerHTML = `<h2>Titles</h2>`;
  for (const title of titles) {
    let titleItem = document.createElement("div");
    titleItem.classList.add("title");
    titleItem.innerText = title;
    titleItem.appendChild(createCopyButton(title));
    titleDiv.appendChild(titleItem);
  }

  let hashtagDiv = document.createElement("div");
  hashtagDiv.classList.add("hashtags");
  hashtagDiv.innerHTML = `<h2>Hashtags</h2>`;
  let tagContainer = document.createElement("div");
  tagContainer.classList.add("tag-container");
  for (const hashtag of hashtags) {
    let hashtagItem = document.createElement("span");
    hashtagItem.classList.add("hashtag");
    hashtagItem.innerText = hashtag;
    hashtagItem.appendChild(createCopyButton(hashtag));
    tagContainer.appendChild(hashtagItem);
  }
  hashtagDiv.appendChild(tagContainer);

  let descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("description");
  descriptionDiv.innerHTML = `<h2>Description</h2>`;
  let descriptionItem = document.createElement("div");
  descriptionItem.classList.add("description-text");
  descriptionItem.innerText = description;
  descriptionItem.appendChild(createCopyButton(description));
  descriptionDiv.appendChild(descriptionItem);

  contentDiv.appendChild(titleDiv);
  contentDiv.appendChild(hashtagDiv);
  contentDiv.appendChild(descriptionDiv);
  contentDiv.style.display = "block";
}

function createCopyButton(textToCopy) {
  const copyBtn = document.createElement("button");
  copyBtn.innerText = "📋";
  copyBtn.classList.add("copy-btn");

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(textToCopy);
    copyBtn.innerText = "✅";
    setTimeout(() => (copyBtn.innerText = "📋"), 5000);
  };

  return copyBtn;
}
