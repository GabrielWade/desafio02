import "./index.css";
import clienteService from "../../service/cliente-service";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import Cliente from "../../models/Cliente";

function ClientePage() {
  const [clientes, setClientes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [cliente, setCliente] = useState(new Cliente());

  useEffect(() => {
    clienteService
      .obter()
      .then((response) => {
        setClientes(response.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  const editar = (e) => {
    setModoEdicao(true);
    let clienteEncontrado = clientes.find((c) => c.id == e.target.id);
    clienteEncontrado.dataCadastro = clienteEncontrado.dataCadastro.substring(
      0,
      10
    );

    setCliente(clienteEncontrado);
  };

  const excluir = (e) => {
    let clienteEncontrado = clientes.find((c) => c.id == e.target.id);

    if (
      // eslint-disable-next-line no-restricted-globals
      confirm("Deseja realmente excluir o cliente " + clienteEncontrado.nome)
    ) {
      excluirClienteBackEnd(clienteEncontrado.id);
    }
  };

  const adicionar = () => {
    setModoEdicao(false);
  };

  const atualizarClienteNaTabela = (
    clienteAtualizado,
    removerCliente = false
  ) => {
    let indice = clientes.findIndex(
      (cliente) => cliente.id === clienteAtualizado.id
    );

    removerCliente
      ? clientes.splice(indice, 1)
      : clientes.splice(indice, 1, cliente);

    setClientes((arr) => [...arr]);
  };

  const salvar = () => {
    if (!cliente.nome || !cliente.cpfOuCnpj || !cliente.email) {
      Swal.fire({
        icon: "error",
        text: "E-mail e CPF são obrigatórios.",
      });
      return;
    }

    modoEdicao
      ? atualizarClienteBackend(cliente)
      : adicionarClienteBackend(cliente);
  };

  const adicionarClienteBackend = (cliente) => {
    clienteService
      .adicionar(cliente)
      .then((response) => {
        setClientes((lista) => [...lista, new Cliente(response.data)]);

        limparCliente();

        Swal.fire({
          icon: "success",
          title: "Cliente cadastrado com sucesso!",
          showConfirmButton: false,
          timer: 4500,
        });
      })
      .catch((erro) => {});
  };

  const atualizarClienteBackend = (cliente) => {
    clienteService
      .atualizar(cliente)
      .then((response) => {
        atualizarClienteNaTabela(response.data);

        limparCliente();

        Swal.fire({
          icon: "success",
          title: "Cliente atualizado com sucesso!",
          showConfirmButton: false,
          timer: 4500,
        });
      })
      .catch((erro) => {});
  };

  const excluirClienteBackEnd = (id) => {
    clienteService
      .excluir(id)
      .then(() => {
        let clienteEncontrado = clientes.find((c) => c.id == id);

        atualizarClienteNaTabela(clienteEncontrado, true);

        Swal.fire({
          icon: "success",
          title: "Cliente excluido com sucesso!",
          showConfirmButton: false,
          timer: 4500,
        });
      })
      .catch();
  };

  const limparCliente = () => {
    setCliente({
      ...cliente,
      id: "",
      nome: "",
      cpfOuCnpj: "",
      telefone: "",
      dataCadastro: "",
      email: "",
    });
  };

  return (
    <div className="container" style={{ paddingTop: "100px" }}>
      <button
        style={{ marginBottom: "20px" }} // Use um objeto JavaScript aqui
        type="button"
        className="btn btn-outline-success btn-add"
        data-bs-toggle="modal"
        data-bs-target="#myModal"
        onClick={adicionar}
      >
        Adicionar
      </button>
      <table className="table text-center">
        <thead className="table-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefone</th>
            <th scope="col">Cadastro</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.cpfOuCnpj}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{new Date(cliente.dataCadastro).toLocaleDateString()}</td>
              <td>
                <button
                  id={cliente.id}
                  style={{ margin: "10px" }}
                  onClick={editar}
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#myModal"
                >
                  Editar
                </button>
                <button
                  id={cliente.id}
                  onClick={excluir}
                  className="btn btn-danger"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal modal-lg"
        id="myModal"
        style={{ paddingTop: "100px" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                {modoEdicao ? "Editar cliente" : "Adicionar cliente"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-2">
                  <label for="id" className="form-label">
                    Id
                  </label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="id"
                    value={cliente.id}
                    onChange={(e) =>
                      setCliente({ ...cliente, id: e.target.value })
                    }
                  />
                </div>

                <div className="col-sm-10">
                  <label for="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    value={cliente.nome}
                    onChange={(e) =>
                      setCliente({ ...cliente, nome: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-sm-4">
                  <label for="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={cliente.email}
                    onChange={(e) =>
                      setCliente({ ...cliente, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-sm-2">
                  <label for="telefone" className="form-label">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefone"
                    value={cliente.telefone}
                    onChange={(e) =>
                      setCliente({ ...cliente, telefone: e.target.value })
                    }
                  />
                </div>
                <div className="col-sm-3">
                  <label for="cpf" className="form-label">
                    CPF
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cpf"
                    value={cliente.cpfOuCnpj}
                    onChange={(e) =>
                      setCliente({ ...cliente, cpfOuCnpj: e.target.value })
                    }
                  />
                </div>
                <div className="col-sm-3">
                  <label for="dataCadastro" className="form-label">
                    Data de cadastro
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dataCadastro"
                    disabled
                    value={cliente.dataCadastro}
                    onChange={(e) =>
                      setCliente({ ...cliente, dataCadastro: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                onClick={salvar}
                data-bs-dismiss="modal"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientePage;
