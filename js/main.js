// js/main.js

let allCities = [];

// JSONを取得
async function fetchCities() {
  const messageEl = document.getElementById("message");
  messageEl.textContent = "おすすめを読み込んでいます...";

  try {
    const res = await fetch("./data/cities.json");
    if (!res.ok) {
      throw new Error("JSONの取得に失敗しました");
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("都市データが空です");
    }

    allCities = data;
    renderRandomCities();
  } catch (err) {
    console.error(err);
    messageEl.textContent = "データの取得に失敗しました。時間をおいて再度お試しください。";
  }
}

// ランダムにn件取得（重複なし）
function pickRandomItems(array, count) {
  const copied = [...array];
  const picked = [];

  const max = Math.min(count, copied.length);

  for (let i = 0; i < max; i++) {
    const randomIndex = Math.floor(Math.random() * copied.length);
    picked.push(copied[randomIndex]);
    copied.splice(randomIndex, 1);
  }

  return picked;
}

// カードを描画
function renderRandomCities() {
  const container = document.getElementById("cards-container");
  const messageEl = document.getElementById("message");

  if (!allCities || allCities.length === 0) {
    messageEl.textContent = "都市データが存在しません。";
    return;
  }

  const selected = pickRandomItems(allCities, 3);

  // 既存カードを削除
  container.innerHTML = "";

  selected.forEach((city) => {
    const card = document.createElement("article");
    card.className = "card";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "card-image-wrapper";

    const img = document.createElement("img");
    img.src = city.image || "";
    img.alt = `${city.city || "都市"} のイメージ`;
    imgWrapper.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";

    const cityLine = document.createElement("div");
    cityLine.className = "card-city-line";

    const cityName = document.createElement("div");
    cityName.className = "card-city";
    cityName.textContent = city.city || "不明な都市";

    const pref = document.createElement("div");
    pref.className = "card-pref";
    pref.textContent = city.prefecture || "";

    body.appendChild(pref);
    body.appendChild(cityName);

    const catchcopy = document.createElement("div");
    catchcopy.className = "card-catchcopy";
    catchcopy.textContent = city.catchcopy || "";
    body.appendChild(catchcopy);

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = city.description || "";
    body.appendChild(desc);

    // タグ
    if (Array.isArray(city.tags) && city.tags.length > 0) {
      const tagsWrapper = document.createElement("div");
      tagsWrapper.className = "card-tags";

      city.tags.forEach((tagText) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `#${tagText}`;
        tagsWrapper.appendChild(tag);
      });

      body.appendChild(tagsWrapper);
    }

    card.appendChild(imgWrapper);
    card.appendChild(body);
    container.appendChild(card);
  });

  messageEl.textContent = "※ 都市は毎回ランダムに選ばれます。";
}

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  fetchCities();

  const reloadBtn = document.getElementById("reload-btn");
  reloadBtn.addEventListener("click", () => {
    if (allCities.length > 0) {
      renderRandomCities();
    } else {
      fetchCities();
    }
  });
});
