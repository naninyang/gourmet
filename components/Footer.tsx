import Anchor from './Anchor';
import { Studio } from './Svgs';
import styles from '@/styles/Footer.module.sass';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <ul>
          <li>
            <Anchor href="/laws">저작권 안내</Anchor>
          </li>
          <li>
            <Anchor href="/usage">이용 안내</Anchor>
          </li>
          <li>
            <Anchor href="/announcement">공지사항</Anchor>
          </li>
          <li>
            <Anchor href="/contact">문의하기</Anchor>
          </li>
        </ul>
        <p className={styles.copyright} lang="en">
          &copy; Copyrights
          <Studio />
          <strong>DEV1L.studios</strong> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
