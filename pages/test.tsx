import { useQuery, gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
const TempQ = gql`
  query Test {
        me {
            email
        }
    }
  
`
const TempM = gql`
mutation signup {
    signup(email: "example@example", password: "ex") {
      token
    }
  }
`
const Test = (props) => {
    console.log('placeholder')
    console.log(props)
    const [signup, { loading }] = useMutation(TempM)
    const { data } = useQuery(TempQ)
    console.log(data)

    return (
        <div>
            <p>hi</p>
            <input type="button" value="signup" onClick={() => signup()} />
            {JSON.stringify(data?.me.email)}
        </div>
    )
}
export default Test

export async function getServerSideProps(context) {
    const apolloClient = initializeApollo(null, context)
    await apolloClient.query({ query: TempQ })
    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
    }
}