"use strict";

// Global variable to hold the User instance of the currently logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/logout functionality
 */

/** Handle login form submission. If login is successful, set up the user instance */
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // Get the username and password from the form
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Call the API to log the user in and get the User instance
  currentUser = await User.login(username, password);

  // Reset the login form fields
  $loginForm.trigger("reset");

  // Save the user's credentials in localStorage and update the UI
  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

// Attach event listener for the login form submission
$loginForm.on("submit", login);

/** Handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  // Get the name, username, and password from the form
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Call the API to sign up the user and get the User instance
  currentUser = await User.signup(username, password, name);

  // Save the user's credentials in localStorage and update the UI
  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  // Reset the signup form fields
  $signupForm.trigger("reset");
}

// Attach event listener for the signup form submission
$signupForm.on("submit", signup);

/** Handle the click of the logout button
 *
 * Remove the user's credentials from localStorage and refresh the page
 */
function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

// Attach event listener for the logout button click
$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in user with localStorage
 */

/** If there are user credentials in local storage, use them to log in
 * the user automatically. This function is called on page load, just once.
 */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // If there are no credentials stored, return false
  if (!token || !username) return false;

  // Attempt to log in using stored credentials
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Save the current user's credentials to localStorage so that they
 * remain logged in when the page is refreshed or revisited.
 */
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
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
  console.debug("updateUIOnUserLogin");

  // Show the list of all stories
  $allStoriesList.show();

  // Update the navigation bar for the logged-in user
  updateNavOnLogin();
}

