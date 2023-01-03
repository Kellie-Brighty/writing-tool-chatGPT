import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    maxWidth: 1400,
    margin: "auto",
    padding: 20,
    position: 'sticky',
    width: '100%',
    zIndex: 2,
    paddingLeft: 60,
    top: 0,
    left: 0,
    transition: '.5s',
    [theme.breakpoints.down("xs")]: {
      padding: 10
    }
  },
  headerScroll: {
    maxWidth: 1400,
    margin: "auto",
    background: "#fff",
    boxShadow: "0px 8px 24px 2px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    width: '100%',
    padding: 20,
    zIndex: 2,
    paddingLeft: 60,
    top: 0,
    left: 0,
    transition: '.5s',
    [theme.breakpoints.down("xs")]: {
      padding: 10
    }
  },
  inner_flex: {
    display: "flex",
    alignItems: "center",
  },
  logo_image: {
    [theme.breakpoints.down("xs")]: {
      width: 50
    }
  },
  logo_text: {
    fontSize: 32,
    marginLeft: 10,
    [theme.breakpoints.down("xs")]: {
      fontSize: 25,
    }
  },
  logo_item: {},
}));

const Header = () => {
  const classes = useStyles();
  const [navBackground, setNavBackground] = useState("header");

  const navRef = useRef();
  navRef.current = navBackground;
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (show) {
        setNavBackground("headerScroll");
      } else {
        setNavBackground("header");
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={classes[navRef.current]}>
      <div className={classes.inner_flex}>
        <img src="writefrenzylogo.png" alt="" className={classes.logo_image} />
        <p className={classes.logo_text}>WriteFrenzy</p>
      </div>
    </header>
  );
};

export default Header;
