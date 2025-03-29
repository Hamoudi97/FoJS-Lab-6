//Simulate Data Fetching Using Promises:

function fetchUserProfile(userId) {
  return new Promise((resolve, reject) => {
    console.log("Fetching user profile.");
    setTimeout(() => {
      if (Math.random() < 0.1) return reject("Failed to fetch user profile.");
      resolve({ id: userId, name: "Ahmed Rahim" });
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) return reject("Failed to fetch user posts.");
      resolve([
        { id: 1, title: "Picture of my Cat", userId },
        { id: 2, title: "Tasty Shawarma", userId },
        { id: 3, title: "Blood Moon", userId },
      ]);
    }, 1200);
  });
}

function fetchComments(postId) {
  return new Promise((resolve) => {
    let commentTemplates = [
      "LOL",
      "That looks good!",
      "I like this!",
      "No Way!",
      "I hate this!",
      "Hmmmmmmmm",
      "Awesome work!",
      "Interesting.",
      "EWWWWWWW!!!",
      "LMAO",
      "WOOOOOWWWWW",
      "OMG",
      "Thats Crazy!",
      "Thats cool.",
    ];

    const comments = Array.from({ length: 3 }, (_, index) => ({
      id: index + 1,
      comment:
        commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
      postId,
    }));

    setTimeout(() => {
      resolve(comments);
    }, 1100);
  });
}

// // Implement Sequential Fetching:

// fetchUserProfile(1)
//   .then((user) => {
//     console.log("User Profile:", user);
//     return fetchUserPosts(user.id);
//   })
//   .then((posts) => {
//     console.log("Posts:", posts);
//     return fetchComments(posts[0].id);
//   })
//   .then((comments) => {
//     console.log("Comments:", comments);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// Implement Sequential Fetching:

async function fetchSequentially(userId) {
  try {
    console.log("Fetching Sequentially");

    let user = await fetchUserProfile(userId);
    console.log("User Profile:", user);

    let posts = await fetchUserPosts(user.id);
    console.log("Posts:", posts);

    console.log("Fetching comments for each post.");
    for (const post of posts) {
      post.comments = await fetchComments(post.id);
      console.log(`Comments for post ${post.id}:`, post.comments);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example

fetchSequentially(1);

async function fetchParallel(userId) {
  try {
    console.log("Fetching user and posts in parallel.");

    let [user, posts] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserPosts(userId),
    ]);

    console.log("User Profile:", user);
    console.log("Posts:", posts);

    let commentsPromises = posts.map((post) => fetchComments(post.id));
    let commentsArray = await Promise.all(commentsPromises);

    posts.forEach((post, index) => (post.comments = commentsArray[index]));

    console.log("This is your user information in parallel:", { user, posts });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example

setTimeout(() => {
  fetchParallel(1);
}, 6000);

// Chaining Async Functions:
async function getUserContent(userId) {
  try {
    let user = await fetchUserProfile(userId);
    console.log("User profile retrieved.");

    let posts = await fetchUserPosts(user.id);
    console.log("Posts retrieved.");

    for (const post of posts) {
      post.comments = await fetchComments(post.id);
      console.log(`Comments for post ${post.id} retrieved.`);
    }

    console.log("This is your user information:", { user, posts });
    return { user, posts };
  } catch (error) {
    console.error("Error retrieving user content:", error);
  }
}

// Example

setTimeout(() => {
  console.log("Chained Fetching");
  getUserContent(1);
}, 11000);
