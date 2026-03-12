import { getUserIds } from "./storage.js";

export { getBookmarksByUser, addBookmark, likeBookmark, copyBookmark, getUserIds };

function getBookmarksByUser(userId) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  return allBookmarks.filter((b) => b.userId === userId);
}

function addBookmark(bookmark) {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  allBookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
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