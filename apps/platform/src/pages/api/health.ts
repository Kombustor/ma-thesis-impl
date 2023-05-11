import type { NextApiRequest, NextApiResponse } from 'next';

const route = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).end();
};

export default route;
