import styled from 'styled-components'

interface StickyProps {
  top: string
}
const StickyWrapper = styled.div<StickyProps>`
 position: sticky;
 top: ${props => props.top};
`

export { StickyWrapper }