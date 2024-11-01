"use strict";

// Global variable to hold the User instance of the currently logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/logout functionality
 */

/** Handle login form submission. If login is successful, set up the user instance */
async function login(evt) {
  console.debug("login", evt); // Log the event for debugging
  evt.preventDefault(); // Prevent the default form submission behavior

  // Get the username and password from the login form
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Call the User class's login method to authenticate and get a User instance
  currentUser = await User.login(username, password);

  // Reset the login form fields after submission
  $loginForm.trigger("reset");

  // Save the user's credentials in localStorage for session persistence
  saveUserCredentialsInLocalStorage();
  // Update the UI to reflect the logged-in state
  updateUIOnUserLogin();
}

// Attach event listener to handle login form submission
$loginForm.on("submit", login);

/** Handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt); // Log the event for debugging
  evt.preventDefault(); // Prevent the default form submission behavior

  // Get the name, username, and password from the signup form
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Call the User class's signup method to create a new account and get a User instance
  currentUser = await User.signup(username, password, name);

  // Save the user's credentials in localStorage for session persistence
  saveUserCredentialsInLocalStorage();
  // Update the UI to reflect the logged-in state
  updateUIOnUserLogin();

  // Reset the signup form fields after submission
  $signupForm.trigger("reset");
}

// Attach event listener to handle signup form submission
$signupForm.on("submit", signup);

/** Handle the click of the logout button
 *
 * Remove the user's credentials from localStorage and refresh the page
 */
function logout(evt) {
  console.debug("logout", evt); // Log the event for debugging
  // Clear all data from localStorage to log out the user
  localStorage.clear();
  // Reload the page to reset the state
  location.reload();
}

// Attach event listener to handle logout button click
$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in user with localStorage
 */

/** If there are user credentials in local storage, use them to log in
 * the user automatically. This function is called on page load, just once.
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser"); // Log for debugging
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  const username = localStorage.getItem("username"); // Retrieve the username from localStorage

  // If no credentials are stored, return false
  if (!token || !username) return false;

  // Attempt to log in using the stored credentials and get the User instance
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Save the current user's credentials to localStorage so that they
 * remain logged in when the page is refreshed or revisited.
 */
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage"); // Log for debugging
  // If a user is currently logged in, store their token and username
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken); // Save the token
    localStorage.setItem("username", currentUser.username); // Save the username
  }
}

/******************************************************************************
 * General UI updates for users
 */

/** When a user signs up or logs in, update the UI:
 *
 * - Show the stories list
 * - Update the navigation bar options for the logged-in user
 * - Generate the user profile part of the page
 */
function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin"); // Log for debugging

  // Show the list of all stories on the page
  $allStoriesList.show();

  // Update the navigation bar to reflect the user's logged-in status
  updateNavOnLogin();
}

