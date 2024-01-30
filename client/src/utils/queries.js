import { gql } from "@apollo/client";

export const QUERY_GET_ME = gql`
  query me($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

// add mutations
