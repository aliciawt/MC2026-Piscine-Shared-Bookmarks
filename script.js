import { getData, setData, getUserIds } from "./storage.js";

const dropdownUsername = document.getElementById("dropdown-username");

const userIds = getUserIds();

// initialize user 1 with some bookmarks if empty
if (!getData("1")) {
  setData("1", [
    {
      title: "Cool site",
      description: "This is a really cool site",
      url: "https://example.com",
      createdAt: new Date().toISOString(),
      likes: 0
    }
  ]);
}

// populating user dropdown
userIds.forEach((id) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = `User ${id}`;
  dropdownUsername.appendChild(option);
});

dropdownUsername.value = "";

// tracking active user with event listener
let activeUser = null;

dropdownUsername.addEventListener("change", (e) => {
  activeUser = e.target.value;
  displayBookmarks();
})

const bookmarkList = document.getElementById("bookmark-list");

// displaying bookmarks of a certain user
function displayBookmarks() {
  bookmarkList.innerHTML = "<h2>Bookmark List</h2>"; 

  if (!activeUser) return;

  const bookmarks = getData(activeUser) || [];

  if (bookmarks.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No bookmarks yet";
    bookmarkList.appendChild(msg);
    return;
  }
}

// bookmark rendering