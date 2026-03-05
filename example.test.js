import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import { getBookmarksByUser, addBookmark } from "./script.js";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

describe("New bookmark assignment per user", () => {
  const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  const users = getUserIds();

  users.forEach((userId) => {
    test(`Last bookmark for user ${userId} has correct userId`, () => {
      const userBookmarks = allBookmarks.filter(b => b.userId === userId);
      const lastBookmark = userBookmarks.slice(-1)[0];

      assert.ok(lastBookmark, `User ${userId} has at least one bookmark`);

      assert.equal(lastBookmark.userId, userId);
    });
  });
});