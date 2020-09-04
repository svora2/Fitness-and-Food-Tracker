import { TOKEN_FETCHED, tokenFetched } from "./actionTypes";

export default function reducer(state = { repos: [] }, action) {
  switch (action.type) {
    case TOKEN_FETCHED:
      return { ...state, token: action.userInformation.token, username: action.userInformation.username };
    default:
      return state;
  }
}
