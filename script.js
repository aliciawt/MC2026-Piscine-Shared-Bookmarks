import { getUserIds } from "./storage.js";

function getBookmarksByUser(userId) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  return allBookmarks.filter((b) => b.userId === userId);
}

function addBookmark(bookmark) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  allBookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
}

// Wait for DOM to load

const form = document.getElementById("new-bookmark-form");
const titleInput = document.getElementById("input-bookmark-title");
const descInput = document.getElementById("input-bookmark-description");
const urlInput = document.getElementById("input-url");
const userDropdown = document.getElementById("dropdown-username");
const bookmarkList = document.getElementById("bookmark-list");
const template = document.getElementById("bookmark-template");
const toggleButton = document.querySelector("#create-bookmark-button");
toggleButton.addEventListener("click", () => {
  form.classList.toggle("block");
  toggleButton.textContent = toggleButton.textContent.includes("Add")
    ? "Cancel"
    : "Add Bookmark";
});

//  Load users into dropdown
function loadUsers() {
  const users = getUserIds();
  userDropdown.innerHTML = "";
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = userId;
    userDropdown.appendChild(option);
  });
}

//  Render bookmarks for selected user
function renderUserBookmarks(userId) {
  //Remove old bookmark cards
  bookmarkList
    .querySelectorAll(".bookmark-card, .empty-message")
    .forEach((el) => el.remove());

  const bookmarks = getBookmarksByUser(userId);

  //Sorting Reverse Chronological Order
  bookmarks.sort((a, b) => b.createdAt - a.createdAt);

  if (bookmarks.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No bookmarks yet for this user.";
    p.className = "empty-message";
    bookmarkList.appendChild(p);
    return;
  }

  bookmarks.forEach((bookmark) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".bookmark-title").innerHTML =
      `<a href="${bookmark.url}" class="bookmark-title">${bookmark.title}</a>`;
    clone.querySelector(".bookmark-description").textContent =
      bookmark.description;
    clone.querySelector(".bookmark-timestamp").textContent = new Date(
      bookmark.createdAt,
    ).toLocaleString();

    // Copy button
    const handleCopyButton = () => {
      navigator.clipboard.writeText(bookmark.url);
      alert("Link copied!");
    };
    clone
      .querySelector(".copy-bookmark")
      .addEventListener("click", handleCopyButton);

    // Like button
    const handleLikeBtn = () => {
      const allBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
      const targetBookmark = allBookmarks.find((b) => b.id === bookmark.id);

      if (targetBookmark) {
        targetBookmark.likes++;
        localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
        likeBtn.textContent = ` Like ❤️ (${targetBookmark.likes})`;
      }
    };

    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    const targetBookmark = allBookmarks.find((b) => b.id === bookmark.id);
    const likeBtn = clone.querySelector(".like-bookmark");
    likeBtn.textContent = ` Like  ❤️ (${targetBookmark.likes})`;
    likeBtn.addEventListener("click", handleLikeBtn);

    bookmarkList.appendChild(clone);
  });
}

//  Handle user selection change
userDropdown.addEventListener("change", (e) => {
  renderUserBookmarks(e.target.value);
});

//  Handle adding a new bookmark
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const clearTitle = titleInput.value.trim();
  const clearUrl = urlInput.value.trim();

  try {
    new URL(clearUrl);
  } catch {
    alert("Please enter a valid URL (include https:// or http://)");
    return;
  }

  if (clearTitle.length >= 3) {
    const userId = userDropdown.value;
    const newBookmark = {
      id: crypto.randomUUID(),
      userId,
      title: clearTitle,
      description: descInput.value,
      url: clearUrl,
      createdAt: Date.now(),
      likes: 0,
    };

    addBookmark(newBookmark);
    renderUserBookmarks(userId);
    form.reset();
  } else {
    alert("Please fix your title. Minimum of 3 Character");
  }
});

// Initial load
loadUsers();
renderUserBookmarks(userDropdown.value);
