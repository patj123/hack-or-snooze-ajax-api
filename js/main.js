"use strict"; // Strict mode to catch common coding errors

// Cache frequently accessed DOM elements to improve efficiency
const $body = $("body"); // The main body of the document

const $storiesLoadingMsg = $("#stories-loading-msg"); // Message shown while stories load
const $allStoriesList = $("#all-stories-list"); // Container for displaying all stories
const $favoritedStories = $("#favorited-stories"); // Container for displaying favorited stories
const $ownStories = $("#my-stories"); // Container for user's own stories
const $storiesContainer = $("#stories-container"); // Main container for story-related content

const $storiesLists = $(".stories-list"); // Selector to access all story lists

const $loginForm = $("#login-form"); // Form for user login
const $signupForm = $("#signup-form"); // Form for user signup
const $submitForm = $("#submit-form"); // Form for submitting new stories

// Navbar elements for navigation and user interactions
const $navSubmitStory = $("#nav-submit-story"); // Link for submitting a new story
const $navLogin = $("#nav-login"); // Link to open login form
const $navUserProfile = $("#nav-user-profile"); // Link to view user profile
const $navLogOut = $("#nav-logout"); // Link to log out

const $userProfile = $("#user-profile"); // User profile section

// Global variable to hold the instance of the current user
let currentUser;

/**
 * Hides all main page components to reset the view. This function is useful
 * when switching between different sections, as it hides previously shown elements.
 */
function hidePageComponents() {
  // List of components to be hidden
  const components = [
    $storiesLists, // Hides all story lists
    $submitForm, // Hides the new story submission form
    $loginForm, // Hides the login form
    $signupForm, // Hides the signup form
    $userProfile // Hides the user profile section
  ];
  components.forEach(component => component.hide()); // Hides each component
}

/**
 * Fetches stories from the API and displays them on initial page load.
 * This function initializes the story list and adds them to the DOM.
 */
async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart"); // Debug log for function call

  // Fetch the stories from the API and assign them to the global storyList variable
  storyList = await StoryList.getStories();

  // Remove the loading message once stories are fetched
  $storiesLoadingMsg.remove();

  // Render the stories and display them on the page
  renderStoriesOnPage();
}

/**
 * Checks for a remembered user in localStorage and logs them in if credentials are found.
 * This function retrieves any stored user token and username, and attempts to log them in.
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser"); // Debug log for function call

  // Retrieve token and username from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // If either token or username is missing, stop here
  if (!token || !username) return false;

  // Log in using stored credentials and set currentUser if successful
  currentUser = await User.loginViaStoredCredentials(token, username);

  // If login fails, currentUser remains null
  if (!currentUser) return false;
}

/**
 * Initializes the app by checking for a logged-in user and loading stories.
 * This function runs once when the DOM is fully loaded.
 */
async function start() {
  console.debug("start"); // Debug log for app start

  // Check if a user is saved in localStorage and log them in if present
  await checkForRememberedUser();

  // Fetch and display stories on the homepage
  await getAndShowStoriesOnStart();

  // If a user is logged in, update the UI to reflect their login status
  if (currentUser) updateUIOnUserLogin();
}

/**
 * Updates the UI based on the user’s login status.
 * Shows/hides specific navigation links and updates the user profile link.
 */
function updateUIOnUserLogin() {
  // Hide the login link as the user is now logged in
  $navLogin.hide();

  // Show the logout link for the logged-in user
  $navLogOut.show();

  // Display main navigation links for logged-in users
  $(".main-nav-links, #nav-submit-story, #nav-favorites, #nav-my-stories").show();

  // Show the user's username in the profile link
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Event listener for "submit" link in the navigation bar. When clicked,
// hides other elements and shows the story submission form.
$navSubmitStory.on("click", function () {
  console.debug("Submit story link clicked"); // Debug log for event

  hidePageComponents(); // Hide other elements
  $submitForm.show(); // Display the story submission form
});

/**
 * Console warning to enable verbose logging for debug messages.
 * This helps with debugging by showing detailed log messages.
 */
console.warn("STUDENT REMINDER: This app logs detailed debug messages. " +
  "If you don't see the 'start' message, ensure you have 'Verbose' logging enabled" +
  " in your browser's console under 'Default Levels'.");

// Start the app once the DOM is fully loaded
$(start);