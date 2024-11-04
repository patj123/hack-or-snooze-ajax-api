"use strict";

// Store commonly used DOM elements to avoid repeated selections
const $body = $("body"); // Main body of the document

const $storiesLoadingMsg = $("#stories-loading-msg"); // Message shown while stories are loading
const $allStoriesList = $("#all-stories-list"); // Container for all story items
const $favoritedStories = $("#favorited-stories"); // Container for favorited stories
const $ownStories = $("#my-stories"); // Container for user's own stories
const $storiesContainer = $("#stories-container"); // Main container for all story sections

// A selector for accessing all three story lists collectively
const $storiesLists = $(".stories-list");

const $loginForm = $("#login-form"); // Form for logging in
const $signupForm = $("#signup-form"); // Form for signing up

const $submitForm = $("#submit-form"); // Form for submitting new stories

// Navbar elements for navigation and user interactions
const $navSubmitStory = $("#nav-submit-story"); // Link for submitting a new story
const $navLogin = $("#nav-login"); // Link to open login form
const $navUserProfile = $("#nav-user-profile"); // Link to view user profile
const $navLogOut = $("#nav-logout"); // Link to log out of the account

const $userProfile = $("#user-profile"); // User profile section

// Global variable to hold the current user
let currentUser;

/**
 * Hides all page elements to reset the view.
 * This function is helpful for displaying specific components (like forms or story lists)
 * without overlap from previously shown content.
 */
function hidePageComponents() {
  const components = [
    $storiesLists, // Hide all story lists
    $submitForm, // Hide the new story form
    $loginForm, // Hide the login form
    $signupForm, // Hide the signup form
    $userProfile, // Hide the user profile
  ];
  // Loop through each component and hide it
  components.forEach(component => component.hide());
}

/**
 * Fetch and display stories when the site loads for the first time.
 * This function initializes the story list and populates it in the DOM.
 */
async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart");

  // Retrieve stories from the API and assign them to the global variable
  storyList = await StoryList.getStories();

  // Remove the loading message after stories are fetched
  $storiesLoadingMsg.remove();

  // Render and display the list of stories in the DOM
  renderStoriesOnPage();
}

/**
 * Check for remembered user in localStorage and log them in if present.
 * This function retrieves the stored token and username and attempts to log the user in.
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");

  // Get the token and username from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // If there are no stored credentials, return early
  if (!token || !username) return false;

  // Attempt to log in with the stored credentials
  currentUser = await User.loginViaStoredCredentials(token, username);

  // If the login fails, currentUser will be null
  if (!currentUser) return false;
}

/**
 * Initializes the app by loading user data and fetching stories.
 * Called when the DOM is fully loaded to set up the initial UI and data.
 */
async function start() {
  console.debug("start");

  // Check if there's a saved user in localStorage and log them in if present
  await checkForRememberedUser();
  // Load and display stories on the homepage
  await getAndShowStoriesOnStart();

  // If a user is logged in, update the UI to reflect their status
  if (currentUser) updateUIOnUserLogin();
}

/**
 * Event listener for the "submit" link in the navigation bar.
 * When clicked, it hides other page components and shows the form
 * for adding a new story.
 */
$navSubmitStory.on("click", function () {
  console.debug("Submit story link clicked");
  hidePageComponents(); // Hide everything else
  $submitForm.show(); // Display the story submission form
});

/**
 * This message serves as a reminder for enabling "Verbose" logs in the console.
 * Helpful debug information will be shown if the correct logging level is set.
 */
console.warn("STUDENT REMINDER: This app logs detailed debug messages." +
  " If you don't see the 'start' message, ensure you have 'Verbose' logging enabled" +
  " in your browser's console under 'Default Levels'.");

$(start); // Calls the start function when the DOM is ready