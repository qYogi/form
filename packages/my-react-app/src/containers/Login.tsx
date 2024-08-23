import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./Login.css";
import "../index.css";
import { useAppContext } from "../lib/contextLib.ts";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 6;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
    } catch (error) {
      // Prints the full error
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <div className="Login">
      <div className="header text-center mx-4 ">
        <Row>
          <Col>
            <h3>Sign in to your account</h3>
            <p>
              Not a member? <Link to="/signup">Sign up</Link>
            </p>
          </Col>
        </Row>
      </div>
      <Form className=" formContainer mx-2" onSubmit={handleSubmit}>
        <Stack className="stack" gap={4}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button size="lg" type="submit" disabled={!validateForm()}>
            Sign in
          </Button>
        </Stack>
      </Form>
    </div>
  );
}
