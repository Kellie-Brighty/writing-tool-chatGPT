import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RiDeleteBinLine } from "react-icons/ri";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Montserrat",
  },
  main_result: {
    marginTop: -10,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
  textarea: {
    border: "1px solid #4169e1",
    outline: "none",
    borderRadius: 5,
    padding: 10,
    fontFamily: "Montserrat",
  },
  btn: {
    background: "#4169e1",
    border: "none",
    outline: "none",
    color: "#fff",
    height: 40,
    borderRadius: 5,
    fontFamily: "Montserrat",
    cursor: "pointer",
  },
  inner_flex: {
    maxWidth: 1200,
    width: 1200,
  },
  btn_container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0px",
  },
  result_box: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gridGap: 20,
  },
  result_container: {
    border: "1px solid #4169e1",
    padding: 10,
    borderRadius: 5,
    margin: "20px 0px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  result_title: {
    fontWeight: "bold",
  },
  delete_icon: {
    fontSize: 20,
  },
  del_btn: {
    background: "#4169e1",
    border: "none",
    outline: "none",
    color: "#fff",
    height: 40,
    borderRadius: 5,
    fontFamily: "Montserrat",
    marginTop: 10,
    cursor: "pointer",
  },
}));

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tenseResponse, setTenseResponse] = useState("");
  const [tenseLoading, setTenseLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (message === "") {
      setLoading(false);
      alert("Please type something.");
    } else {
      fetch("http://localhost:3002/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResponse(data.message.replaceAll("\n", "<br />"));
          setLoading(false);
        });
    }
  };

  const handleTense = (e) => {
    e.preventDefault();
    setTenseLoading(true);

    if (message === "") {
      setTenseLoading(false);
      alert("Please type something.");
    } else {
      fetch("http://localhost:3002/tense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTenseResponse(data.message.replaceAll("\n", "<br />"));
          setTenseLoading(false);
        });
    }
  };

  return (
    <div className={classes.app}>
      <div className={classes.inner_flex}>
        <h4>My expert writing tool</h4>
        <form className={classes.form}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            cols="30"
            rows="5"
            className={classes.textarea}
          ></textarea>
        </form>
        <div className={classes.btn_container}>
          <button
            className={classes.btn}
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            {loading ? "checking spelling" : "Check Spelling"}
          </button>
          <button
            className={classes.btn}
            type="submit"
            onClick={(e) => handleTense(e)}
          >
            {tenseLoading ? "Checking tense" : "Check Tense"}
          </button>
        </div>
        <div className={classes.result_box}>
          {response && (
            <div className={classes.result_container}>
              <p className={classes.result_title}>Spelling Check Complete</p>
              <div
                className={classes.main_result}
                dangerouslySetInnerHTML={{ __html: response }}
              />
              <button
                className={classes.del_btn}
                type="submit"
                onClick={(e) => setResponse("")}
              >
                <RiDeleteBinLine className={classes.delete_icon} />
              </button>
            </div>
          )}
          {tenseResponse && (
            <div className={classes.result_container}>
              <p className={classes.result_title}>Tense Check Complete</p>
              <div
                className={classes.main_result}
                dangerouslySetInnerHTML={{ __html: tenseResponse }}
              />
              <button
                className={classes.del_btn}
                type="submit"
                onClick={(e) => setTenseResponse("")}
              >
                <RiDeleteBinLine className={classes.delete_icon} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
