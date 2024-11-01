"use strict";

// Global variable to store the instance of the logged-in User
let currentUser;

/******************************************************************************
 * User login, signup, and logout functionality
 */

/** Handle login form submission. Sets up the user instance if login is successful */
async function login(evt) {
  console.debug("login", evt); // Debug log for the login event
  evt.preventDefault(); // Prevent default form behavior

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
  console.debug("signup", evt); // Debug log for the signup event
  evt.preventDefault(); // Prevent default form behavior

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
  console.debug("logout", evt); // Debug log for the logout event
  // Clear all items from local storage to log out the user
  localStorage.clear();
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
  console.debug("checkForSavedUser"); // Debug log for checking stored user
  const token = localStorage.getItem("token"); // Get token from local storage
  const username = localStorage.getItem("username"); // Get username from local storage

  // If token or username is missing, skip automatic login
  if (!token || !username) return false;

  // Attempt to log in using saved credentials
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Save the currently logged-in user's information to local storage.
 * This allows the user to remain logged in even after a page refresh.
 */
function storeUserInLocalStorage() {
  console.debug("storeUserInLocalStorage"); // Debug log for saving user data
  // If a user is logged in, store their token and username
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
  console.debug("updateUIAfterLogin"); // Debug log for updating UI

  // Make the stories list visible
  $allStoriesList.show();

  // Refresh the navigation bar to reflect the logged-in user
  updateNavForUser();
}