import Layout, { Main, Left, Center, Right } from 'components/Shared/Layout';
import { TabSidebar } from 'components/Sidebar';
const BudgetPage = () => {
  return (
    <Layout>
      <Main>
        <Left>
          <TabSidebar />
        </Left>
        <Center>
          <p>test</p>
        </Center>
        <Right>
          <p>empty</p>
        </Right>
      </Main>
    </Layout>
  );
};
export default BudgetPage;
