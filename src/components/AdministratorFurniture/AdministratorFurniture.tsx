import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import FurnitureType from '../../types/FurnitureType';
import ApiFurnitureDto from '../../dtos/ApiFurnitureDto';
import RoleMainMenu from '../RoleMainMenu/RoleMainMenu';
import api, { ApiResponse, apiFile } from '../../api/api';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorFurnitureState {
    isAdministratorLoggedIn: boolean;
    furnitures: FurnitureType[];
    categories: CategoryType[];
    status: string[];

    addModal: {
        visible: boolean;
        message: string;
        name: string;
        categoryId: number;
        description: string;
        price: number;
        features: {
            use: number;
            featureId: number;
            name: string;
            value: string;
        }[];

    };

    editModal: {
        furnitureId?: number;
        visible: boolean;
        message: string;
        name: string;
        categoryId: number;
        description: string;
        status: string;
        price: number;
        features: {
            use: number;
            featureId: number;
            name: string;
            value: string;
        }[];
    };
}

interface FeatureBaseType {
    name: string;
    featureId: number;
}

class AdministratorFurniture extends React.Component {
    state: AdministratorFurnitureState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            furnitures: [],
            categories: [],
            status: [
                "available",
                "visible",
                "hidden"
            ],
            
            addModal: {
                visible: false,
                name: '',
                categoryId: 1,
                description: '',
                price: 0.01,
                features: [],
                message: '',
            },

