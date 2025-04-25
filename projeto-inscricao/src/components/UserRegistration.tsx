import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Cadastro.css";

interface Group {
  id: string;
  institutionName: string;
  directorName: string;
  cnpj: string;
}

interface NewUser {
  fullName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  responsibleName: string;
  groupId: string;
}

interface UserRegistrationProps {
  groups: Group[];
  addUser: (user: NewUser) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ groups, addUser }) => {
  const [formData, setFormData] = useState<NewUser>({
    fullName: "",
    birthDate: "",
    email: "",
    phoneNumber: "",
    responsibleName: "",
    groupId: groups[0]?.id || "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("lastUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        birthDate: user.birthDate || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        responsibleName: user.responsibleName || "",
        groupId: user.groupId || groups[0]?.id || "",
      }));
    }
  }, [groups]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addUser(formData); // Adiciona no front (sem _id)
        alert("Usuário cadastrado com sucesso!");

        // Limpa o formulário
        setFormData({
          fullName: "",
          birthDate: "",
          email: "",
          phoneNumber: "",
          responsibleName: "",
          groupId: groups[0]?.id || "",
        });

        // Armazena no localStorage
        localStorage.setItem("lastUser", JSON.stringify(formData));
      } else {
        alert("Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <div className="cadastro-container">
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

      <main className="cadastro-form-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h2>Preencha os dados abaixo:</h2>

          <label>Nome Completo:</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label>Data de Nascimento:</label>
          <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />

          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label>Telefone:</label>
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

          <label>Nome do Responsável:</label>
          <input name="responsibleName" value={formData.responsibleName} onChange={handleChange} required />

          <label>Grupo:</label>
          <select name="groupId" value={formData.groupId} onChange={handleChange} required>
            <option value="">Selecione um grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.institutionName}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar Usuário</button>
        </form>
      </main>

      <footer className="cadastro-footer">
        <p>© 2025 Centro Integrado Kids</p>
      </footer>
    </div>
  );
};

export default UserRegistration;
