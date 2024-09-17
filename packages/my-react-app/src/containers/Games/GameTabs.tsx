import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./navTabs.css";
import { Button } from "react-bootstrap";

export const GameTabs = () => {
  return (
    <Tabs defaultActiveKey="Introduction" id="fill-tabs" className="mb-3" fill>
      <Tab eventKey="Introduction" title="Introduction">
        <div>
          <h3>Introduction</h3>
          <p>
            Welcome to the Games section! Here you can find a collection of
            classic games to enjoy at your leisure. The range of games you can
            choose from will periodiccaly be updated with new titles, so be sure
            to check back often for fresh content.
          </p>
        </div>
      </Tab>
      <Tab eventKey="tic-tac-toe" title="Tic Tac Toe">
        <div>
          <h3>Tic Tac Toe</h3>
          <p>
            Tic Tac Toe is a classic game that is perfect for passing the time
            and challenging your friends.
          </p>
          <Button href="/TicTacToe">Play</Button>
        </div>
      </Tab>
    </Tabs>
  );
};