            editModal: {
                visible: false,
                message: '',
                name: '',
                categoryId: 1,
                description: '',
                status: 'available',
                price: 0.01,
                features: [],
            },
        };
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            }),
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            }),
        ));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    private setAddModalFeatureUse(featureId: number, use: boolean){
        const addFeatures: {featureId: number; use:number;}[] = [... this.state.addModal.features];
        for (const feature of addFeatures){
            if(feature.featureId === featureId){
                feature.use = use ? 1 : 0;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: addFeatures
            })));
    }

    private setAddModalFeatureValue(featureId: number, value: string){
        const addFeatures: {featureId: number; value:string;}[] = [... this.state.addModal.features];
        for (const feature of addFeatures){
            if(feature.featureId === featureId){
                feature.value = value;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: addFeatures
            })));
    }

    private setEditModalFeatureUse(featureId: number, use: boolean){
        const editFeatures: {featureId: number; use:number;}[] = [... this.state.editModal.features];
        for (const feature of editFeatures){
            if(feature.featureId === featureId){
                feature.use = use ? 1 : 0;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                features: editFeatures
            })));
    }

    private setEditModalFeatureValue(featureId: number, value: string){
        const editFeatures: {featureId: number; value:string;}[] = [... this.state.editModal.features];
        for (const feature of editFeatures){
            if(feature.featureId === featureId){
                feature.value = value;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                features: editFeatures
            })));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            }),
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            }),
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: number) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            }),
        ));
    }

    componentDidMount() {
        this.getCategories();
        this.getFurnitures();
    }

    private async getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]>{
        return new Promise(resolve => {
            api('/api/feature/?filter=categoryId||$eq||' + categoryId + '/', 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return resolve([]);
                }

                const features: FeatureBaseType[] = res.data.map((item: any) => ({
                    featureId: item.featureId,
                    name: item.name
                }));

                resolve(features)
            })
        })
        
    }

    private getCategories() {
        api('/api/category/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            this.putCategoriesInState(res.data);
        });
    }
    private putCategoriesInState(data?: ApiCategoryDto[]){
        const categories: CategoryType[] = data?.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                parentCategoryId: category.parentCategoryId,
                imagePath: category.imagePath
            }
        });
        this.setState(Object.assign(this.state,{
            categories: categories
        }))
    }

    private getFurnitures() {
        api('/api/furniture/?join=furnitureFeatures&join=features&join=furniturePrices&join=photos', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            this.putFurnituresInState(res.data);
        });
    }
    private putFurnituresInState(data?: ApiFurnitureDto[]){
        const furnitures: FurnitureType[] = data?.map(furniture => {
            return {
                furnitureId: furniture.furnitureId,
                name: furniture.name,
                description: furniture.description,
                imageUrl: furniture.photos[0].imagePath,
                price: furniture.furniturePrices[furniture.furniturePrices.length-1].price,

                status: furniture.status,
                furnitureFeatures: furniture.furnitureFeatures,
                features: furniture.features,
                furniturePrices: furniture.furniturePrices,
                photos: furniture.photos,
                category: furniture.category,
                categoryId: furniture.categoryId
            }
        });
        this.setState(Object.assign(this.state,{
            furnitures: furnitures
        }))
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>){
        this.setAddModalNumberFieldState('categoryId', event.target.value);
        const features = await this.getFeaturesByCategoryId(this.state.addModal.categoryId);

        const stateFeatures = features.map(feature => ({
            featureId: feature.featureId,
            name: feature.name,
            value: '',
            use: 0,
        }));

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: stateFeatures
            })));
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
                            <FontAwesomeIcon icon={ faListAlt } /> Furnitures
                        </Card.Title>

                        <Table hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th colSpan={ 5 }></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                                onClick={ () => this.showAddModal() }>
                                            <FontAwesomeIcon icon={ faPlus } /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th className="text-right">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.furnitures.map(furniture => (
                                    <tr>
                                        <td className="text-right">{ furniture.furnitureId }</td>
                                        <td>{ furniture.name }</td>
                                        <td>{ furniture.category?.name }</td>
                                        <td>{ furniture.status }</td>
                                        {/* <td>{ furniture.isPromoted ? 'Yes' : 'No' }</td> */}
                                        <td className="text-right">{ furniture.price }</td>
                                        <td className="text-center">
                                        <Link to={"/administrator/dashboard/photo/" + furniture.furnitureId }
                                                className="btn btn-sm btn-info mr-3">
                                                    <FontAwesomeIcon icon={ faImages }/> Photos
                                                </Link>
                                        <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(furniture) }>
                                            <FontAwesomeIcon icon={ faEdit } /> Edit
                                        </Button>
                                        </td>
                                    </tr>
                                ), this) }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal centered show={ this.state.addModal.visible }
                                onHide={ () => this.setAddModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new furniture
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                    <Form.Group>
                            <Form.Label htmlFor="new-categoryId">Select category</Form.Label>
                            <Form.Control id="new-categoryId" as="select"
                                            value={ this.state.addModal.categoryId.toString() }
                                            onChange={ (e) => this.addModalCategoryChanged(e as any) }>
                                { this.state.categories.map(category => (
                                    <option value={ category.categoryId?.toString() }>
                                        { category.name }
                                    </option>
                                )) }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-name">Name</Form.Label>
                            <Form.Control type="text" id="new-name"
                                            value={ this.state.addModal.name }
                                            onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-description">Description</Form.Label>
                            <Form.Control as="textarea" id="new-description"
                                            value={ this.state.addModal.description }
                                            onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) } 
                                            rows={10}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-price">Price</Form.Label>
                            <Form.Control type="number" id="new-price" min={ 0.01 } step={ 0.01 } 
                                            value={ this.state.addModal.price }
                                            onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value) } />
                        </Form.Group>
                        <div>
                            { this.state.addModal.features.map( this.printAddModalFeatureInput, this) }
                        </div>

                        <Form.Group>
                            <Form.Label htmlFor="new-photo">Furniture Photo</Form.Label>
                            <Form.File id="new-photo" />
                        </Form.Group>

                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddFurniture() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add furniture
                            </Button>
                        </Form.Group>

                        { this.state.addModal.message ? (
                            <Alert variant="danger" value={ this.state.addModal.message } />
                        ): '' }
                    </Modal.Body>
                </Modal>

                <Modal centered show={ this.state.editModal.visible }
                                onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit furniture
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-name">Name</Form.Label>
                            <Form.Control type="text" id="edit-name"
                                            value={ this.state.editModal.name }
                                            onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-description">Description</Form.Label>
                            <Form.Control as="textarea" id="edit-description"
                                            value={ this.state.editModal.description }
                                            onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) } 
                                            rows={10}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-status">Select status</Form.Label>
                            <Form.Control id="edit-status" as="select"
                                            value={ this.state.editModal.status.toString() }
                                            onChange={ (e) => this.setEditModalStringFieldState('status', e.target.value) }>
                                <option value="available">Available</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-price">Price</Form.Label>
                            <Form.Control type="number" id="edit-price" min={ 0.01 } step={ 0.01 } 
                                            value={ this.state.editModal.price }
                                            onChange={ (e) => this.setEditModalNumberFieldState('price', Number(e.target.value)) } />
                        </Form.Group>
                        <div>
                            { this.state.editModal.features.map( this.printEditModalFeatureInput, this) }
                        </div>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doEditFurniture() }>
                                <FontAwesomeIcon icon={ faSave } /> Edit furniture
                            </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (
                            <Alert variant="danger" value={ this.state.editModal.message } />
                        ): '' }
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }
    private printEditModalFeatureInput(feature: any){
        return (
            <Form.Group>
                <Row>
                    <Col xs="4" sm="1" className="text-center">
                    <input type="checkbox" value="1" checked={ feature.use === 1 }
                            onChange={ (e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked) }/>
                    </Col>
                    <Col xs="8" sm="3">
                    { feature.name } 
                    </Col>
                    <Col xs="12" sm="8">
                    <Form.Control type="text" value={ feature.value }
                        onChange={ (e) => this.setEditModalFeatureValue(feature.featureId, e.target.value) } />
                    </Col>
                </Row>
            </Form.Group>
        );
    }

    private printAddModalFeatureInput(feature: any){
        return (
            <Form.Group>
                <Row>
                    <Col xs="4" sm="1" className="text-center">
                    <input type="checkbox" value="1" checked={ feature.use === 1 }
                            onChange={ (e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked) }/>
                    </Col>
                    <Col xs="8" sm="3">
                    { feature.name } 
                    </Col>
                    <Col xs="12" sm="8">
                    <Form.Control type="text" value={ feature.value }
                        onChange={ (e) => this.setAddModalFeatureValue(feature.featureId, e.target.value) } />
                    </Col>
                </Row>
            </Form.Group>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('message', '');
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('imagePath', '');
        this.setAddModalNumberFieldState('parentFurnitureId', 'null');
        this.setAddModalVisibleState(true);
    }

    private doAddFurniture() {
        const filePicker: any = document.getElementById('new-photo')
        if(filePicker?.files.length === 0){
            this.setAddModalStringFieldState('message', 'You must select a file to upload!');
                return;
        }
        api('/api/furniture/', 'post', {
            categoryId: this.state.addModal.categoryId,
            name: this.state.addModal.name,
            description: this.state.addModal.description,
            price: this.state.addModal.price,
            features: this.state.addModal.features
            .filter(feature => feature.use === 1)
            .map(feature => ({
                featureId: feature.featureId,
                value: feature.value
            }))
        }, 'administrator')
        .then(async(res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            if (res.status === 'error') {
                this.setAddModalStringFieldState('message', res.data.toString());
                return;
            }

            const furnitureId: number = res.data.furnitureId;
            
            const file = filePicker.files[0];
            const res2 = await this.uploadFurniturePhoto(furnitureId, file);

            this.getFurnitures();
            this.setAddModalVisibleState(false);
        });
    }

    private async uploadFurniturePhoto(furnitureId: number, file: File){
        return await apiFile('/api/furniture/' + furnitureId + '/uploadPhoto/', 'photo', file, 'administrator');
    }

     private async showEditModal(furniture: FurnitureType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('name', String(furniture.name));
        this.setEditModalNumberFieldState('furnitureId', furniture.furnitureId);
        this.setEditModalStringFieldState('description', String(furniture.description));
        this.setEditModalStringFieldState('status', String(furniture.status));
        this.setEditModalNumberFieldState('price', furniture.price);
        // features ->>>>
        if(!furniture.categoryId) {
            return
        }
        const categoryId: number = furniture.categoryId;
        const allFeatures: any[] = await this.getFeaturesByCategoryId(categoryId);
        for (const apiFeature of allFeatures){
            apiFeature.use = 0;
            apiFeature.value = '';
            if(!furniture.furnitureFeatures){
                continue;
            }
            for(const furnitureFeature of furniture.furnitureFeatures){
                if(furnitureFeature.featureId===apiFeature.featureId){
                    apiFeature.use = 1;
                    apiFeature.value = furnitureFeature.value
                }
            }
        }

        this.setState(Object.assign(this.state,
                Object.assign(this.state.editModal, {
                    features: allFeatures
                })))

        this.setEditModalVisibleState(true);
    }

    private doEditFurniture() {
        api('/api/furniture/' + String(this.state.editModal.furnitureId), 'patch', {
            name: this.state.editModal.name,
            description: this.state.editModal.description,
            price: this.state.editModal.price,
            status: this.state.editModal.status,
            features: this.state.editModal.features
            .filter(feature => feature.use === 1)
            .map(feature => ({
                featureId: feature.featureId,
                value: feature.value
            }))
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            if (res.status === 'error') {
                this.setEditModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            this.setEditModalVisibleState(false);
            this.getFurnitures();
        });
    }
}
export default AdministratorFurniture;