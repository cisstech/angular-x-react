import { useState } from 'react';
import styles from './app.module.scss';

export function App() {
  const [userName, setUserName] = useState('React User');
  const [selectedExample, setSelectedExample] = useState('hello-world');

  const examples = [
    { value: 'hello-world', label: 'Hello World Component' },
    { value: 'ngx-charts', label: 'NGX-Charts Component' },
  ];

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const onExampleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExample(event.target.value);
  };

  return (
    <div className={styles['app-container']}>
      <h1>React ⚡ Angular Integration</h1>
      <p>
        Experience seamless integration between React and Angular components
        with modern web technologies.
      </p>

      {/* Example Selection */}
      <div className={styles['form-container']}>
        <h2>Select an Example</h2>
        <div className={styles['form-group']}>
          <label htmlFor="example-select">Choose a component to display:</label>
          <select
            id="example-select"
            className={styles['form-input']}
            value={selectedExample}
            onChange={onExampleChange}
          >
            {examples.map((example) => (
              <option key={example.value} value={example.value}>
                {example.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hello World Example */}
      {selectedExample === 'hello-world' && (
        <div>
          <div className={styles['form-container']}>
            <h2>Personalized Greeting</h2>
            <form>
              <div className={styles['form-group']}>
                <label htmlFor="name">Enter your name:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={userName}
                  onChange={onNameChange}
                  placeholder="Your name here..."
                  className={styles['form-input']}
                  autoComplete="given-name"
                />
              </div>
              <p className={styles['current-name']}>
                Greeting for: <strong>{userName || 'World'}</strong>
              </p>
            </form>
          </div>
          <ngx-hello-world name={userName} />
        </div>
      )}

      {/* NGX-Charts Example */}
      {selectedExample === 'ngx-charts' && (
        <div>
          <div className={styles['form-container']}>
            <h2>NGX-Charts in React</h2>
            <p>
              This is an Angular component using NGX-Charts, rendered in React.
            </p>
          </div>
          <ngx-charts
            data={JSON.stringify([
              { name: 'USA', value: 1200 },
              { name: 'Canada', value: 550 },
              { name: 'UK', value: 700 },
              { name: 'Germany', value: 650 },
              { name: 'France', value: 850 },
            ])}
            view={JSON.stringify([700, 400])}
            xAxisLabel="Country"
            yAxisLabel="Population"
          />
        </div>
      )}
    </div>
  );
}

export default App;
