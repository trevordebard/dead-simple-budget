# TODO

## Miscellaneous
- [x] Store money in cents
- [ ] Remove commas from inputs that contain numbers 
- [ ] Create README
- [ ] Refactor index.server functions into separate files
- [ ] Form validation for server errors
- [ ] There should be a default uncategorized stack for new transactions without a stack category
- [ ] Cleanup UI for first time users
- [ ] Figure out how to secure edit stack/transaction actions to ensure the authenticated user can only edit their own transactions
  - or determine if a POSt request to the page would be blocked from an outside source

## User
- [ ] Give users example stacks and transaction when their account is first created
## Budget
- [ ] Update user's total balance
- [ ] Should budgets/stacks reset monthly? 

## Cleanup
- [x] Base button styles
- [ ] Relocate tailwind files to same folder
- [ ] Determine error handling strategy
- [ ] Move commonly used snippets in loader functions into reusable functions

## Transactions
- [x] Create transaction side effects
  - [x] Remove full budget from AuthenticatedUser
- [x] Create transaction stack input should be dropdown
- [x] Edit transaction form
- [x] Edit transaction side effects
- [x] Refactor edit transaction logic into separate function
- [ ] Should side effects be a state machine??
- [x] Edit transaction should have ability to modify deposit/withdrawal
- [ ] There should be an option to remove stack/select no stack when editing a transaction
- [ ] Sort transactions by date on /transactions
- [ ] Inline edit transaction?
- [ ] Import transactions from bank

## Stacks
- [x] Edit stack side effects
- [ ] Stack ordering within categories
- [ ] Make stack dropdowns across app custom and display stack amounts
- [ ] Drag and drop stacks to new categories.
  - [ ] Or maybe change the add stack UI to encourage adding a stack from a category label. This could look like a more subtle plus button that opens an input within each category group
- [ ] Allow math in the edit stack amount input in /budget
- [ ] Validate input in the edit stack amount input in /budget
- [ ] Go back a route to /budget after successfully updating a stack
