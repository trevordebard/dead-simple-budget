import { gql, useQuery } from '@apollo/client'
import { BudgetContext } from 'pages/budget'
import { useContext } from 'react'
import styled from 'styled-components'

const GET_STACK = gql`
  query GET_STACK($id: Int!) {
    stacks(where: {id: {equals: $id}}) {
      amount
      label
      id
    }
  }
`
const EditStackWrapper = styled.div`
  margin: 1rem auto;
  text-align:center;
`
const EditBudgetStack = ({ id }: { id: number }) => {
  const budgetContext = useContext(BudgetContext)
  const { data } = useQuery(GET_STACK, { variables: { id }, skip: id === null })

  if (!data?.stacks) return null;
  return (
    <EditStackWrapper>
      <h4>{data.stacks[0].label}</h4>
      <button onClick={() => budgetContext.setStackInFocus(null)}>Cancel</button>
    </EditStackWrapper>
  )
}

export default EditBudgetStack