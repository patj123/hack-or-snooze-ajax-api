"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when the site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to generate HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from the server, generates their HTML, and puts them on the page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // Loop through all stories and generate HTML for each one
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle submission of new story form */
async function submitNewStory(evt) {
  evt.preventDefault();
  console.debug("submitNewStory");

  // Get the form data
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  // Create the new story object
  const newStoryData = { title, author, url };

  // Add the story using the current user and storyList instance
  const newStory = await storyList.addStory(currentUser, newStoryData);

  // Generate HTML for the new story and add it to the top of the list
  const $storyMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend($storyMarkup);

  // Hide the new story form and reset its fields
  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

// Attach event handler for the new story form submission
$newStoryForm.on("submit", submitNewStory);

