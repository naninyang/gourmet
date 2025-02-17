import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { InfoItem, IngredientData } from '@/types';
import Anchor from '@/components/Anchor';
import Seo, { originTitle } from '@/components/Seo';
import { HomeIcon, RankIcon } from '@/components/Svgs';
import styles from '@/styles/Ingredient.module.sass';

interface Props {
  ingredient: IngredientData | null;
  ingredientId: string;
}

export default function IngredientPage({ ingredient, ingredientId }: Props) {
  const router = useRouter();
  const { r } = router.query;
  const roundSize = Number(r);
  const [selectedInfo, setSelectedInfo] = useState<InfoItem[]>([]);
  const [currentTournament, setCurrentTournament] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [pairIndex, setPairIndex] = useState(0);
  const [updatedCount, setUpdatedCount] = useState(false);

  useEffect(() => {
    if (!r || isNaN(roundSize) || roundSize < 8 || roundSize > (ingredient?.info.length || 0)) {
      router.replace(`/ingredient/${ingredientId}/round`);
    } else {
      const shuffled = [...(ingredient?.info || [])].sort(() => 0.5 - Math.random());
      setSelectedInfo(shuffled.slice(0, roundSize));
      setCurrentTournament(roundSize);
      setTotalRounds(roundSize / 2);
      setCurrentRound(1);
      setPairIndex(0);
    }
  }, [r, ingredient]);

  const isFinal = selectedInfo.length === 1;

  useEffect(() => {
    if (isFinal && !updatedCount) {
      fetch('/api/counting', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId,
          winnerId: selectedInfo[0].id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUpdatedCount(true);
        })
        .catch((err) => console.error('Error updating count:', err));
    }
  }, [isFinal, updatedCount, ingredientId, selectedInfo]);

  if (!ingredient || selectedInfo.length === 0) return null;

  const handleSelection = (choice: InfoItem) => {
    const nextRoundInfo = selectedInfo.slice(2).concat(choice);

    if (nextRoundInfo.length === 1) {
      setSelectedInfo(nextRoundInfo);
    } else {
      setSelectedInfo(nextRoundInfo);
      setPairIndex((prev) => prev + 1);

      if (pairIndex + 1 === totalRounds) {
        setCurrentTournament(nextRoundInfo.length);
        setTotalRounds(nextRoundInfo.length / 2);
        setCurrentRound(1);
        setPairIndex(0);
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }
  };

  const timestamp = Date.now();

  return (
    <main className={styles.main}>
      <Seo
        pageTitles={`${ingredient.tournament_title} (${ingredient.animation_title}) - ${originTitle}`}
        pageTitle={`${ingredient.tournament_title} by ${ingredient.animation_title}`}
        pageDescription={`${ingredient.animation_title}에 나온 요리/음식 이상형 월드컵을 즐겨보세요`}
        pageImg={`https://cdn.dev1stud.io/gt/${ingredientId}.webp?ts=${timestamp}`}
      />
      <header>
        <h1>{ingredient.tournament_title}</h1>
        <h2>
          <strong>{ingredient.animation_title}</strong>
          {isFinal ? (
            '우승'
          ) : (
            <>
              {currentTournament > 2 && `${currentTournament}강`}
              <em>{totalRounds === 1 ? '결승전' : `${currentRound} / ${totalRounds} `}</em>
            </>
          )}
        </h2>
        <div className={styles.util}>
          {isFinal ? (
            <Anchor href={`/ingredient/${ingredientId}/result`}>
              <RankIcon />
              <span>요리 순위보기</span>
            </Anchor>
          ) : (
            <Anchor href="/">
              <HomeIcon />
              <span>홈으로 이동</span>
            </Anchor>
          )}
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
      <div className={styles.content}>
        {isFinal ? (
          <div className={styles.winner}>
            <Image src={selectedInfo[0].thumbnail} alt="" width={1920} height={1080} unoptimized priority />
            <em>‘{selectedInfo[0].name}’ 우승!</em>
          </div>
        ) : (
          <div className={styles.match}>
            <div className={styles.vs}>
              <Image src="/vs.webp" alt="" width={532} height={770} />
            </div>
            {selectedInfo.slice(0, 2).map((item) => (
              <div className={styles.thumbnail} key={item.id}>
                <Image src={item.thumbnail} alt="" width={960} height={540} unoptimized priority />
              </div>
            ))}
            {selectedInfo.slice(0, 2).map((item) => (
              <button key={item.id} type="button" onClick={() => handleSelection(item)}>
                <em>{item.name}</em>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ingredientId = context.params?.ingredientId;
  let ingredient = null;

  if (ingredientId && typeof ingredientId === 'string') {
    const responseIngredient = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ingredients?documentId=${ingredientId}`,
    );
    ingredient = (await responseIngredient.json()) as { data: IngredientData[] };
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
