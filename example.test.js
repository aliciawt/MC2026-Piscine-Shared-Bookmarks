import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import { getBookmarksByUser, addBookmark, likeBookmark } from "./bookmarks.js";

// --- MOCK LOCALSTORAGE ---
global.localStorage = {
  _store: {},
  getItem(key) { return this._store[key] ?? null; },
  setItem(key, value) { this._store[key] = value; },
  removeItem(key) { delete this._store[key]; },
  clear() { this._store = {}; },
};

// --- SEED USERS WITH BOOKMARKS ---
const usernames = getUserIds();
usernames.forEach((userId, i) => {
  const bm = {
    id: `bm-${i}`,
    userId,
    title: `Bookmark ${i}`,
    description: `Desc ${i}`,
    url: `https://example.com/${i}`,
    createdAt: Date.now() - i * 1000, // descending order
    likes: 0,
  };
  const existing = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  existing.push(bm);
  localStorage.setItem("bookmarks", JSON.stringify(existing));
});

// Check number of users
test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// Check new bookmark assignment per user
const users = getUserIds();
users.forEach((userId) => {
  test(`Last bookmark for user ${userId} has correct userId`, () => {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const userBookmarks = allBookmarks.filter((b) => b.userId === userId);
    const lastBookmark = userBookmarks.slice(-1)[0];

    assert.ok(lastBookmark, `User ${userId} has at least one bookmark`);
    assert.equal(lastBookmark.userId, userId);
  });
});

// Check bookmarks are sorted in reverse chronological order
users.forEach((userId) => {
  test(`Bookmarks for user ${userId} are newest first`, () => {
    const userBookmarks = getBookmarksByUser(userId);
    for (let i = 0; i < userBookmarks.length - 1; i++) {
      assert.ok(
        userBookmarks[i].createdAt >= userBookmarks[i + 1].createdAt,
        `Bookmark at index ${i} is newer than index ${i + 1}`
      );
    }
  });
});

// Check like button counter
test("Like increments correctly", () => {
  const bmTrial = {
    id: "trial-1",
    userId: "1",
    title: "X",
    description: "X",
    url: "X",
    createdAt: Date.now(),
    likes: 0,
  };
  addBookmark(bmTrial);

  let likes = likeBookmark(bmTrial.id);
  assert.equal(likes, 1);
  likes = likeBookmark(bmTrial.id);
  assert.equal(likes, 2);
});