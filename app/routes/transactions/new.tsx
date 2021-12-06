import { ActionFunction, Form } from 'remix';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  console.log(form.get('description'));
  return null;
};

export default function NewTransaction() {
  return (
    <div>
      <Form method="post">
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description-input" />
        <label htmlFor="amount">Amount</label>
        <input type="text" name="amount" id="amount-input" />
        <label htmlFor="stack">Stack</label>
        <input type="text" name="stack" id="stack-input" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
