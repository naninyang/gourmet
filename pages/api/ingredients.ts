import type { NextApiRequest, NextApiResponse } from 'next';
import { getIngredient, getIngredients } from '@/lib/apis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId as string;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 9;

  if (!documentId) {
    try {
      const data = await getIngredients(page, pageSize);
      res.status(200).json(data);
    } catch (error) {
      console.log('Unsupported method: ', error);
    }
  } else {
    try {
      const data = await getIngredient(documentId);
      res.status(200).json(data);
    } catch (error) {
      console.log('Unsupported method: ', error);
    }
  }
}
