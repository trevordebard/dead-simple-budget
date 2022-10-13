# TODO

## Miscellaneous
- [x] Store money in cents
- [x] Remove commas from inputs that contain numbers 
- [ ] Create README
- [ ] Refactor index.server functions into separate files
- [x] Change root index / to redirect to /budget instead of /login
- [ ] Form validation for server errors
- [ ] There should be a default uncategorized stack for new transactions without a stack category
- [x] Cleanup UI for first time users
- [ ] Animate Outlets coming in and out
- [ ] Figure out how to secure edit stack/transaction actions to ensure the authenticated user can only edit their own transactions
  - or determine if a POSt request to the page would be blocked from an outside source
- [ ] Explore PlanetScale & fly.io db free tiers and cleanup unused DigitalOcean assets

## User
- [x] Give users example stacks and transaction when their account is first created
## Budget
- [x] Update user's total balance
- [ ] Should budgets/stacks reset monthly? 
- [ ] Optimistic UI when adding and removing Stacks and Stack Categories from budget
- [ ] Rename/delete stack categories
- [ ] Consider showing budgeted / spent / available on budget page instead of just available
- [ ] Add plus signs next to each stack category that allow user to add stack directly into the category

## Cleanup
- [x] Base button styles
- [ ] Relocate tailwind files to same folder
- [ ] Determine error handling strategy
  - Add catch boundaries in nested routes
- [ ] Move commonly used snippets in loader functions into reusable functions

## Transactions
- [x] Create transaction side effects
  - [x] Remove full budget from AuthenticatedUser
- [x] Create transaction stack input should be dropdown
- [x] Edit transaction form
- [x] Edit transaction side effects
- [x] Refactor edit transaction logic into separate function
- [x] Add ability to select date when adding a transaction
- [ ] Optimistic UI when adding a transaction
  - useFetchers can be used for this
- [ ] Should side effects be a state machine??
- [x] Edit transaction should have ability to modify deposit/withdrawal
- [ ] There should be an option to remove stack/select no stack when editing a transaction
- [ ] Edit transaction should have delete button
- [ ] Sort transactions by date on /transactions
- [ ] Inline edit transaction?
- [ ] Import transactions from bank

## Stacks
- [x] Edit stack side effects
- [x] Stack ordering within categories
- [ ] Make stack dropdowns across app custom and display stack amounts
- [x] Drag and drop stacks to new categories.
- [ ] Allow math in the edit stack amount input in /budget
- [ ] Validate input in the edit stack amount input in /budget
- [x] Go back a route to /budget after successfully updating a stack
- [x] Add ability to delete stacks
- [ ] Color code stacks that go negative