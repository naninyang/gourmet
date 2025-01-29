import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { IngredientData } from '@/types';
import styles from '@/styles/Home.module.sass';

export default function Home({
  data,
  error,
  // currentPage,
}: {
  data: IngredientData[];
  error: string;
  // currentPage: number;
}) {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        {error ? (
          <p>알 수 없는 오류가 발생했습니다.</p>
        ) : (
          <div className={styles.list}>
            <ul>
              {data.map((ingredient) => (
                <li key={ingredient.documentId}>
                  <Link href={`/ingredient/${ingredient.documentId}/round`} scroll={false} shallow={true}>
                    <div className={styles.thumbnail}>
                      <Image src={ingredient.thumbnail_url} width={344} height={193} alt="" unoptimized priority />
                    </div>
                    <div className={styles.summary}>
                      <strong>{ingredient.tournament_title}</strong>
                      <dl>
                        <dt>애니 제목</dt>
                        <dd className={styles.title}>{ingredient.animation_title}</dd>
                        <dt>음식 개수</dt>
                        <dd className={styles.count}>{ingredient.info.length}개 음식</dd>
                      </dl>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentPage = Number(context.query.page) || 1;
  let data = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ingredients?page=${currentPage}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return {
    props: {
      data,
      error,
      currentPage,
    },
  };
};
