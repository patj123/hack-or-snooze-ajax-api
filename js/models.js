"use strict";

// Base URL of the Hack or Snooze API
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /**
   * Constructor to create an instance of Story
   * @param {object} - Destructured object containing story data
   * { storyId, title, author, url, username, createdAt }
   */
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId; // Unique identifier for the story
    this.title = title; // Title of the story
    this.author = author; // Author of the story
    this.url = url; // URL of the story
    this.username = username; // Username of the person who posted the story
    this.createdAt = createdAt; // Timestamp when the story was created
  }

  /**
   * Extract and return the hostname from the story URL
   * @returns {string} - The hostname of the URL
   */
  getHostName() {
    // Use the URL constructor to parse and return the hostname
    return new URL(this.url).hostname;
  }
}

/******************************************************************************
 * StoryList: a collection of stories
 * Used by the UI to display lists of stories
 */

class StoryList {
  /**
   * Constructor to create an instance of StoryList
   * @param {array} stories - An array of Story instances
   */
  constructor(stories) {
    this.stories = stories; // Array of Story instances
  }

  /**
   * Fetch stories from the API and create a StoryList instance
   * @returns {StoryList} - An instance of StoryList with fetched stories
   */
  static async getStories() {
    // Make a GET request to the API to fetch stories
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // Convert the fetched story data into Story instances
    const stories = response.data.stories.map(story => new Story(story));

    // Return a new StoryList instance containing the stories
    return new StoryList(stories);
  }

  /**
   * Add a new story to the API, create a Story instance, and add it to the story list
   * @param {User} user - The current User instance
   * @param {object} newStory - Object containing { title, author, url }
   * @returns {Story} - The newly created Story instance
   */
  async addStory(user, { title, author, url }) {
    // Extract the user's login token for authentication
    const token = user.loginToken;

    // Make a POST request to add the new story
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: {
        token, // Include the user's token for authentication
        story: { title, author, url }, // Story details to be added
      },
    });

    // Create a new Story instance from the API response
    const story = new Story(response.data.story);

    // Add the new story to the beginning of the story list
    this.stories.unshift(story);
    // Add the story to the user's list of own stories
    user.ownStories.unshift(story);

    // Return the newly created Story instance
    return story;
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /**
   * Constructor to create an instance of User
   * @param {object} - Destructured object containing user data
   * { username, name, createdAt, favorites, ownStories }
   * @param {string} token - The user's authentication token
   */
  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  }, token) {
    this.username = username; // Username of the user
    this.name = name; // Full name of the user
    this.createdAt = createdAt; // Timestamp when the user account was created

    // Convert favorite and own stories into Story instances
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // Store the user's authentication token
    this.loginToken = token;
  }

  /**
   * Sign up a new user with the API, create a User instance, and return it
   * @param {string} username - The new user's username
   * @param {string} password - The new user's password
   * @param {string} name - The new user's full name
   * @returns {User} - The newly created User instance
   */
  static async signup(username, password, name) {
    // Make a POST request to sign up the user
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    // Extract user data from the response
    let { user } = response.data;

    // Return a new User instance
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites, // Convert favorites to Story instances
        ownStories: user.stories // Convert own stories to Story instances
      },
      response.data.token // Include the authentication token
    );
  }

  /**
   * Log in an existing user with the API, create a User instance, and return it
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {User} - The logged-in User instance
   */
  static async login(username, password) {
    // Make a POST request to log in the user
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    // Extract user data from the response
    let { user } = response.data;

    // Return a new User instance
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites, // Convert favorites to Story instances
        ownStories: user.stories // Convert own stories to Story instances
      },
      response.data.token // Include the authentication token
    );
  }

  /**
   * Log in a user automatically using stored credentials
   * @param {string} token - The user's authentication token
   * @param {string} username - The user's username
   * @returns {User|null} - The logged-in User instance or null if login fails
   */
  static async loginViaStoredCredentials(token, username) {
    try {
      // Make a GET request to fetch user data using the token
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      // Extract user data from the response
      let { user } = response.data;

      // Return a new User instance
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites, // Convert favorites to Story instances
          ownStories: user.stories // Convert own stories to Story instances
        },
        token // Include the authentication token
      );
    } catch (err) {
      // Log the error and return null if the login fails
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}