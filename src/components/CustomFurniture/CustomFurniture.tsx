import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";

export default class CustomFurniture extends React.Component {
    render(){
        return (
        <Container>
             <RoleMainMenu role="visitor"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faCubes } /> Custom furniture
                    </Card.Title>
                    <Card.Text>
                    Custom furniture will be shown here...
                    </Card.Text>
                </Card.Body>
            </Card>
            
        </Container>
        );
    }
}