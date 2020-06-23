import React from "react";
import { Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from "@fortawesome/free-solid-svg-icons";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";

export default class CustomerService extends React.Component {
    render(){
        return (
        <Container>
             <RoleMainMenu role="visitor"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faServer } /> Customer service
                    </Card.Title>
                    <Card.Text>
                    Customer service will be shown here...
                    </Card.Text>
                </Card.Body>
            </Card>
            
        </Container>
        );
    }
}