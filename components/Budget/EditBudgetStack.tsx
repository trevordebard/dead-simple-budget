import { gql, useMutation, useQuery } from '@apollo/client'
import { BudgetContext } from 'pages/budget'
import { useContext } from 'react'
import styled from 'styled-components'
import { Button } from '../Styled'

const GET_STACK = gql`
  query GET_STACK($id: Int!) {
    stacks(where: {id: {equals: $id}}) {
      amount
      label
      id
    }
  }
`

interface DeleteStackVars {
  stackId: number
}
interface DeleteStackData {
  id: number
}
const DELETE_ONE_STACK = gql`
  mutation DELETE_ONE_STACK($stackId: Int!) {
    deleteOnestacks(where: {id: $stackId}) {
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
  const { data, loading } = useQuery(GET_STACK, { variables: { id }, skip: id === null })
  const [deleteStack] = useMutation<DeleteStackData, DeleteStackVars>(DELETE_ONE_STACK)
  if (!loading && !data?.stacks) return null;
  return (
    <EditStackWrapper>
      <h4>{loading ? "Loading..." : data.stacks[0].label}</h4>
      <p>Amount: {!loading && data.stacks[0].amount}</p>
      <Button outline small category="DANGER" onClick={() => {
        deleteStack({ variables: { stackId: id }, refetchQueries: ['GET_USER'] })
        budgetContext.setStackInFocus(null)
      }}>Delete Stack</Button>
      <Button small category="TRANSPARENT" onClick={() => budgetContext.setStackInFocus(null)}>Cancel</Button>
    </EditStackWrapper>
  )
}

export default EditBudgetStack