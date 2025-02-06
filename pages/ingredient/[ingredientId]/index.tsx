import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { InfoItem, IngredientData } from '@/types';
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

  if (!ingredient || selectedInfo.length === 0) return null;

  const isFinal = selectedInfo.length === 1;

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

  return (
    <main className={styles.main}>
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
              <button key={item.id} type="button" onClick={() => handleSelection(item)}>
                <Image src={item.thumbnail} alt="" width={960} height={540} unoptimized priority />
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ingredients?documentId=${ingredientId}`);
    ingredient = (await response.json()) as { data: IngredientData[] };
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
