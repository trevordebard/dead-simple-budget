import connect from '../../database';
import Transaction from '../../models/TransactionModel';

connect();
export default async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const data = await Transaction.create(JSON.parse(req.body));
        console.log(data);
        // const data = await Budget.create(JSON.parse(req.body));
        return res.status(201).json({ success: true, data });
      } catch (e) {
        console.log('err');
        console.log(e);
        return res.status(400).send(e);
      }
      break;
    }
    // TODO: This should take a username or budget id once that is set up
    case 'GET': {
      const data = await Transaction.find({ _userId: '5eaf5db927c42a6f3714db5d' });
      res.status(200).json({ success: true, data });
      break;
    }
    default:
      res.send('default');
  }
};
