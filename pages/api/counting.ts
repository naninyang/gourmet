import type { NextApiRequest, NextApiResponse } from 'next';
import { notionClient, databaseId } from '@/lib/apis';

export interface NotionUser {
  object: 'user';
  id: string;
}

export interface NotionDatabaseParent {
  type: 'database_id';
  database_id: string;
}

export interface NotionProperty {
  id: string;
  type: 'number' | 'title';
  number?: number | null;
  title?: { text: { content: string } }[];
}

export interface NotionPage {
  object: 'page';
  id: string;
  parent: NotionDatabaseParent;
  archived: boolean;
  in_trash: boolean;
  properties: Record<string, NotionProperty>;
  request_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { ingredientId, winnerId } = req.body;

  if (!ingredientId || !winnerId) {
    return res.status(400).json({ error: 'Missing ingredientId or winnerId' });
  }

  const propertyName = `q${winnerId}`;

  try {
    const queryResponse = await notionClient.databases.query({
      database_id: databaseId as string,
      filter: {
        property: 'title',
        title: {
          equals: ingredientId,
        },
      },
    });

    if (!queryResponse.results || queryResponse.results.length === 0) {
      return res.status(404).json({ error: 'Notion page not found for given ingredientId' });
    }

    const page = queryResponse.results[0];
    const pageId = page.id;

    const pageDetails = await notionClient.pages.retrieve({ page_id: pageId });
    const properties = (pageDetails as NotionPage).properties;
    const countProperty = properties[propertyName] as NotionProperty | undefined;

    if (!countProperty || countProperty.type !== 'number') {
      return res.status(400).json({ error: `Property ${propertyName} is not a number` });
    }

    const currentValue = countProperty.number ?? 0;
    const newValue = currentValue + 1;

    await notionClient.pages.update({
      page_id: pageId,
      properties: {
        [propertyName]: {
          number: newValue,
        },
      },
    });

    return res.status(200).json({ success: true, newValue });
  } catch (error) {
    console.error('Error updating count:', error);
    return res.status(500).json({ error: 'Failed to update count' });
  }
}
