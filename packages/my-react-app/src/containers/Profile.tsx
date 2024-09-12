import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Profile.css";
import { usePlan } from "../onboarding/FormContext.tsx";
import { PlanProvider } from "../onboarding/FormContext.tsx";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Stack from "react-bootstrap/Stack";
import { API, Auth } from "aws-amplify";
import { useAppContext } from "../lib/contextLib.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "./Img";
import { IconTypes } from "./Img";

interface AddOnType {
  addOnTitle: string;
  addOnDescription: string;
  addOnMonthlyPrice: string;
  addOnYearlyPrice: string;
}

interface ProfileInfoType {
  plan: {
    planId: string;
    planName: string;
    planPriceYearly: number;
    planPriceMonthly: number;
    planIcon: IconTypes;
  };
  addOns: AddOnType[];
  startedDate: string;
}

interface UserInfoType {
  name: string;
  email: string;
  phone: string;
}

export const Profile = () => {
  const { isYearly } = usePlan();
  const { userHasAuthenticated } = useAppContext();
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType | null>(null);

  function getUserInfo() {
    //use Auth.currentAuthenticatedUser() to get the user info
    Auth.currentAuthenticatedUser()
      .then((user) => {
        const userInfo: UserInfoType = {
          name: user.attributes.name,
          email: user.attributes.email,
          phone: user.attributes.phone_number,
        };
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }

  function getProfileInfo() {
    API.get("form", "/getSubscription", {})
      .then((response) => {
        const profileInfo: ProfileInfoType = {
          plan: response.plan,
          addOns: response.addOns,
          startedDate: response.startedDate,
        };
        setProfileInfo(profileInfo);
      })
      .catch((error) => {
        console.error("Error fetching profile info:", error);
      });
  }

  useEffect(() => {
    getUserInfo();
    getProfileInfo();
  }, []);

  const nav = useNavigate();

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    nav("/login");
  }

  const addOnsTotalPrice =
    profileInfo?.addOns?.reduce(
      (total, addOn) =>
        total +
        (isYearly
          ? parseInt(addOn.addOnYearlyPrice)
          : parseInt(addOn.addOnMonthlyPrice)),
      0,
    ) || 0;

  const totalPrice =
    profileInfo && profileInfo.plan
      ? (isYearly
          ? profileInfo?.plan?.planPriceYearly
          : profileInfo?.plan?.planPriceMonthly) + addOnsTotalPrice
      : 0;
  return (
    <PlanProvider>
      <div className="profile-page">
        <Navbar collapseOnSelect bg="light" expand="md" className="px-4">
          <LinkContainer to="/profile">
            <Navbar.Brand className="Title text-muted mx-2">
              {userInfo?.name}
            </Navbar.Brand>
          </LinkContainer>
          {profileInfo?.plan?.planIcon && (
            <Icon iconType={profileInfo.plan.planIcon} />
          )}
          <Navbar.Collapse className="justify-content-start">
            <Nav activeKey={window.location.pathname}>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="dashboard px-4">Dashboard</div>

        <div className="content flex-grow-1 px-4 py-5">
          <div className="profile flex-grow-1 px-2">
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col className="nav-panel" xs="auto">
                  <Nav
                    variant="pills"
                    className="nav-panel-content flex-column"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="first">Plan information</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Billing Information</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col className="info-panel">
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <div className="plan-info">
                        <Stack gap={2}>
                          <div className="tabTitle">
                            <h2>Active Plan Overview</h2>
                          </div>
                          <div className="planName">
                            <h3>Plan Name - {profileInfo?.plan?.planName} </h3>
                            <div className="planDescription">
                              {profileInfo?.plan?.planName === "Arcade" ? (
                                <p>
                                  The Arcade plan offers a basic selection of
                                  games that are perfect for casual gamers, with
                                  access to a curated list of titles and
                                  essential online play features, allowing you
                                  to enjoy multiplayer action without any added
                                  frills, designed for those seeking a
                                  straightforward and relaxed gaming experience.
                                </p>
                              ) : profileInfo?.plan?.planName === "Advanced" ? (
                                <p>
                                  The Advanced plan broadens your gaming
                                  experience with an expanded library of games,
                                  providing not only a wider variety of
                                  entertainment but also additional perks such
                                  as priority support and early access to new
                                  releases, making it ideal for gamers who want
                                  more depth and enhanced services without going
                                  all in.
                                </p>
                              ) : profileInfo?.plan?.planName === "Pro" ? (
                                <p>
                                  The Pro plan unlocks the ultimate gaming
                                  experience, granting you full access to every
                                  game available, including exclusive titles and
                                  content, along with premium benefits such as
                                  priority customer support and personalized
                                  recommendations, designed for those who demand
                                  top-tier gaming and a fully immersive,
                                  high-end service.
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="selectedAddOns">
                            <h4>Selected Add-Ons</h4>
                            {profileInfo?.addOns &&
                            profileInfo?.addOns.length ? (
                              <ul>
                                {profileInfo?.addOns.map((addOn) => (
                                  <li key={addOn.addOnTitle}>
                                    {addOn.addOnTitle} -{" "}
                                    {addOn.addOnDescription}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No add-ons selected</p>
                            )}
                          </div>
                          <div className="summary">
                            <h4>Summary</h4>
                            <p>
                              You have selected the{" "}
                              {profileInfo?.plan?.planName}{" "}
                              {profileInfo?.addOns && profileInfo?.addOns.length
                                ? "with the following add-ons: " +
                                  profileInfo?.addOns
                                    .map((addOn) => addOn.addOnTitle)
                                    .join(", ")
                                : "NO ADD-ONS WERE SELECTED"}
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
                          <p>Name: {userInfo?.name}</p>
                          <p>Email: {userInfo?.email}</p>
                          <p>Phone: {userInfo?.phone}</p>
                        </div>
                        <div className="billingSummary">
                          <h4>Billing Summary</h4>
                          <p>
                            You are currently on the{" "}
                            {isYearly ? "yearly" : "monthly"} plan. You can
                            change your plan at ant time but you will be billed
                            for the new plan and won't receive a refund for the
                            current billing cycle.
                          </p>
                          <p>Total Amount Due: {totalPrice} </p>
                          {profileInfo?.startedDate ? (
                            <p>
                              Your next payment is due on{" "}
                              {isYearly
                                ? new Date(
                                    new Date(
                                      profileInfo.startedDate,
                                    ).setFullYear(
                                      new Date(
                                        profileInfo.startedDate,
                                      ).getFullYear() + 1,
                                    ),
                                  ).toLocaleDateString()
                                : new Date(
                                    new Date(profileInfo.startedDate).setMonth(
                                      new Date(
                                        profileInfo.startedDate,
                                      ).getMonth() + 1,
                                    ),
                                  ).toLocaleDateString()}
                            </p>
                          ) : (
                            <p>Start date is unavailable</p>
                          )}
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
