import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { IngredientData } from '@/types';
import Seo from '@/components/Seo';
import styles from '@/styles/Home.module.sass';
import Anchor from '@/components/Anchor';

export default function Home({
  data,
  error,
  // currentPage,
}: {
  data: IngredientData[];
  error: string;
  // currentPage: number;
}) {
  const timestamp = Date.now();
  return (
    <main className={styles.main}>
      <Seo pageImg={`https://gourmet.dev1stud.io/og?ts=${timestamp}`} />
      <div className={`container ${styles.container}`}>
        {error ? (
          <div className={styles.error}>
            <p>알 수 없는 오류가 발생했습니다.</p>
            <p>
              새로고침을 해도 해결되지 않는다면
              <span>
                <Anchor href="/contact">문의</Anchor>주세요.
              </span>
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            <ul>
              {data.map((ingredient) => (
                <li key={ingredient.documentId}>
                  <Link href={`/ingredient/${ingredient.documentId}/round`} scroll={false} shallow={true}>
                    <div className={styles.thumbnail}>
                      <Image
                        src={`https://cdn.dev1stud.io/gt/${ingredient.documentId}.webp`}
                        width={344}
                        height={169}
                        alt=""
                        unoptimized
                        priority
                      />
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
