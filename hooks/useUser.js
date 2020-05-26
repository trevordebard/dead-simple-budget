import { gql, useQuery } from '@apollo/client';

const ME = gql`
  query ME {
    me {
      email
      _id
    }
  }
`;

const useUser = () => {
  const { data, loading } = useQuery(ME);
  return {
    user: data?.me,
    loggedIn: !!data, // If data truthy, loggedIn will be true
    loading,
  };
};

export default useUser;
