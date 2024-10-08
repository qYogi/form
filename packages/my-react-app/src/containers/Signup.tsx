import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Link, useNavigate } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import { useAppContext } from "../lib/contextLib";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Col, Row } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { ISignUpResult } from "amazon-cognito-identity-js";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserId = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUserId(user.attributes.sub);
      console.log(userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const updateSubscription = async () => {
    try {
      const data = {
        planId: "not-selected",
        subscriptionType: "not-selected",
        addOnIds: JSON.stringify([]),
        isActive: "false",
        startedDate: "not-started",
      };

      const response = await API.put("form", `/updateSubscription/${userId}`, {
        body: data,
      });

      console.log("Update succsefull:", response);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 6 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      fetchUserId();
      await updateSubscription();
      userHasAuthenticated(true);
      nav("/form", { state: { email: fields.email } });
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="confirmationCode">
            <Form.Label>Confirmation Code</Form.Label>
            <Form.Control
              size="lg"
              autoFocus
              type="tel"
              onChange={handleFieldChange}
              value={fields.confirmationCode}
            />
            <Form.Text>Please check your email for the code.</Form.Text>
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
          >
            Verify
          </LoaderButton>
        </Stack>
      </Form>
    );
  }

  function renderForm() {
    return (
      <div className="Signup">
        <div className="header text-center mx-4 ">
          <Row>
            <Col>
              <h3>Create an account</h3>
              <p>
                Already a member? <Link to="/login">Sign in</Link>
              </p>
            </Col>
          </Row>
        </div>
        <Form className="formContainer" onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
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
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                onChange={handleFieldChange}
                value={fields.confirmPassword}
              />
            </Form.Group>
            <LoaderButton
              size="lg"
              type="submit"
              variant="success"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Signup
            </LoaderButton>
          </Stack>
        </Form>
      </div>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
