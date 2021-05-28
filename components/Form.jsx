import React, { useState, useEffect } from "react";
import { useInput } from "../hooks/input";
import styles from "../styles/Form.module.css";
const axios = require("axios").default;

function Form() {
  const [infoCep, setInfoCep] = useState("");
  const [cep, cepInput] = useInput({ type: "text" });
  const [dbHistory, setDbHistory] = useState(null);
  const [invalidCep, setInvalidCep] = useState(false);
  // Histórico de ceps pesquisados
  const getDb = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ceps");
      setDbHistory(await response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCep = async () => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      setInfoCep([await response.data]);
      setInvalidCep(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendCepInfo = async () => {
    const dbData = await getDb();
    const validacep = /^[0-9]{8}$/;

    if (cep === "") return;

    if (validacep.test(cep)) {
      if (
        dbData.find((info) => info.cep.replace(/\.|\-/g, "") == String(cep))
      ) {
        const dataInCache = dbData.filter(
          (data) => data.cep.replace(/\.|\-/g, "") === cep
        );
        setInfoCep(dataInCache);
        setInvalidCep(false);
        return;
      } else {
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
    } else {
      console.log(infoCep);
      setInvalidCep(true);
      setInfoCep("");
      return;
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
          <div className={styles.btnContainer}>
            <button
              type="submit"
              onClick={sendCepInfo}
              className={styles.button}
            >
              Buscar Cep
            </button>
          </div>
        </form>
        <div>
          <ul>
            <li>
              {infoCep[0].bairro === ""
                ? "Sem bairro(Cidade pequena, ou micro-zona)"
                : "Bairro: " + infoCep[0].bairro}
            </li>
            <li>{"Cidade: " + infoCep[0].localidade}</li>
            <li>
              {infoCep[0].logradouro === ""
                ? "Sem logradouro"
                : "Logradouro: " + infoCep[0].logradouro}
            </li>
          </ul>
        </div>
        {invalidCep ?
        <div className={styles.err}>
          <p>Cep Inválido!</p>
        </div>
        : <div></div>}
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
          <div className={styles.btnContainer}>
            <button
              type="submit"
              onClick={sendCepInfo}
              className={styles.button}
            >
              Buscar Cep
            </button>
          </div>
        </form>

        {invalidCep ?
        <div className={styles.err}>
          <p>Cep Inválido!</p>
        </div>
        : <div></div>}
      </div>
    );
  }
}

export default Form;
