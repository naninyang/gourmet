import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { Emblema_One } from 'next/font/google';
import { IngredientData } from '@/types';
import styles from '@/styles/Ingredient.module.sass';

const Emblema = Emblema_One({
  weight: ['400'],
  subsets: ['latin'],
});

interface Props {
  ingredients: IngredientData | null;
  count: Record<string, number | null> | null;
}

export default function Result({ ingredients, count }: Props) {
  if (!ingredients) return null;

  const totalSelections: number = count
    ? Object.values(count).reduce((sum: number, value: number | null) => sum + (value ?? 0), 0)
    : 0;

  const ingredientsInfo = [...ingredients.info].sort((a, b) => {
    const countA = count ? (count[`q${a.id}`] ?? 0) : 0;
    const countB = count ? (count[`q${b.id}`] ?? 0) : 0;
    return countB - countA;
  });

  return (
    <main className={styles.result}>
      <style jsx>
        {`
          .number {
            font-family: ${Emblema.style.fontFamily}, sans-serif;
            font-weight: 400;
          }
        `}
      </style>
      <div className={`container ${styles.container}`}>
        <header>
          <h1>{ingredients.tournament_title}</h1>
          <h2>
            <strong>{ingredients.animation_title}</strong>
            최종 선택된 음식들 순위
          </h2>
        </header>
        <div className={styles.list}>
          <ul>
            {ingredientsInfo.map((ingredient, index) => {
              const selectionCount = count ? (count[`q${ingredient.id}`] ?? 0) : 0;
              const winRate =
                totalSelections > 0 ? Math.round((selectionCount / totalSelections) * 100 * 100) / 100 : 0;
              return (
                <li key={ingredient.documentId}>
                  <div>
                    <div className={styles.thumbnail}>
                      <Image src={ingredient.thumbnail} width={344} height={193} alt="" unoptimized priority />
                      <strong className="number">
                        {index + 1}
                        <span>위</span>
                      </strong>
                    </div>
                    <div className={styles.summary}>
                      <strong>{ingredient.name}</strong>
                      <dl>
                        <div>
                          <dt>우승 횟수</dt>
                          <dd>{selectionCount}회</dd>
                        </div>
                        {winRate > 0 && (
                          <div>
                            <dt>우승 비율</dt>
                            <dd className={styles.count}>
                              <div className={styles.rate}>{winRate}%</div>
                              <div className={styles.progress}>
                                <div style={{ width: `${winRate}%` }} />
                              </div>
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ingredientId = context.params?.ingredientId;
  let ingredients = null;
  let count = null;

  if (ingredientId && typeof ingredientId === 'string') {
    const responseIngredient = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ingredients?documentId=${ingredientId}`,
    );
    ingredients = (await responseIngredient.json()) as { data: IngredientData[] };
    const responseCount = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/count?documentId=${ingredientId}`);
    count = (await responseCount.json()) as Record<string, number | null>;
  }

  return {
    props: {
      ingredients,
      count,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
