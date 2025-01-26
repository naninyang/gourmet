import Anchor from './Anchor';
import { Logo } from './Svgs';
import styles from '@/styles/Header.module.sass';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Anchor href="/">
          <Logo />
          <span>고메 토너먼트</span>
        </Anchor>
      </div>
    </header>
  );
}
