import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryType from '../../types/CategoryType';
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';


interface HomePageState {
  // isUserLoggedIn: boolean;
  categories: CategoryType[];  
}

class HomePage extends React.Component {
  state: HomePageState;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      // isUserLoggedIn: true,
      categories: []
    }
  }

  componentWillMount(){
    this.getCategories();
  }

  componentWillUpdate(){
    this.getCategories();
  }

  private getCategories() {
    api('api/category', 'get', {})
      .then((res: ApiResponse) => {
        console.log(res)
      })
  }
  render() {
  return (
    <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faListAlt } />  Top level categories
                    </Card.Title>
                    <CardDeck>
                    { this.state.categories.map(this.singleCategory) }
                    </CardDeck>
                </Card.Body>
            </Card>
    </Container>
  );
  }

  private singleCategory(category: CategoryType){
    return(
      <Card>
        <Card.Body>
        <Card.Title>
          { category.name }
        </Card.Title>
        <Link to={ `/category/${ category.categoryId }`} className="btn btn-primary">
          Open Category
        </Link>
        </Card.Body>
      </Card>
    )
  }
}

export default HomePage;
