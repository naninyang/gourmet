import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCount } from '@/lib/apis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fetchCount();
    res.status(200).json(data);
  } catch (error) {
    console.log('Unsupported method: ', error);
  }
}
