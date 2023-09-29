import { useState } from "react";
import Swal from "sweetalert2";

import "./index.css";

import usuarioService from "../../service/usuario-service";

function Login() {
  const [email, setEmail] = useState("admin@admin.com");
  const [senha, setSenha] = useState("123456");
  const logar = (e) => {
    e.preventDefault();
    if (!email || !senha) {
      Swal.fire({
        icon: "error",
        text: "Os campos de e-mail e senha são obrigatórios!",
      });
      return;
    }
    usuarioService
      .autenticar(email, senha)
      .then((response) => {
        usuarioService.salvarToken(response.data.token);
        usuarioService.salvarUsuario(response.data.usuario);

        window.location = "/";
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  return (
    <section className="bodyForms">
      <form className="login">
        <h2>Login</h2>
        <div className="box-user">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="text"
            name=""
            required
          />
          <label for="email">Email</label>
        </div>
        <div className="box-user">
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            id="password"
            type="password"
            name=""
            required
          />
          <label for="password">Senha</label>
        </div>
        <div>
          <a href="/teste" className="forget">
            {" "}
            Esqueceu a senha?
          </a>
        </div>
        <a onClick={logar} href="/teste" className="button" id="button-open">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Entrar
        </a>
      </form>
    </section>
  );
}

export default Login;
