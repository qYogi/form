import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import "./Login.css";
import "../index.css";
import { useAppContext } from "../lib/contextLib.ts";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton.tsx";
import { onError } from "../lib/errorLib.ts";
import { useFormFields } from "../lib/hooksLib";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 6;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      userHasAuthenticated(true);
      nav("/form", { state: { email: fields.email } });
    } catch (error) {
      onError(error);
      setIsLoading(false);
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
      <Form className="formContainer mx-2" onSubmit={handleSubmit}>
        <Stack className="stack" gap={4}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Login
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}
