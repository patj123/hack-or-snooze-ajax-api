"use strict";

// This is the global list of stories, an instance of StoryList
let storyList;

/** 
 * Get and show stories when the site first loads.
 * This function fetches stories from the server and displays them.
 */
async function getAndShowStoriesOnStart() {
  // Fetch the stories from the server and store in the global storyList variable
  storyList = await StoryList.getStories();

  // Remove the loading message once stories are loaded
  $storiesLoadingMsg.remove();

  // Call the function to display stories on the page
  putStoriesOnPage();
}

/**
 * A render method to generate HTML for an individual Story instance
 * - story: an instance of Story
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // Get the hostname from the story's URL
  const hostName = story.getHostName();

  // Return a jQuery object containing the HTML markup for the story
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

/** 
 * Gets the list of stories from the server, generates their HTML, and adds them to the page.
 * This function loops through all stories in the story list and appends them to the DOM.
 */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  // Clear out the existing stories in the list
  $allStoriesList.empty();

  // Loop through each story in the story list
  for (let story of storyList.stories) {
    // Generate HTML markup for the story
    const $story = generateStoryMarkup(story);

    // Append the story markup to the stories list in the DOM
    $allStoriesList.append($story);
  }

  // Make the stories list visible
  $allStoriesList.show();
}

/** 
 * Handle the submission of the new story form.
 * This function creates a new story and updates the story list.
 */
async function submitNewStory(evt) {
  evt.preventDefault(); // Prevent the default form submission behavior
  console.debug("submitNewStory");

  // Get the data from the new story form fields
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  // Create a new story object with the form data
  const newStoryData = { title, author, url };

  // Use the storyList instance to add the new story, passing the current user
  const newStory = await storyList.addStory(currentUser, newStoryData);

  // Generate HTML for the new story and add it to the top of the stories list
  const $storyMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend($storyMarkup);

  // Hide the new story form and reset its input fields
  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

// Attach an event handler for the submission of the new story form
$newStoryForm.on("submit", submitNewStory);