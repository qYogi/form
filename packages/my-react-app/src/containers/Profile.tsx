import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Profile.css";
import { ProfileImage } from "./Img/profileImage.tsx";
import { usePlan } from "../onboarding/FormContext.tsx";
import { PlanProvider } from "../onboarding/FormContext.tsx";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Stack from "react-bootstrap/Stack";
import { Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib.ts";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { name, email, phone, isYearly, selectedPlan } = usePlan();
  const { userHasAuthenticated } = useAppContext();

  const nav = useNavigate();

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    nav("/login");
  }

  return (
    <PlanProvider>
      <div className="profile-page">
        <Navbar collapseOnSelect bg="light" expand="md" className="px-4">
          <LinkContainer to="/profile">
            <Navbar.Brand className="Title text-muted mx-2">
              {name}
            </Navbar.Brand>
          </LinkContainer>
          <ProfileImage />
          <Navbar.Collapse className="justify-content-start">
            <Nav activeKey={window.location.pathname}>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="dashboard px-4">Dashboard</div>
        <div className="content flex-grow-1 px-4 py-5">
          <div className="profile flex-grow-1 py-3 px-2">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col xs="auto">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Plan information</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Billing Information</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col className="flex-grow-1">
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <div className="plan-info">
                        <Stack gap={2}>
                          <div className="tabTitle">
                            <h2>Your Selected Plan:</h2>
                          </div>
                          <div className="planName">
                            <h3>Plan Name - {selectedPlan?.planName}</h3>
                            <div className="planDescription">
                              {/*//add a description based on the plan name*/}
                              {selectedPlan?.planName === "Arcade" ? (
                                <p>
                                  Enjoy a basic selection of games and online
                                  play for casual gaming.
                                </p>
                              ) : selectedPlan?.planName === "Advanced" ? (
                                <p>
                                  Get access to a broader range of games, with
                                  added benefits like priority support.
                                </p>
                              ) : selectedPlan?.planName === "Pro" ? (
                                <p>
                                  Unlock all features, with exclusive game
                                  access and top-tier support.
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="selectedAddOns">
                            <h4>Selected Add-Ons</h4>
                          </div>
                          <div className="summary">
                            <h4>Summary</h4>
                            <p>
                              {/*You have selected the {selectedPlan?.planName}{" "}*/}
                              {/*{addOns && Object.keys(addOns).length > 0*/}
                              {/*  ? `with ${Object.keys(addOns)*/}
                              {/*      .map((id) => addOns[id].title)*/}
                              {/*      .join(" and ")}.`*/}
                              {/*  : "with no adds."}*/}
                            </p>
                          </div>
                        </Stack>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <Stack gap={2}>
                        <div className="tabTitle">
                          <h2>Billing Information</h2>
                        </div>
                        <div className="billingInfo">
                          <h3>Personal Details</h3>
                          <p>Name: {name}</p>
                          <p>Email: {email}</p>
                          <p>Phone: {phone}</p>
                        </div>
                        <div className="billingSummary">
                          <h4>Billing Summary</h4>
                          <p>
                            You are currently on the{" "}
                            {isYearly ? "yearly" : "monthly"} plan.
                          </p>
                          <p>Total Amount Due: </p>
                          <p>
                            Your next payment is due on{" "}
                            {new Date().toLocaleDateString()}.
                          </p>
                        </div>
                      </Stack>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
      </div>
    </PlanProvider>
  );
};
