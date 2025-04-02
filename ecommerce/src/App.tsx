import './App.css'
import { useAuth } from "../src/hooks/useAuth";

function App() {
  const { loading, user } = useAuth();

  if (loading) return <p>A verificar sessão...</p>; // Mostra loading enquanto verifica a autenticação

  return (
    <div>
      <h1>Bem-vindo à Biblioteca 📚</h1>
      <ul>
        <li>Nome: {user.name}</li>
        <li>Email: {user.email}</li>
      </ul>
    </div>
  );
}

export default App
