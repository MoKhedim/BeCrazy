# BeCrazy Backend

This is the backend for BeCrazy, a social media platform where users can post videos of themselves doing challenges. This backend is built with TypeScript and uses MongoDB as the database and Express as the server framework. It also implements token-based authentication for secure user authentication.

## Table of Contents

- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Conclusion](#conclusion)


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (optional)

### Installation

1. Clone the repo

```sh
git clone
```

2. Install NPM packages

```sh
npm install
```

3. Run the server

```sh
npm run start
```



## API Routes

### Table of Contents

- [Authentication Routes](#authentication-routes)
- [Challenge Routes](#challenge-routes)
- [Media Routes](#media-routes)
- [Like Routes](#like-routes)
- [Comment Routes](#comment-routes)
- [User Routes](#user-routes)

### Authentication Routes

#### POST /signup

Create a new user account.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| username | string | The username of the user. |
| email | string | The email of the user. |
| password | string | The password of the user. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the user was created successfully. |

#### POST /login

Log in to an existing user account.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| email | string | The email of the user. |
| password | string | The password of the user. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the user was logged in successfully. |
| token | string | The token used to authenticate the user. |


### Challenge Routes

#### GET /aiChallenge

Get a random AI challenge.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| challenge | string | The challenge text. |


### Media Routes

#### GET /getAllMedia/:token

Get all media objects.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| result | array | An array of media objects. |

#### GET /top10media

Get the top 10 media objects based on likes for today.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| result | array | An array of media objects. |

#### GET /getMedia/:id

Get a media object by ID. Used like an uri.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| media | string | The media object. |

#### POST /postMedia/:token

Post a media object.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| video | file | The media object. |
| description | string | The description of the media object. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the media object was posted successfully. |

#### DELETE /deleteMedia/:id/:token

Delete a media object by ID.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the media object was deleted successfully. |


### Like Routes

#### POST /likeMedia/:token

Like a media object or dislike it if it was already liked.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| idMedia | string | The ID of the media object. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the media object was liked successfully. |
| result1 | object | The media object. |
| result2 | object | The user object. |


### Comment Routes

#### POST /commentsMedia/:token

Post a comment on a media object.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| idMedia | string | The ID of the media object. |
| comment | string | The comment text. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the comment was posted successfully. |
| result1 | object | The media object. |
| result2 | object | The user object. |

#### POST /deleteComments/:id/:token

Delete a comment on a media object.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| idMedia | string | The ID of the media object. |
| idComment | string | The ID of the comment. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the comment was deleted successfully. |
| result1 | object | The media object. |
| result2 | object | The user object. |


### User Routes

#### POST /forgotPassword

Send an email to the user with a link to reset their password.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| email | string | The email of the user. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the email was sent successfully. |

#### POST /verifCode/:email

Verify the code sent to the user's email and changes the user's password.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| code | string | The code sent to the user's email. |
| password | string | The new password of the user. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the password was changed successfully. |

#### GET /searchUser/:username

Search for a user by username.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| result | array | An array of user objects. |

#### GET /userProfile/:username

Get a user's profile and posts by username.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the user was found successfully. |
| result1 | object | The profile object. |
| result2 | array | An array of media objects. |

#### POST /updateUser/:token

Update a user's profile.

##### Request Body

| Field | Type | Description |
| --- | --- | --- |
| username | string | The username of the user. |
| password | string | The password of the user. |
| profilePicture | base64 | The profile picture of the user. |
| bio | string | The bio of the user. |

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the user was updated successfully. |
| result1 | object | The user object. |

#### GET /getUSer/:token

Get a user's profile by token.

##### Response

| Field | Type | Description |
| --- | --- | --- |
| message | string | A message indicating whether the user was found successfully. |
| info | object | The profile object. |
| error | string | An error message. |


## Conclusion

This backend provides the necessary API routes to power the BeCrazy social media platform. It uses token-based authentication for secure user authentication and MongoDB for data storage.