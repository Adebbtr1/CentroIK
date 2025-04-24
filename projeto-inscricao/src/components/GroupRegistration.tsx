import { useState } from "react";
import { Link } from "react-router-dom";
import "../Registration.css";

interface Group {
  id: string;
  institutionName: string;
  directorName: string;
  cnpj: string;
}

interface GroupRegistrationProps {
  addGroup: (group: Group) => void;
}

const GroupRegistration = ({ addGroup }: GroupRegistrationProps) => {
  const [institutionName, setInstitutionName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [cnpj, setCnpj] = useState("");

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!institutionName.trim() || !directorName.trim() || !cnpj.trim()) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      institutionName,
      directorName,
      cnpj,
    };

    addGroup(newGroup);

    setInstitutionName("");
    setDirectorName("");
    setCnpj("");
  };

  return (
    <div className="registration-container">
      {/* Cabeçalho */}
      <header className="registration-header">
        <h1 className="registration-title">Registro</h1>
        <div className="registration-buttons">
          <Link to="/">
            <button className="registration-button">Início</button>
          </Link>
          <Link to="/cadastrar-usuario">
            <button className="registration-button">Cadastrar Usuário</button>
          </Link>
          <Link to="/escolas">
            <button className="registration-button">Ver Escolas</button>
          </Link>
        </div>
      </header>

      {/* Formulário */}
      <main className="registration-form-wrapper">
        <form className="registration-form" onSubmit={handleGroupSubmit}>
          <h2>Inscrição da Instituição de Ensino</h2>

          <label htmlFor="institution-name">Nome da Instituição:</label>
          <input
            type="text"
            id="institution-name"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            required
          />

          <label htmlFor="director-name">Nome do Diretor:</label>
          <input
            type="text"
            id="director-name"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            required
          />

          <label htmlFor="cnpj">CNPJ Escolar:</label>
          <input
            type="text"
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />

          <button type="submit">Registrar Escola</button>
        </form>
      </main>

      {/* Rodapé */}
      <footer className="registration-footer">
        <p>© 2025 Centro Integrado Kids</p>
        <p>
          <Link to="/sobre">Sobre</Link> | <Link to="/contato">Contato</Link>
        </p>
      </footer>
    </div>
  );
};

export default GroupRegistration;
