import { useState } from "react";
import { Link } from "react-router-dom";
import "../Cadastro.css";

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

interface UserRegistrationProps {
  groups: Group[];
  addUser: (user: User) => void;
}

const UserRegistration = ({ groups, addUser }: UserRegistrationProps) => {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { 
      id: crypto.randomUUID(), 
      fullName, 
      birthDate, 
      email, 
      phoneNumber, 
      responsibleName, 
      groupId 
    };
    addUser(newUser);
    setFullName("");
    setBirthDate("");
    setEmail("");
    setPhoneNumber("");
    setResponsibleName("");
  };

  return (
    <div className="cadastro-container">
      {/* Cabeçalho */}
      <header className="cadastro-header">
        <h1 className="cadastro-title">Cadastro de Usuário</h1>
        <div className="cadastro-buttons">
          <Link to="/">
            <button className="cadastro-button">Início</button>
          </Link>
          <Link to="/escolas">
            <button className="cadastro-button">Ver Escolas Registradas</button>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="cadastro-form-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2>Preencha os dados abaixo:</h2>

          <label htmlFor="full-name">Nome Completo:</label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label htmlFor="birth-date">Data de Nascimento:</label>
          <input
            type="date"
            id="birth-date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />

          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="phone-number">Número de Telefone:</label>
          <input
            type="tel"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <label htmlFor="responsible-name">Nome do Responsável:</label>
          <input
            type="text"
            id="responsible-name"
            value={responsibleName}
            onChange={(e) => setResponsibleName(e.target.value)}
            required
          />

          <label htmlFor="group">Escolha um Grupo:</label>
          <select
            id="group"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
          >
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.institutionName}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar Usuário</button>
        </form>
      </main>

      {/* Rodapé */}
      <footer className="cadastro-footer">
        <p>© 2025 Centro Integrado Kids</p>
      </footer>
    </div>
  );
};

export default UserRegistration;
