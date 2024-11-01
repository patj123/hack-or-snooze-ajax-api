"use strict";

// Global variable to hold the list of stories as an instance of StoryList
let storyList;

/**
 * Fetch and display stories when the site loads for the first time.
 * This function initializes the story list and populates it in the DOM.
 */
async function getAndDisplayStoriesOnLoad() {
  // Retrieve stories from the API and assign them to the global variable
  storyList = await StoryList.getStories();

  // Remove the loading message after stories are fetched
  $storiesLoadingMsg.remove();

  // Call the function to render and display stories
  renderStoriesOnPage();
}

/**
 * Generates the HTML for a single story and returns it.
 * - story: an instance of Story
 * - showDeleteBtn: whether to show a delete button
 * Returns the HTML markup wrapped in a jQuery object.
 */
function createStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("createStoryMarkup", story);

  // Extract the hostname from the story URL
  const hostName = story.getHostName();

  // Check if the current user is logged in to display the favorite star
  const showStarIcon = Boolean(currentUser);

  // Construct and return the story HTML markup
  return $(`
    <li id="${story.storyId}">
      <div>
        ${showDeleteBtn ? generateDeleteButtonHTML() : ""}
        ${showStarIcon ? generateStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
      </div>
    </li>
  `);
}

/**
 * Create the HTML for a delete button and return it as a string.
 */
function generateDeleteButtonHTML() {
  return `
    <span class="delete-icon">
      <i class="fas fa-trash"></i>
    </span>`;
}

/**
 * Create the HTML for a favorite or not favorite star icon.
 * - story: the Story instance
 * - user: the current User instance
 */
function generateStarHTML(story, user) {
  const isFavorited = user.isFavorite(story);
  const starClass = isFavorited ? "fas" : "far";
  return `
    <span class="favorite-star">
      <i class="${starClass} fa-star"></i>
    </span>`;
}

/**
 * Render and display the list of stories on the page.
 * This function clears the current stories and adds the fetched stories to the DOM.
 */
function renderStoriesOnPage() {
  console.debug("renderStoriesOnPage");

  // Clear the existing stories from the DOM
  $allStoriesList.empty();

  // Iterate over the list of stories and generate HTML for each one
  for (let story of storyList.stories) {
    const $storyMarkup = createStoryMarkup(story);
    $allStoriesList.append($storyMarkup);
  }

  // Show the updated list of stories
  $allStoriesList.show();
}

/**
 * Handle the event for submitting a new story.
 * This function adds a new story and updates the DOM accordingly.
 */
async function handleStorySubmission(evt) {
  evt.preventDefault(); // Prevent the default form submission
  console.debug("handleStorySubmission");

  // Collect story details from the form fields
  const title = $("#create-title").val();
  const author = $("#create-author").val();
  const url = $("#create-url").val();

  // Construct a new story object with the form data
  const storyData = { title, author, url };

  // Add the story using the StoryList instance and current user
  const addedStory = await storyList.addStory(currentUser, storyData);

  // Generate the HTML for the new story and add it to the list
  const $storyHTML = createStoryMarkup(addedStory);
  $allStoriesList.prepend($storyHTML);

  // Hide and reset the story form after submission
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

// Attach an event listener to handle story form submissions
$submitForm.on("submit", handleStorySubmission);