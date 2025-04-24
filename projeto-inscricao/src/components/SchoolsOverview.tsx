import React from 'react';
import { Link } from "react-router-dom";
import "../SchoolsOverview.css";

interface Group {
  id: string;
  institutionName: string;
  directorName: string;
  cnpj: string;
}

interface User {
  id: string;
  fullName: string;
  groupId: string;
}

interface SchoolsOverviewProps {
  groups: Group[];
  users: User[];
  isAdmin: boolean;
}

const SchoolsOverview = ({ groups, users, isAdmin }: SchoolsOverviewProps) => {
  return (
    <div className="schools-overview-container">
      <header className="schools-overview-header">
        <h1 className="schools-overview-title">Visão Geral</h1>
        <div className="schools-overview-buttons">
          <Link to="/">
            <button className="schools-overview-button">Início</button>
          </Link>
          <Link to="/cadastrar-usuario">
            <button className="schools-overview-button">Cadastrar Usuário</button>
          </Link>
        </div>
      </header>

      <main className="schools-overview-main">
        {groups.map((group) => {
          const groupUsers = users.filter(user => user.groupId === group.id);
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
