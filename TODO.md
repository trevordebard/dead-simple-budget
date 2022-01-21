# TODO

## Miscellaneous
- [x] Store money in cents
- [ ] Create README
- [ ] Form validation for server errors
- [ ] There should be a default uncategorized stack for new transactions without a stack category
- [ ] Cleanup UI for first time users
- [ ] Find elegant way to clear form data after successful submit

## User
- [ ] Give users example stacks and transaction when their account is first created
## Budget
- [ ] Update user's total balance
## Cleanup
- [x] Base button styles
- [ ] Relocate tailwind files to same folder
- [ ] Determine error handling strategy
- [ ] Move commonly used snippets in loader functions into reusable functions

## Transactions
- [x] Create transaction side effects
  - [x] Remove full budget from AuthenticatedUser
- [x] Create transaction stack input should be dropdown
- [ ] Edit transaction form
- [ ] Inline edit transaction?
- [ ] Edit transaction side effects
- [ ] Import transactions from bank
- [ ] Sort transactions by date on /transactions

## Stacks
- [ ] Edit stack side effects
- [ ] Stack ordering within categories
- [ ] Make stack dropdowns across app custom and display stack amounts
- [ ] Drag and drop stacks to new categories.
  - [ ] Or maybe change the add stack UI to encourage adding a stack from a category label. This could look like a more subtle plus button that opens an input within each category group
- [ ] Allow math in the edit stack amount input in /budget
- [ ] Validate input in the edit stack amount input in /budget
- [ ] Go back a route to /budget after successfully updating a stack
