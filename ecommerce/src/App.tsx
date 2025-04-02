import './App.css'
import { useAuth } from "../src/hooks/useAuth";


function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>A verificar sessão...</p>; // Mostra loading enquanto verifica a autenticação

  return (
    <div>
      <h1>Bem-vindo à Biblioteca 📚</h1>
    </div>
  );
}

export default App
