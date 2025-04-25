import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../Home.css";
import { FaTools } from "react-icons/fa";
import axios from "axios";

const Home = () => {
  const { isAdmin, toggleAdmin } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Controle do modal de login
  const [username, setUsername] = useState(""); // Estado para o nome de usuário
  const [password, setPassword] = useState(""); // Estado para a senha
  const [loginError, setLoginError] = useState(""); // Para mostrar erros de login

  // Função de login que verifica o nome de usuário e a senha no backend
  const handleLogin = async () => {
    try {
      // Alteração da URL para o endpoint correto do backend
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // Se o login for bem-sucedido, troca o estado para admin
      toggleAdmin();
      setIsLoginOpen(false);
      setUsername("");
      setPassword("");
      setLoginError(""); // Limpa qualquer mensagem de erro
    } catch (error: any) {
      setLoginError("Usuário ou senha inválidos.");
    }
  };

  const handleRoleSwitch = () => {
    if (isAdmin) {
      // Se já for admin, apenas reverte para usuário
      toggleAdmin();
    } else {
      // Se não for admin, abre o modal de login
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="home-container">
      {/* Cabeçalho fixo */}
      <div className="home-header">
        <h1 className="home-title">Projeto Centro Integrado Kids</h1>

        <div className="home-buttons">
          <Link to="/registrar-grupo">
            <button className="home-button">Registrar Escola</button>
          </Link>
          <Link to="/cadastrar-usuario">
            <button className="home-button">Cadastrar Usuário</button>
          </Link>
          <Link to="/escolas">
            <button className="home-button">Instituições Inscritas</button>
          </Link>
        </div>

        {/* Botão para alternar entre admin e usuário com ícone */}
        <div className="role-switcher">
          <button className="home-button" onClick={handleRoleSwitch}>
            <FaTools style={{ marginRight: "8px" }} />
            {isAdmin ? "Usuário" : ""}
          </button>
        </div>
      </div>

      {/* Modal de login */}
      {isLoginOpen && (
        <div className="login-modal">
          <div className="login-modal-content">
            <h2>Login de Admin</h2>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loginError && <p className="error">{loginError}</p>}
            <button onClick={handleLogin}>Entrar</button>
            <button onClick={() => setIsLoginOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Conteúdo principal com background */}
      <div className="home-content">
        <p className="home-overlay-text">Bem-vindo ao nosso sistema de inscrição!</p>
      </div>

      {/* Rodapé */}
      <footer className="home-footer">
        <p>© 2025 Centro Integrado Kids</p>
        <p>
          <Link to="/sobre">Sobre</Link> | <Link to="/contato">Contato</Link>
        </p>
      </footer>
    </div>
  );
};

export default Home;
