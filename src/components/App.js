import React from "react";

import useApi from "../hooks/useApi";

import Main from "./Home";
import NotLoggedIn from "./NotLoggedIn";

function App() {
  const [isLoggedIn, loading, error] = useApi(
    "https://variation-roster-helper.herokuapp.com/api/isLoggedIn"
  );

  if (error) {
    return <div>error !</div>;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  return <Main />;

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return <Main />;
}

export default App;
