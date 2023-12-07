
import Link from "next/link";
import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { isAuthenticated, removeToken, readToken } from "@/lib/authenticate";
export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();
  const [searchValue, setValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  async function submitForm(e) {
    e.preventDefault();

    setValue("");
    setIsExpanded(false);
    let queryString = `title=true&q=${searchValue}`;
    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?title=true&q=${searchValue}`);
  }

  function logout() {}
  return (
    <>
      <Navbar
        className="fixed-top navbar-dark bg-primary"
        expand="lg"
        expanded={isExpanded}>
        <Container>
          <Navbar.Brand>DAI ANH BUI</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          />
          {isAuthenticated() ? (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link legacyBehavior passHref href="/">
                  <Nav.Link
                    onClick={() => {
                      setIsExpanded(false);
                    }}>
                    Home
                  </Nav.Link>
                </Link>

                <Link legacyBehavior passHref href="/search">
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={() => {
                      setIsExpanded(false);
                    }}>
                    Advanced Search
                  </Nav.Link>
                </Link>
              </Nav>
              &nbsp;
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button className="btn btn-success" type="submit">
                  Search
                </Button>
              </Form>
              &nbsp; &nbsp;
              <NavDropdown
                title={readToken().userName}
                id="basic-nav-dropdown"
                style={{ color: "white" }}>
                <Link legacyBehavior passHref href="/favourites">
                  <NavDropdown.Item
                    onClick={() => {
                      setIsExpanded(false);
                    }}>
                    Favourites
                  </NavDropdown.Item>
                </Link>
                <Link legacyBehavior passHref href="/history">
                  <NavDropdown.Item
                    active={router.pathname === "/history"}
                    onClick={() => {
                      setIsExpanded(false);
                    }}>
                    Search History
                  </NavDropdown.Item>
                </Link>
                <Link href="/login" legacyBehavior passHref>
                  <NavDropdown.Item
                    onClick={() => {
                      setIsExpanded(false);
                      removeToken();
                    }}
                    active={router.pathname === "/login"}>
                    Logout
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Navbar.Collapse>
          ) : (
            <></>
          )}
          ;
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
