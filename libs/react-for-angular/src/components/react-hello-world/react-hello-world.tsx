import styles from './react-hello-world.module.scss';

interface ReactHelloWorldProps {
  name?: string;
}

export function ReactHelloWorld({ name = 'World' }: ReactHelloWorldProps) {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={styles.container}>
      <h1>Hello, {name}!</h1>
      <p>
        {getGreetingTime()}! This is a React component embedded in Angular
      </p>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>⚛️</span>
          <span className={styles.statLabel}>React</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>🅰️</span>
          <span className={styles.statLabel}>Angular</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>🎯</span>
          <span className={styles.statLabel}>Integration</span>
        </div>
      </div>
    </div>
  );
}

export default ReactHelloWorld;
