import type { NextApiRequest, NextApiResponse } from 'next';

type PropertyNumber = {
  type: 'number';
  number: number | null;
};

type PropertyTitle = {
  id: string;
  type: 'title';
  title: { type: 'text'; plain_text: string }[];
};

type Properties = {
  documentId: PropertyTitle;
} & {
  [key: `q${number}`]: PropertyNumber;
};

type CountItem = {
  properties: Properties;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { documentId } = req.query;

  if (!documentId || typeof documentId !== 'string') {
    return res.status(400).json({ error: 'documentId is required and must be a string' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/counts`);
    if (!response.ok) {
      throw new Error('Failed to fetch counts data');
    }
    const data: CountItem[] = await response.json();

    const matchedItem = data.find((item) =>
      item.properties.documentId.title.some((title) => title.plain_text === documentId),
    );

    if (!matchedItem) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const extractedValues: Record<string, number | null> = Object.fromEntries(
      Object.entries(matchedItem.properties)
        .filter(([key]) => key.startsWith('q') && !isNaN(Number(key.slice(1))))
        .map(([key, value]) => [key, (value as PropertyNumber).number]),
    );

    return res.status(200).json(extractedValues);
  } catch (error) {
    console.error('Error fetching count:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
