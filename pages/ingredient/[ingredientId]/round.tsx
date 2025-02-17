import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { IngredientData } from '@/types';
import styles from '@/styles/Ingredient.module.sass';
import Seo, { originTitle } from '@/components/Seo';

export default function Round({ ingredient, ingredientId }: { ingredient: IngredientData; ingredientId: string }) {
  const router = useRouter();
  const infoLength = ingredient?.info?.length || 0;

  const availableRounds = [8];
  let roundSize = 16;
  while (roundSize <= infoLength) {
    availableRounds.push(roundSize);
    roundSize *= 2;
  }

  const [selectedRound, setSelectedRound] = useState(availableRounds[0]);

  const handleSubmit = () => {
    router.push(`/ingredient/${ingredient.documentId}/?r=${selectedRound}`);
  };

  const timestamp = Date.now();

  return (
    <main className={styles.round}>
      {!ingredient ? (
        <p className={styles.loading}>
          <span>안내사항 불러오는 중</span>
        </p>
      ) : (
        <div className={`container ${styles.content}`}>
          <Seo
            pageTitles={`${ingredient.tournament_title} (${ingredient.animation_title}) - ${originTitle}`}
            pageTitle={`${ingredient.tournament_title} by ${ingredient.animation_title}`}
            pageDescription={`${ingredient.animation_title}에 나온 요리/음식 이상형 월드컵을 즐겨보세요`}
            pageImg={`https://cdn.dev1stud.io/gt/${ingredientId}.webp?ts=${timestamp}`}
          />
          <header>
            <h1>{ingredient.tournament_title}</h1>
            <h2>
              <strong>{ingredient.animation_title}</strong> {ingredient.info.length}개 음식
            </h2>
          </header>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <fieldset>
              <legend>라운드 선택폼</legend>
              <div className={styles.group}>
                <label htmlFor="roundSelect">라운드 선택</label>
                <div className={styles.select}>
                  <select
                    id="roundSelect"
                    value={selectedRound}
                    onChange={(e) => setSelectedRound(Number(e.target.value))}
                  >
                    {availableRounds.map((round) => (
                      <option key={round} value={round}>{`${round}강`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.submit}>
                <button type="button" onClick={handleSubmit}>
                  {selectedRound}강 조리 시작
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ingredientId = context.params?.ingredientId;
  let ingredient = null;

  if (ingredientId && typeof ingredientId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ingredients?documentId=${ingredientId}`);
    ingredient = (await response.json()) as { data: IngredientData[] };
  }

  if (!ingredient) {
    return {
      props: {
        ingredient: null,
      },
    };
  }

  return {
    props: {
      ingredient,
      ingredientId,
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
