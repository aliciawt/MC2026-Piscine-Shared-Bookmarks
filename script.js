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

// handle copy button
function copyBookmark(url) {
  navigator.clipboard.writeText(url);
  alert("Link copied!");
}

// handle like button
function likeBookmark(bookmarkId) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const targetBookmark = allBookmarks.find((b) => b.id === bookmarkId);

  if (!targetBookmark) return null;

  targetBookmark.likes++;
  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));

  return targetBookmark.likes;
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

    const titleElement = clone.querySelector(".bookmark-title");
    titleElement.textContent = "";
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.textContent = bookmark.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    titleElement.appendChild(link);

    clone.querySelector(".bookmark-description").textContent =
      bookmark.description;
    clone.querySelector(".bookmark-timestamp").textContent = new Date(
      bookmark.createdAt,
    ).toLocaleString();

    // Copy button
    clone
    .querySelector(".copy-bookmark")
    .addEventListener("click", () => copyBookmark(bookmark.url));

    // Like button
    const likeBtn = clone.querySelector(".like-bookmark");

    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const targetBookmark = allBookmarks.find((b) => b.id === bookmark.id);

    likeBtn.textContent = `Like ❤️ (${targetBookmark.likes})`;

    likeBtn.addEventListener("click", () => {
      const newLikes = likeBookmark(bookmark.id);
      likeBtn.textContent = `Like ❤️ (${newLikes})`;
    });

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
  const clearDesc = descInput.value.trim();

  try {
    new URL(clearUrl);
  } catch {
    alert("Please enter a valid URL (include https:// or http://)");
    return;
  }

  if (clearTitle.length >= 3 && clearDesc.length >= 2) {
    const userId = userDropdown.value;
    const newBookmark = {
      id: crypto.randomUUID(),
      userId,
      title: clearTitle,
      description: clearDesc,
      url: clearUrl,
      createdAt: Date.now(),
      likes: 0,
    };

    addBookmark(newBookmark);
    renderUserBookmarks(userId);
    form.reset();
  } else {
    alert("There's an error please check your input");
  }
});

// Initial load
loadUsers();
renderUserBookmarks(userDropdown.value);
