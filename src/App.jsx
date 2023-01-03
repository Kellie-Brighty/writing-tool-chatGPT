import React, { useState, useRef, useEffect } from "react";
import { makeStyles, Menu, MenuItem, Dialog } from "@material-ui/core";
import { RiDeleteBinLine } from "react-icons/ri";
import Header from "./components/Header";
import { AiOutlineCopy } from "react-icons/ai";
import { BsShareFill } from "react-icons/bs";
import { MdOutlineGTranslate, MdArrowUpward } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import Carousel from "./components/Carousel";
import Lottie from "lottie-react";
import file_animation from "./animation/scan_file.json";
import "./App.css";
import { htmlToText } from "html-to-text";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Montserrat",
  },
  main_result: {
    marginTop: 10,
    border: "2px solid #FFA944",
    padding: 10,
    borderRadius: 10,
    height: 250,
    overflowY: "scroll",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
    marginTop: 20,
  },
  right_side: {
    width: "100%",
    marginLeft: 50,
    [theme.breakpoints.down("xs")]: {
      width: 340,
      marginLeft: 0,
      marginTop: 100
    }
  },
  textarea: {
    border: "1px solid #ccc",
    outline: "none",
    borderRadius: 10,
    padding: 10,
    fontFamily: "Montserrat",
  },
  btn: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#FFA944",
    height: 45,
    borderRadius: 5,
    fontFamily: "Montserrat",
    cursor: "pointer",
    border: "2px solid #FFA944",
    fontSize: 14,
    fontWeight: "bold",
    width: 180,
    "&:hover": {
      background: "#FFA944",
      color: "#fff",
    },
    [theme.breakpoints.down("xs")]: {
      width: '100%',
      margin: '10px auto'
    }
  },
  inner_flex: {
    maxWidth: 1200,
    width: 1200,
    marginTop: 50,
  },
  upper_section: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  add_text: {
    fontSize: 25,
  },
  btn_container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0px",
    marginTop: 50,
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column'
    }
  },
  result_box: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(1, 1fr)",
    gridGap: 20,
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      width: 340,
      alignItems: 'center',
      margin: '40px auto'
    },
  },
  result_container: {
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 10,
    margin: "20px 0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  result_head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Montserrat",
  },
  result_title: {
    fontWeight: "bold",
    fontSize: 25,
  },
  result_foot: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    border: "1px solid #ccc",
    borderRadius: 5,
  },
  delete_icon: {
    fontSize: 20,
    cursor: "pointer",
    color: "#777",
    "&:hover": {
      color: "#FFA944",
    },
  },
  del_btn: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    height: 40,
    borderRadius: 5,
    fontFamily: "Montserrat",
    marginTop: 10,
    cursor: "pointer",
  },
  translate_dialog: {
    padding: 20,
    fontFamily: "Montserrat",
    lineHeight: 1.5,
  },
  dialog: {
    padding: 20,
  },
  dialog_btn_container: {
    display: "flex",
    justifyContent: "center",
  },
  lottie_container: {
    display: 'flex',
    justifyContent: 'center'
  },
  lottie_styles: {
    width: 340,
    [theme.breakpoints.down("xs")]: {
      width: 300,
    },
  },
}));

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tenseResponse, setTenseResponse] = useState("");
  const [tenseLoading, setTenseLoading] = useState(false);
  const [rephraseResponse, setRephraseResponse] = useState("");
  const [rephraseLoading, setRephraseLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [tenseCopied, setTenseCopied] = useState(false);
  const [rephraseCopied, setRephraseCopied] = useState(false);
  const [translateCopied, setTranslateCopied] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [spellSpanishLoading, setSpellSpanishLoading] = useState(false);
  const [tenseSpanishLoading, setTenseSpanishLoading] = useState(false);
  const [rephraseSpanishLoading, setRephraseSpanishLoading] = useState(false);
  const [spanishTranslate, setSpanishTranslate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [plainResponseText, setPlainResponseText] = useState("");
  const [plainTenseText, setPlainTenseText] = useState("");
  const [plainRephraseText, setPlainRephraseText] = useState("");

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSpanishTranslate("");
  };

  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const scrollref = useRef();
  const topRef = useRef();

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
          setResponse(data.message.replaceAll("\n", "<br /><br />"));
          setPlainResponseText(data.message.replaceAll("\n", "<br /><br />"));
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
      try {
        fetch("http://localhost:3002/tense", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        })
          .then((res) => res.json())
          .then((data) => {
            setTenseResponse(data.message.replaceAll("\n", "<br /><br />"));
            setPlainTenseText(data.message.replaceAll("\n", "<br /><br />"));
            setTenseLoading(false);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleRephrase = (e) => {
    e.preventDefault();
    setRephraseLoading(true);

    if (message === "") {
      setRephraseLoading(false);
      alert("Please type something.");
    } else {
      fetch("http://localhost:3002/rephrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRephraseResponse(data.message.replaceAll("\n", "<br /><br />"));
          setPlainRephraseText(data.message.replaceAll("\n", "<br /><br />"));
          setRephraseLoading(false);
        });
    }
  };

  const handleSpanishTranslate = (
    text_to_translate,
    loading_action,
    translate_action
  ) => {
    loading_action(true);

    if (message === "") {
      loading_action(false);
      alert("Please type something.");
    } else {
      console.log("Text to translate>>>", text_to_translate);
      fetch("http://localhost:3002/translate_spanish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: text_to_translate }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAnchorEl(null);
          translate_action(data.message.replaceAll("\n", "<br /><br />"));
          console.log(data);
          loading_action(false);
        });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  async function copyTextToClipboard(text) {
    const convertedText = htmlToText(text);
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(convertedText);
    } else {
      return document.execCommand("copy", true, convertedText);
    }
  }

  const handleCopyClick = (copyText, setAction) => {
    copyTextToClipboard(copyText)
      .then(() => {
        setAction(true);
        setTimeout(() => {
          setAction(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (scrollref.current) {
      scrollref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response, tenseResponse, rephraseResponse]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (spanishTranslate !== "") {
      setOpenDialog(true);
    }
  }, [spanishTranslate]);

  return (
    <div className={classes.app}>
      <div style={{ width: "100%" }}>
        <div>
          <Header />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={classes.inner_flex}>
              <div className={classes.upper_section} ref={topRef}>
                <Carousel>
                  <div className={classes.left_side}>
                    <p className="title">
                      You can now write your speech with confidence
                    </p>
                    <img src="left_image.png" alt="" className="image" />
                  </div>
                  <div className={classes.left_side}>
                    <p className="title">
                      WriteFrenzy can parse through your texts and correct
                      mistakes
                    </p>
                    <div className={classes.lottie_container} >
                      <Lottie
                        animationData={file_animation}
                        loop={true}
                        className={classes.lottie_styles}
                      />
                    </div>
                  </div>
                </Carousel>

                <div className={classes.right_side}>
                  <p className={classes.add_text}>Paste Text Here</p>
                  <form className={classes.form}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      cols="30"
                      rows="16"
                      className={classes.textarea}
                      placeholder="Paste text here"
                    ></textarea>
                  </form>
                  <div className={classes.btn_container}>
                    <button
                      className={classes.btn}
                      type="submit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      {loading ? "Checking spelling..." : "Check Spelling"}
                    </button>
                    <button
                      className={classes.btn}
                      type="submit"
                      onClick={(e) => handleTense(e)}
                    >
                      {tenseLoading ? "Checking tense..." : "Check Tense"}
                    </button>
                    <button
                      className={classes.btn}
                      type="submit"
                      onClick={(e) => handleRephrase(e)}
                    >
                      {rephraseLoading ? "Rephrasing..." : "Rephrase"}
                    </button>
                  </div>
                </div>
              </div>

              <div className={classes.result_box} ref={scrollref}>
                {response && (
                  <div className={classes.result_container}>
                    <div className={classes.result_head}>
                      <p className={classes.result_title}>Spell Check</p>
                      <img src="check.png" alt="" />
                    </div>
                    <div
                      className={classes.main_result}
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                    <div className={classes.result_foot}>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) => setResponse("")}
                        title="Delete"
                      >
                        <RiDeleteBinLine className={classes.delete_icon} />
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) => handleCopyClick(response, setIsCopied)}
                        title="Copy"
                      >
                        {isCopied ? (
                          <GiCheckMark className={classes.delete_icon} />
                        ) : (
                          <AiOutlineCopy className={classes.delete_icon} />
                        )}
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={handleClick}
                        title="Translate"
                      >
                        <MdOutlineGTranslate className={classes.delete_icon} />
                      </button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            handleSpanishTranslate(
                              response,
                              setSpellSpanishLoading,
                              setSpanishTranslate
                            )
                          }
                        >
                          {spellSpanishLoading ? "Translating..." : "Spanish"}
                        </MenuItem>
                        <MenuItem onClick={handleClose}>French</MenuItem>
                        <MenuItem onClick={handleClose}>Italian</MenuItem>
                      </Menu>

                      <Dialog
                        open={spanishTranslate !== "" && true}
                        onClose={handleDialogClose}
                      >
                        <div className={classes.dialog}>
                          <div className={classes.result_head}>
                            <p className={classes.result_title}>
                              Translate Complete
                            </p>
                            <img src="check.png" alt="" />
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: spanishTranslate,
                            }}
                            className={classes.translate_dialog}
                          />

                          <div className={classes.dialog_btn_container}>
                            <button
                              className={classes.btn}
                              onClick={() => {
                                handleCopyClick(
                                  spanishTranslate,
                                  setTranslateCopied
                                );
                              }}
                            >
                              {translateCopied ? (
                                <GiCheckMark className={classes.delete_icon} />
                              ) : (
                                "Copy translation"
                              )}
                            </button>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                )}
                {tenseResponse && (
                  <div className={classes.result_container}>
                    <div className={classes.result_head}>
                      <p className={classes.result_title}>Tense Check</p>
                      <img src="check.png" alt="" />
                    </div>
                    <div
                      className={classes.main_result}
                      dangerouslySetInnerHTML={{ __html: tenseResponse }}
                    />
                    <div className={classes.result_foot}>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) => setTenseResponse("")}
                        title="Delete"
                      >
                        <RiDeleteBinLine className={classes.delete_icon} />
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) =>
                          handleCopyClick(tenseResponse, setTenseCopied)
                        }
                        title="Copy"
                      >
                        {tenseCopied ? (
                          <GiCheckMark className={classes.delete_icon} />
                        ) : (
                          <AiOutlineCopy className={classes.delete_icon} />
                        )}
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={handleClick}
                        title="Translate"
                      >
                        <MdOutlineGTranslate className={classes.delete_icon} />
                      </button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            handleSpanishTranslate(
                              tenseResponse,
                              setTenseSpanishLoading,
                              setSpanishTranslate
                            )
                          }
                        >
                          {tenseSpanishLoading ? "Translating..." : "Spanish"}
                        </MenuItem>
                        <MenuItem onClick={handleClose}>French</MenuItem>
                        <MenuItem onClick={handleClose}>Italian</MenuItem>
                      </Menu>

                      <Dialog
                        open={spanishTranslate !== "" && true}
                        onClose={handleDialogClose}
                      >
                        <div className={classes.dialog}>
                          <div className={classes.result_head}>
                            <p className={classes.result_title}>
                              Translate Complete
                            </p>
                            <img src="check.png" alt="" />
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: spanishTranslate,
                            }}
                            className={classes.translate_dialog}
                          />

                          <div className={classes.dialog_btn_container}>
                            <button
                              className={classes.btn}
                              onClick={() =>
                                handleCopyClick(
                                  spanishTranslate,
                                  setTranslateCopied
                                )
                              }
                            >
                              {translateCopied ? (
                                <GiCheckMark className={classes.delete_icon} />
                              ) : (
                                "Copy translation"
                              )}
                            </button>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                )}
                {rephraseResponse && (
                  <div className={classes.result_container}>
                    <div className={classes.result_head}>
                      <p className={classes.result_title}>Rephrase</p>
                      <img src="check.png" alt="" />
                    </div>
                    <div
                      className={classes.main_result}
                      dangerouslySetInnerHTML={{ __html: rephraseResponse }}
                    />
                    <div className={classes.result_foot}>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) => setRephraseResponse("")}
                      >
                        <RiDeleteBinLine className={classes.delete_icon} />
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={(e) =>
                          handleCopyClick(rephraseResponse, setRephraseCopied)
                        }
                        title="Copy"
                      >
                        {rephraseCopied ? (
                          <GiCheckMark className={classes.delete_icon} />
                        ) : (
                          <AiOutlineCopy className={classes.delete_icon} />
                        )}
                      </button>
                      <button
                        className={classes.del_btn}
                        type="submit"
                        onClick={handleClick}
                        title="Translate"
                      >
                        <MdOutlineGTranslate className={classes.delete_icon} />
                      </button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={() =>
                            handleSpanishTranslate(
                              rephraseResponse,
                              setRephraseSpanishLoading,
                              setSpanishTranslate
                            )
                          }
                        >
                          {rephraseSpanishLoading
                            ? "Translating..."
                            : "Spanish"}
                        </MenuItem>
                        <MenuItem onClick={handleClose}>French</MenuItem>
                        <MenuItem onClick={handleClose}>Italian</MenuItem>
                      </Menu>

                      <Dialog
                        open={spanishTranslate !== "" && true}
                        onClose={handleDialogClose}
                      >
                        <div className={classes.dialog}>
                          <div className={classes.result_head}>
                            <p className={classes.result_title}>
                              Translate Complete
                            </p>
                            <img src="check.png" alt="" />
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: spanishTranslate,
                            }}
                            className={classes.translate_dialog}
                          />

                          <div className={classes.dialog_btn_container}>
                            <button
                              className={classes.btn}
                              onClick={() =>
                                handleCopyClick(
                                  spanishTranslate,
                                  setTranslateCopied
                                )
                              }
                            >
                              {translateCopied ? (
                                <GiCheckMark className={classes.delete_icon} />
                              ) : (
                                "Copy translation"
                              )}
                            </button>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
              {showTopBtn && (
                <div
                  style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    background: "#FFA944",
                    padding: 15,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                  onClick={() => scrollToTop()}
                >
                  <MdArrowUpward />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default App;
