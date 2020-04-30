import connect from '../../database';
import Budget from '../../models/BudgetModel';

connect();
export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await Budget.create(JSON.parse(req.body));
      res.status(201).json({ success: true, data });
      break;
    }
    // TODO: This should take a username or budget id once that is set up
    case 'GET': {
      const data = await Budget.find({});
      res.status(200).json({ success: true, data });
      break;
    }
    default:
      res.send('default');
  }
};
