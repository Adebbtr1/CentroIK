import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../SchoolsOverview.css";

// Tipos
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

interface SchoolsOverviewProps {
  groups: Group[];
  users: User[];
  isAdmin: boolean;
}

const SchoolsOverview: React.FC<SchoolsOverviewProps> = ({ groups, users, isAdmin }) => {
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);

  // Usando useEffect para carregar usuários do backend
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(data => {
        const usersWithId = data.map((user: { _id: string; [key: string]: any }) => ({
          ...user,
          id: user._id, // Mapeia _id para id
        }));
        setLoadedUsers(usersWithId);
      })
      .catch(err => console.error("Erro ao carregar usuários:", err));
  }, []); // O array vazio garante que o efeito só será disparado uma vez, na montagem do componente

  // Se quiser usar os dados do back-end em vez de props:
  const usersToDisplay = loadedUsers.length > 0 ? loadedUsers : users;

  return (
    <div className="schools-overview-container">
      <header className="schools-overview-header">
        <h1 className="schools-overview-title">Visão Geral</h1>
        <div className="schools-overview-buttons">
          <Link to="/"><button className="schools-overview-button">Início</button></Link>
          <Link to="/cadastrar-usuario"><button className="schools-overview-button">Cadastrar Usuário</button></Link>
        </div>
      </header>

      <main className="schools-overview-main">
        {groups.map((group) => {
          const groupUsers = usersToDisplay.filter(user => user.groupId === group.id);
          return (
            <div className="schools-overview-card" key={group.id}>
              <h3>{group.institutionName}</h3>

              {isAdmin ? (
                <>
                  <p><strong>Diretor:</strong> {group.directorName}</p>
                  <p><strong>CNPJ:</strong> {group.cnpj}</p>
                  <h4>Usuários Cadastrados:</h4>
                  <ul>
                    {groupUsers.map(user => (
                      <li key={user.id}>{user.fullName}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p><strong>Diretor:</strong> {group.directorName}</p>
                  <p><strong>Usuários cadastrados:</strong> {groupUsers.length}</p>
                </>
              )}
            </div>
          );
        })}
      </main>

      <footer className="schools-overview-footer">
        <p>© 2025 Centro Integrado Kids</p>
      </footer>
    </div>
  );
};

export default SchoolsOverview;
