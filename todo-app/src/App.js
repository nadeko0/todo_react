import { useEffect } from 'react';
import TodoApp from './components/TodoApp';

function App() {
  useEffect(() => {
    document.title = "Todo List";
  }, []);

  return (
    <TodoApp />
  );
}

export default App;