import "./index.css";

import { Link, useLocation } from "react-router-dom";
import usuarioService from "../../service/usuario-service";

function Menu() {
  const logout = () => {
    usuarioService.sairSistema();
  };

  if (useLocation().pathname !== "/login") {
    return (
      <header>
        <nav>
          <a className="logo" href="/">
            <span className="blue">/*</span>Logo<span className="blue">*/</span>
          </a>
          <div className="mobile-menu">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <ul className="nav-list">
            <li>
              <Link to="/clientes">Clientes</Link>
            </li>
            <li>
              <Link to="/produtos">Produtos</Link>
            </li>
            <li>
              <Link onClick={logout}>Sair</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  } else {
    return null; //retorna nada para o componente não ser renderizado no DOM
  }
}

export default Menu;
