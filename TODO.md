# TODO

## Miscellaneous
- [x] Store money in cents
- [x] Remove commas from inputs that contain numbers 
- [ ] Create README
- [x] Refactor index.server functions into separate files
- [x] Change root index / to redirect to /budget instead of /login
- [x] Cleanup UI for first time users
- [ ] Animate Outlets coming in and out
- [ ] Figure out how to secure edit stack/transaction actions to ensure the authenticated user can only edit their own transactions
  - or determine if a POSt request to the page would be blocked from an outside source
- [ ] Add disable prop w/ styles to Button

## User
- [x] Give users example stacks and transaction when their account is first created
## Budget
- [ ] Rename/delete stack categories
- [ ] Add plus signs next to each stack category that allow user to add stack directly into the category
- [x] Consider showing budgeted / spent / available on budget page instead of just available
- [ ] Should budgets/stacks reset monthly? 
- [ ] Optimistic UI when adding and removing Stacks and Stack Categories from budget
- [x] Update user's total balance

## Cleanup
- [x] Base button styles
- [x] Relocate tailwind files to same folder
- [ ] Determine error handling strategy
  - Add catch boundaries in nested routes

## Transactions
- [ ] Edit transaction should have delete button
- [x] Sort transactions by date on /transactions
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
- [ ] Import transactions from bank
- [x] There should be an option to remove stack/select no stack when editing a transaction

## Stacks
- [x] Edit stack side effects
- [x] Stack ordering within categories
- [ ] Make stack dropdowns across app custom and display stack amounts
- [x] Drag and drop stacks to new categories.
- [ ] Allow math in the edit stack amount input in /budget
  - [ ] edit stack errors with negative values
- [ ] Validate input in the edit stack amount input in /budget
- [x] Go back a route to /budget after successfully updating a stack
- [x] Add ability to delete stacks
- [ ] Color code stacks that go negative


## Brainstorming
- Make to be budgeted a stack
  - this allows you to select to be budgeted when adding a transaction
  - will need to handle on the UI
  - will make moving money out of a stack a little more clear
  - recalcToBeBudgeted will need to ignore this stack

- Money moved from to be budgeted to assigned should be stored in some sort of moved table
  - moved table will list where the money went and where it came from 
  - example, if I assign $100 to "going out", there will be an entry that says $100 came from "to be budgeted" to "going out"
- there should be an activity column that shows all transactions that are assigned to a specific stack
  - adding or removing a transaction will ONLY affect activity
    - this way editing a transaction will also only affect the activity of the stack. This will indirectly affect the available amount of the stack (since money has been either added or removed from the stack), but would have no impact on the "to be budgetted" amount. 
  
- For monthly budgets, there should be a "target" 
  - a target is a monthly (or maybe bi-weekly) goal for how much money should be assigned to that stack
  - this is not necessary for MVP