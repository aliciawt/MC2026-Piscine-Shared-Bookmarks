import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import { getBookmarksByUser, addBookmark, likeBookmark, copyBookmark } from "./script.js";

// Check number of users
test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// Check new bookmark assignment to new user
describe("New bookmark assignment per user", () => {
  const users = getUserIds();

  users.forEach((userId) => {
    test(`Last bookmark for user ${userId} has correct userId`, () => {
      const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const userBookmarks = allBookmarks.filter(b => b.userId === userId);
      const lastBookmark = userBookmarks.slice(-1)[0];

      assert.ok(lastBookmark, `User ${userId} has at least one bookmark`);
      assert.equal(lastBookmark.userId, userId);
    });
  });
});

// Check sort bookmarks in reverse chronological order
describe("Bookmarks are sorted in reverse chronological order", () => {
  const users = getUserIds();

  users.forEach(userId => {
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
});

// Check like button counter
test("Like increments correctly", () => {
  const bmTrial = { id: "trial-1", userId: "1", title: "X", description: "X", url: "X", createdAt: Date.now(), likes: 0 };
  addBookmark(bmTrial);
  
  let likes = likeBookmark(bmTrial.id);
  assert.equal(likes, 1);
  likes = likeBookmark(bmTrial.id);
  assert.equal(likes, 2);
});