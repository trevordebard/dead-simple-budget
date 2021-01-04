import { gql } from '@apollo/client'
import { useDeleteOneStackMutation, useGetStackQuery } from 'graphql/generated/codegen'
import { BudgetContext } from 'pages/budget'
import { useContext } from 'react'
import styled from 'styled-components'
import { Button } from '../Styled'

const GET_STACK = gql`
  query getStack($id: Int!) {
    stacks(where: {id: {equals: $id}}) {
      amount
      label
      id
    }
  }
`

const DELETE_ONE_STACK = gql`
  mutation deleteOneStack($stackId: Int!) {
    deleteOneStack(where: {id: $stackId}) {
      id
    }
  }

`
const EditStackWrapper = styled.div`
  margin: 1rem auto;
  padding: 0 1rem;
  text-align:center;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  h4 {
    font-weight: bold;
  }
  p {
    margin-bottom: 1rem;
  }
`
const EditBudgetStack = ({ id }: { id: number }) => {
  const budgetContext = useContext(BudgetContext)
  const { data, loading } = useGetStackQuery({ variables: { id }, skip: id === null })
  const [deleteStack] = useDeleteOneStackMutation()
  if (!loading && !data?.stacks) return null;
  return (
    <EditStackWrapper>
      <h4>{loading ? "Loading..." : data.stacks[0].label}</h4>
      <p>Amount: {!loading && data.stacks[0].amount}</p>
      <Button outline small category="DANGER" onClick={() => {
        deleteStack({ variables: { stackId: id }, refetchQueries: ['getBudget'] })
        budgetContext.setStackInFocus(null)
      }}>Delete Stack</Button>
      <Button small category="TRANSPARENT" onClick={() => budgetContext.setStackInFocus(null)}>Cancel</Button>
    </EditStackWrapper>
  )
}

export default EditBudgetStack