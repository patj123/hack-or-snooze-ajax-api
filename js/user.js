"use strict";

// Global variable to store the instance of the logged-in User
let currentUser;

/******************************************************************************
 * User login, signup, and logout functionality
 */

/** Handle login form submission. Sets up the user instance if login is successful */
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // Collect the username and password input values
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Use the User class to log in and obtain a User instance
  currentUser = await User.login(username, password);

  // Clear the form inputs after logging in
  $loginForm.trigger("reset");

  // Save the user's information in local storage for session persistence
  storeUserInLocalStorage();
  // Refresh the UI to show the logged-in state
  updateUIAfterLogin();
}

// Add an event listener to the login form for submission
$loginForm.on("submit", login);

/** Handle the signup form submission */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  // Extract the name, username, and password from the signup form
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Use the User class to sign up and get a User instance
  currentUser = await User.signup(username, password, name);

  // Store the user's information in local storage for session persistence
  storeUserInLocalStorage();
  // Update the UI for the newly logged-in user
  updateUIAfterLogin();

  // Clear the form inputs after signing up
  $signupForm.trigger("reset");
}

// Add an event listener to the signup form for submission
$signupForm.on("submit", signup);

/** Handle the logout button click
 *
 * Clears the user data from local storage and refreshes the page
 */
function logout(evt) {
  console.debug("logout", evt);

  // Clear all items from local storage to log out the user
  localStorage.clear();

  // Reset global user variable
  currentUser = null;

  // Hide user-specific elements and show login button
  $navLogOut.hide();
  $navUserProfile.hide();
  $navLogin.show();
  $(".main-nav-links, #nav-all, #nav-submit-story, #nav-favorites, #nav-my-stories").hide();

  // Refresh the page to reset the app state
  location.reload();
}

// Add an event listener for the logout button
$navLogOut.on("click", logout);

/******************************************************************************
 * Managing user credentials in local storage
 */

/** If there are user credentials saved, use them to log the user in.
 * This function is executed when the page is loaded.
 */
async function checkForSavedUser() {
  console.debug("checkForSavedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // If token or username is missing, skip automatic login
  if (!token || !username) return false;

  // Attempt to log in using saved credentials
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Save the currently logged-in user's information to local storage.
 * This allows the user to remain logged in even after a page refresh.
 */
function storeUserInLocalStorage() {
  console.debug("storeUserInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * UI updates for logged-in users
 */

/** When a user logs in or signs up, update the interface:
 *
 * - Display the list of stories
 * - Adjust navigation options for the logged-in user
 * - Show the user's profile details
 */
function updateUIAfterLogin() {
  console.debug("updateUIAfterLogin");

  // Make the stories list visible
  $allStoriesList.show();

  // Update navigation bar for logged-in user
  updateNavOnLogin();
}

/** Update the navigation bar once the user is logged in */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");

  // Show main navigation links and hide login link
  $(".main-nav-links, #nav-all, #nav-submit-story, #nav-favorites, #nav-my-stories").show();
  $navLogin.hide();
  $navLogOut.show();

  // Show the user's profile link with their username
  $navUserProfile.text(`${currentUser.username}`).show();
}
