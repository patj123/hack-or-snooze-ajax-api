"use strict";

// The base URL for all API requests to Hack or Snooze
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: Represents a single story on the platform
 */

class Story {
  /**
   * Creates a new Story instance
   * @param {Object} storyDetails - Object containing the story's properties
   * { storyId, title, author, url, username, createdAt }
   */
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId; // The unique ID for the story
    this.title = title; // The story's title
    this.author = author; // The name of the story's author
    this.url = url; // The link to the story
    this.username = username; // The user who submitted the story
    this.createdAt = createdAt; // Timestamp of when the story was added
  }

  /**
   * Gets and returns the domain name from the story's URL
   * @returns {string} The domain name of the story URL
   */
  getHostName() {
    // Leverages the URL API to extract the hostname
    return new URL(this.url).hostname;
  }
}

/******************************************************************************
 * StoryList: Manages a collection of Story instances
 */

class StoryList {
  /**
   * Constructor to create a StoryList object
   * @param {Array} stories - An array of Story instances
   */
  constructor(stories) {
    this.stories = stories; // Store the list of Story instances
  }

  /**
   * Fetches stories from the API and creates a StoryList object
   * @returns {Promise<StoryList>} A promise that resolves to a StoryList
   */
  static async getStories() {
    // Make a GET request to fetch all stories
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // Transform each story object into a Story instance
    const storyInstances = response.data.stories.map(story => new Story(story));

    // Return a new StoryList populated with Story instances
    return new StoryList(storyInstances);
  }

  /**
   * Adds a new story to the API and updates the current StoryList
   * @param {User} user - The user adding the story
   * @param {Object} storyData - Object with { title, author, url }
   * @returns {Promise<Story>} The newly created Story instance
   */
  async addStory(user, { title, author, url }) {
    // Get the user's token for API authentication
    const token = user.loginToken;

    // Send a POST request to create a new story
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });

    // Create a new Story instance from the API response
    const newStory = new Story(response.data.story);

    // Add the new story to the front of the story list
    this.stories.unshift(newStory);
    // Also update the user's list of own stories
    user.ownStories.unshift(newStory);

    return newStory; // Return the newly added story
  }
}

/******************************************************************************
 * User: Represents a user of the platform
 */

class User {
  /**
   * Creates a new User instance
   * @param {Object} userData - Object containing user details
   * { username, name, createdAt, favorites, ownStories }
   * @param {string} token - The user's authentication token
   */
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username; // The user's username
    this.name = name; // The user's full name
    this.createdAt = createdAt; // Timestamp of when the account was created

    // Convert favorite and own stories into Story instances
    this.favorites = favorites.map(fav => new Story(fav));
    this.ownStories = ownStories.map(own => new Story(own));

    this.loginToken = token; // Store the user's auth token
  }

  /**
   * Registers a new user with the API and returns a User instance
   * @param {string} username - Desired username
   * @param {string} password - Desired password
   * @param {string} name - User's full name
   * @returns {Promise<User>} The newly created User instance
   */
  static async signup(username, password, name) {
    // Send a POST request to register the new user
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    // Extract user details from the response and create a User instance
    const { user } = response.data;
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /**
   * Logs in an existing user and returns a User instance
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<User>} The logged-in User instance
   */
  static async login(username, password) {
    // Send a POST request to log the user in
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    // Extract user details from the response and create a User instance
    const { user } = response.data;
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /**
   * Automatically logs in a user using stored credentials
   * @param {string} token - The user's token
   * @param {string} username - The user's username
   * @returns {Promise<User|null>} The User instance or null if login fails
   */
  static async loginViaStoredCredentials(token, username) {
    try {
      // Use the token to fetch user details
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      // Extract user details from the response and create a User instance
      const { user } = response.data;
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (error) {
      // Log any errors and return null
      console.error("Error during automatic login:", error);
      return null;
    }
  }
}