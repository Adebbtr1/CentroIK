import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import GroupRegistration from "./components/GroupRegistration";
import UserRegistration from "./components/UserRegistration";
import Home from "./components/Home";
import SchoolsOverview from "./components/SchoolsOverview";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import React from 'react';

// Tipos para representar grupos e usuários
interface Group {
  id: string;
  institutionName: string;
  directorName: string;
  cnpj: string;
}

interface User {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  responsibleName: string;
  groupId: string;
}

// Componente principal da aplicação
const AppContent = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { isAdmin, toggleAdmin } = useAuth();

  const addGroup = (group: Group) => {
    setGroups((prevGroups) => [...prevGroups, group]);
  };

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <div>
      <nav style={{ padding: "10px", background: "#eee", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ marginRight: "10px" }}>Início</Link>
          <Link to="/registrar-grupo" style={{ marginRight: "10px" }}>Registrar Grupo</Link>
          <Link to="/cadastrar-usuario" style={{ marginRight: "10px" }}>Cadastrar Usuário</Link>
          <Link to="/escolas">Escolas</Link>
        </div>
        <button onClick={toggleAdmin}>
          Modo: {isAdmin ? "Administrador" : "Usuário Comum"}
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrar-grupo" element={<GroupRegistration addGroup={addGroup} />} />
        <Route path="/cadastrar-usuario" element={<UserRegistration groups={groups} addUser={addUser} />} />
        <Route path="/escolas" element={<SchoolsOverview groups={groups} users={users} isAdmin={isAdmin} />} />
      </Routes>
    </div>
  );
};

// Envolvendo com o AuthProvider
const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
