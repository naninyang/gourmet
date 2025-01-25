import styles from '@/styles/Header.module.sass';
import Anchor from './Anchor';
import { Logo } from './Svgs';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Anchor href="/">
          <Logo />
        </Anchor>
      </div>
    </header>
  );
}
