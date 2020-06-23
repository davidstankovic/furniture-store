import React from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import { faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoleMainMenu from '../RoleMainMenu/RoleMainMenu';


interface AdministratorDashboardState {
   isAdministratorLoggedIn: boolean;
}

class AdministratorDashboard extends React.Component {
  state: AdministratorDashboardState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
        isAdministratorLoggedIn: true
    }
  }

  componentWillMount(){
    this.getMyData();
  }

  componentWillUpdate(){
    this.getMyData();
  }

  private getMyData(){
    api('/api/administrator/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if(res.status === "error" || res.status === "login"){
                this.setLogginState(false);
                return;
            }
        });
  }

  private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
          isAdministratorLoggedIn: isLoggedIn
      }))
  }

  render() {
      if(this.state.isAdministratorLoggedIn===false){
          return (
              <Redirect to="/administrator/login"/>
          );
      }
  return (
    <Container>
         <RoleMainMenu role="administrator"/>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faHandsHelping } />  Administrator Dashboard
                    </Card.Title>
                    <Row>
                    <ul>
                        <li>
                            <Link to="/administrator/dashboard/category/">
                                Categories
                            </Link> 
                        </li>
                        <li>
                            <Link to="/administrator/dashboard/furnitures/">
                                Furnitures
                            </Link> 
                        </li>
                    </ul>
                    </Row>
                </Card.Body>
            </Card>
    </Container>
  );
  }}

export default AdministratorDashboard;
