import { BudgetContext } from 'pages/budget'
import { useContext } from 'react'
import styled from 'styled-components'

const EditStackWrapper = styled.div`
  margin: 1rem auto;
  text-align:center;
`
const EditBudgetStack = ({ id }: { id: number }) => {
  const budgetContext = useContext(BudgetContext)
  return (
    <EditStackWrapper>
      <h4>Edit Stack {id}</h4>
      {id && <button onClick={() => budgetContext.setStackInFocus(null)}>Cancel</button>}
    </EditStackWrapper>
  )
}

export default EditBudgetStack