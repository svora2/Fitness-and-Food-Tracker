export const TOKEN_FETCHED = "TOKEN_FETCHED";

export function tokenFetched(userInformation) {
  return { type: TOKEN_FETCHED, userInformation };
}
