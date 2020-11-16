import NewTransaction from 'components/NewTransaction';
import Layout from 'components/Layout';
import { GET_USER } from 'graphql/queries/GET_USER';
import { initializeApollo } from 'lib/apolloClient';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, NextPageContext } from 'next';

const EditWrapper = styled.div`
  width: 50%;
  max-width: 90vw;
`;

const NewTransactionPage: FunctionComponent = () => {
    const router = useRouter();
    const { transactionId } = router.query;
    return (
        <Layout>
            <EditWrapper>
                <NewTransaction />
            </EditWrapper>
        </Layout>
    );
};
export default NewTransactionPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const apolloClient = initializeApollo(null, context);
    const session = await getSession(context);
    if (!session) {
        context.res.writeHead(302, { Location: '/login' });
        context.res.end();
        return null;
    }
    await apolloClient.query({ query: GET_USER, variables: { email: session.user.email } });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
            session,
        },
    };
}
