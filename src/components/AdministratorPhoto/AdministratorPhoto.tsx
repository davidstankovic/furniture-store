import React from 'react';
import { Container, Card, Row, Col, Button, Form, Nav } from 'react-bootstrap';
import { faImages, faMinus, faPlus, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import RoleMainMenu from '../RoleMainMenu/RoleMainMenu';
import api, { ApiResponse, apiFile } from '../../api/api';
import PhotoType from '../../types/PhotoType';
import { ApiConfig } from '../../config/api.confing';

interface AdministratorPhotoProperties {
    match: {
        params: {
            fId: number;
        }
    }
}

interface AdministratorPhotoState {
    isAdministratorLoggedIn: boolean;
    photos: PhotoType[];
}

class AdministratorPhoto extends React.Component<AdministratorPhotoProperties> {
    state: AdministratorPhotoState;

    constructor(props: Readonly<AdministratorPhotoProperties>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            photos: [],
        };
    }

    componentDidMount() {
        this.getPhotos();
    }

    componentDidUpdate(oldProps: any){
        if (this.props.match.params.fId === oldProps.match.params.fId){
            return;
        }
        this.getPhotos();
    }

    private getPhotos() {
        api('/api/furniture/' + this.props.match.params.fId + '/?join=photos', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            this.setState(Object.assign(this.state, {
                photos: res.data.photos,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RoleMainMenu role="administrator" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Photos
                        </Card.Title>
                        <Nav className="mb-5">
                            <Nav.Item>
                                <Link to="/administrator/dashboard/furnitures" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={ faBackward }/> Go back to furnitures
                                </Link>
                            </Nav.Item>
                        </Nav>
                      <Row>
                          { this.state.photos.map(this.printSinglePhoto, this) }
                      </Row>

                      <Form className="mt-5">
                          <p>
                              <strong>Add new photo for this furniture</strong>
                          </p>
                          <Form.Group>
                              <Form.Label htmlFor="new-photo">New Furniture photo</Form.Label>
                              <Form.File id="new-photo"/>
                          </Form.Group>
                          <Form.Group>
                              <Button variant="primary"
                                      onClick={ () => this.doUpload()}>
                                  <FontAwesomeIcon icon={ faPlus }/> Upload photo
                              </Button>
                          </Form.Group>
                      </Form>
                    </Card.Body>
                </Card>

                
            </Container>
        );
    }

    private printSinglePhoto(photo: PhotoType){
        return (
            <Col xs="12" sm="6" md="4" lg="3">
                <Card>
                    <Card.Body>
                        <img alt={ "Photo " + photo.photoId }
                             src={ ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath }
                             className="w-100"/>
                    </Card.Body>
                    <Card.Footer>
                        { this.state.photos.length > 1 ? (
                            <Button variant="danger" block
                                    onClick={ () => this.deletePhoto(photo.photoId) }>
                                <FontAwesomeIcon icon={ faMinus }/> Delete photo
                            </Button>
                        ): '' }
                    </Card.Footer>
                </Card>
            </Col>
        )
    }
    private async doUpload(){
        const filePicker: any = document.getElementById('new-photo');

        if(filePicker?.files.length === 0){
            return;
        }

        const file = filePicker.files[0];
        await this.uploadFurniturePhoto(this.props.match.params.fId, file);
        filePicker.value = '';
        this.getPhotos();

    }

    private async uploadFurniturePhoto(furnitureId: number, file: File){
        return await apiFile('/api/furniture/' + furnitureId + '/uploadPhoto/', 'photo', file, 'administrator');
    }

    private deletePhoto(photoId: number){
        if(!window.confirm('Are you sure?')){
            return;
        }
        api('/api/furniture/' + this.props.match.params.fId + '/deletePhoto/' + photoId + '/', 'delete', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }
                this.getPhotos();
            })
    }
}

export default AdministratorPhoto;
