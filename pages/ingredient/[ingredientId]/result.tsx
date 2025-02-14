import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { Emblema_One } from 'next/font/google';
import { IngredientData } from '@/types';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Ingredient.module.sass';

const Emblema = Emblema_One({
  weight: ['400'],
  subsets: ['latin'],
});

interface Props {
  ingredients: IngredientData | null;
  ingredientId: string;
  count: Record<string, number | null> | null;
}

export default function Result({ ingredients, ingredientId, count }: Props) {
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
          <div className={styles.util}>
            <Anchor href="/">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2.5C11.8678 2.50002 11.7368 2.52626 11.6148 2.57722C11.4928 2.62818 11.382 2.70284 11.2891 2.79688L1.20312 11.5977C1.14013 11.6441 1.08894 11.7048 1.05366 11.7746C1.01838 11.8445 0.999997 11.9217 1 12C1 12.1326 1.05268 12.2598 1.14645 12.3536C1.24021 12.4473 1.36739 12.5 1.5 12.5H4V20.5C4 21.052 4.448 21.5 5 21.5H8C8.552 21.5 9 21.052 9 20.5V14.5H15V20.5C15 21.052 15.448 21.5 16 21.5H19C19.552 21.5 20 21.052 20 20.5V12.5H22.5C22.6326 12.5 22.7598 12.4473 22.8536 12.3536C22.9473 12.2598 23 12.1326 23 12C23 11.9217 22.9816 11.8445 22.9463 11.7746C22.9111 11.7048 22.8599 11.6441 22.7969 11.5977L19 8.28516V5.5C19 4.948 18.552 4.5 18 4.5C17.448 4.5 17 4.948 17 5.5V6.53906L12.7168 2.80273C12.7149 2.80077 12.7129 2.79882 12.7109 2.79688C12.618 2.70284 12.5072 2.62818 12.3852 2.57722C12.2632 2.52626 12.1322 2.50002 12 2.5Z"
                  fill="black"
                />
              </svg>
              <span>홈으로 이동</span>
            </Anchor>
            <Anchor href={`/ingredient/${ingredientId}/round`}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 2.5L19.0586 5.44141C16.8658 3.24368 13.6668 2.05364 10.2129 2.65625C6.18289 3.36025 2.92273 6.57466 2.17773 10.5977C1.00073 16.9437 5.864 22.5 12 22.5C17.134 22.5 21.3785 18.6091 21.9375 13.6211C22.0045 13.0251 21.5375 12.5 20.9375 12.5C20.4375 12.5 20.0071 12.8682 19.9531 13.3652C19.5201 17.3702 16.119 20.5 12 20.5C7.059 20.5 3.15016 15.9989 4.16016 10.8809C4.76816 7.80086 7.23359 5.31078 10.3086 4.67578C13.1708 4.08502 15.832 5.04502 17.6426 6.85742L15 9.5H22V2.5Z"
                  fill="black"
                />
              </svg>
              <span>다시하기</span>
            </Anchor>
          </div>
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
                          <dd>{selectionCount > 0 ? `${selectionCount}회` : '우승 이력 없음'}</dd>
                        </div>
                        {selectionCount > 0 && (
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
      ingredientId,
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
