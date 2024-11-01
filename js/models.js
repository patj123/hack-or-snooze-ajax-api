"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */
  getHostName() {
    // Extract the hostname from the URL
    return new URL(this.url).hostname;
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList.
   *
   *  - Calls the API to get stories
   *  - Builds an array of Story instances
   *  - Returns a StoryList instance
   */
  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map(story => new Story(story));
    return new StoryList(stories);
  }

  /** Add a new story to the API, make a Story instance, and add to story list.
   * - user: the current User instance
   * - newStory: an object containing {title, author, url}
   *
   * Returns the new Story instance
   */
  async addStory(user, { title, author, url }) {
    // Prepare data for the API call
    const token = user.loginToken;
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: {
        token,
        story: { title, author, url },
      },
    });

    // Create a new Story instance from the API response
    const story = new Story(response.data.story);
    // Add the new story to the beginning of the story list
    this.stories.unshift(story);
    // Add the story to the user's own stories
    user.ownStories.unshift(story);

    return story;
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */
  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // Instantiate Story instances for the user's favorites and own stories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // Store the login token on the user for API calls
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Log in an existing user, make User instance & return it.
   *
   * - username: an existing user's username
   * - password: an existing user's password
   */
  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Log in a user with stored credentials (token & username).
   * Returns a User instance or null if login fails.
   */
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;
      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}