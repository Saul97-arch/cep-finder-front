import React, { useState, useEffect } from "react";
import { useInput } from "../hooks/input";
import styles from "../styles/Form.module.css";
const axios = require("axios").default;

function Form() {
  const [infoCep, setInfoCep] = useState("");
  const [cep, cepInput] = useInput({ type: "text" });
  const [dbHistory, setDbHistory] = useState(null);
  // Histórico de ceps pesquisados
  const getDb = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ceps");
      setDbHistory(await response.data);
      return response.data;
    } catch (error) {
      console.log("ERRO");
      console.error(error);
    }
  };

  const getCep = async () => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      setInfoCep([await response.data]);
      console.log(infoCep);
    } catch (error) {
      console.error(error);
    }
  };

  const sendCepInfo = async () => {
    const dbData = await getDb();
    console.log(dbData);

    if (cep === "") return;

    if (dbData.find((info) => info.cep.replace(/\.|\-/g, "") == String(cep))) {
      const dataInCache = dbData.filter((data) => data.cep.replace(/\.|\-/g, "") === cep);
      setInfoCep(dataInCache);
      console.log("INFO BREAKO", infoCep);
      console.log(infoCep);
      return;
    } else {
      console.log("IT MUST NOT BE!");
      try {
        await getCep();
        const response = await axios.post(
          "http://localhost:8000/ceps",
          infoCep[0]
        );
        console.log("Histórico salvo", dbHistory);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const formHandler = (e) => {
    e.preventDefault();
  };

  if (infoCep) {
    return (
      <div>
        <form action="" onSubmit={formHandler}>
          <div>
            <label className={styles.label} htmlFor="nome">
              Cep
            </label>
            {cepInput}
          </div>
          <button type="submit" onClick={sendCepInfo}>
            Buscar Cep
          </button>
          <button onClick={getDb}>ShowDb</button>
        </form>
        <div>
          <ul>
            <li>{infoCep[0].bairro === "" ? "Sem bairro(Cidade pequena, ou micro-zona)" :"Bairro: " + infoCep[0].bairro}</li>
            <li>{"Cidade: " + infoCep[0].localidade}</li>
            <li>{infoCep[0].logradouro === "" ? "Sem logradouro" : "Logradouro: " + infoCep[0].logradouro}</li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <form action="" onSubmit={formHandler}>
          <div>
            <label className={styles.label} htmlFor="nome">
              Cep
            </label>
            {cepInput}
          </div>
          <button type="submit" onClick={sendCepInfo}>
            Buscar Cep
          </button>
        </form>
      </div>
    );
  }
}

export default Form;
