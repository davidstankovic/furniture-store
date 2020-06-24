import React, { useState } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { faListAlt, faPlus, faInfoCircle, faEdit, faSave, faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import FurnitureType from '../../types/FurnitureType';
import PhotoType from '../../types/PhotoType';
import ApiFurnitureDto from '../../dtos/ApiFurnitureDto';
import RoleMainMenu from '../RoleMainMenu/RoleMainMenu';
import api, { ApiResponse, apiFile } from '../../api/api';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import { ApiConfig } from '../../config/api.confing';

interface FurnitureState {
    furnitures: FurnitureType[];
    categories: CategoryType[];
    status: string[];
    photos: PhotoType[];

    editModal: {
        furnitureId?: number;
        message: string;
        name: string;
        categoryId: number;
        description: string;
        status: string;
        price: number;
        features: {
            featureId: number;
            name: string;
            value: string;
        }[];
    };
}

interface FurniturePageProperties {
    match: {
        params: {
            fId: number;
        }
    }
}

interface FeatureBaseType {
    name: string;
    featureId: number;
}

class FurniturePage extends React.Component<FurniturePageProperties> {
    state: FurnitureState;

    constructor(props: Readonly<FurniturePageProperties>) {
        super(props);

        this.state = {
            furnitures: [],
            categories: [],
            photos: [],
            status: [
                "available",
                "visible",
                "hidden"
            ],

            editModal: {
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
        this.getPhotos();
        this.getFurnitures();
    }
    componentDidUpdate(oldProps: any){
        if (this.props.match.params.fId === oldProps.match.params.fId){
            return;
        }
        this.getPhotos();
    }
    private getPhotos() {
        api('/api/furniture/' + this.props.match.params.fId + '/?join=photos', 'get', {}, 'visitor')
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            this.setState(Object.assign(this.state, {
                photos: res.data.photos,
            }));
        });
    }

    private async getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]>{
        return new Promise(resolve => {
            api('/api/feature/?filter=categoryId||$eq||' + categoryId + '/', 'get', {}, 'visitor')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
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
        api('/api/category/', 'get', {}, 'visitor')
        .then((res: ApiResponse) => {
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
        api('/api/furniture/?join=furnitureFeatures&join=features&join=furniturePrices&join=photos', 'get', {}, 'visitor')
        .then((res: ApiResponse) => {
            this.putFurnituresInState(res.data);
        });
    }
    private putFurnituresInState(data?: ApiFurnitureDto[]){
        const furnitures: FurnitureType[] = data?.filter(furniture => furniture.furnitureId == this.props.match.params.fId).map(furniture => {
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

    render() {

        return (
            <Container>
                <RoleMainMenu role="visitor" />  
                 { this.state.furnitures.map(furniture => (
                <>
                
                    <h1 className="my-4">{ furniture.name } 
                            <small>|{ furniture.category?.name }</small>
                    </h1>
                    <div className="row">

                        <div className="col-md-8">
                        {this.state.photos.map(this.printSinglePhoto, this)[0]}
                    </div>
                        <div className="col-md-4">
                        <h3 className="my-3">Description</h3>
                        <p>{ furniture.description }</p>
                        <Button variant="info" size="sm"
                            onClick={ () => this.showEditModal(furniture)} 
                            >
                            <FontAwesomeIcon icon={ faInfoCircle } /> Details
                        </Button>
                        <ul>
                            { this.state.editModal.features.map( this.printEditModalFeatureInput, this) }
                        </ul>
                        Availability: { furniture.status }
                        <br/>
                        Price: { furniture.price }
                        </div>

                    </div>
                    <h3 className="my-4">More images:</h3>

                    <div className="row mb-4 row-sm-6">

                    <Row xs="12" sm="6" md="4" lg="3">
                        {this.state.photos.map(this.printSinglePhoto, this).slice(1, this.state.photos.map(this.printSinglePhoto, this).length)}
                    </Row>
                </div>
  </>
        ), this) }
            </Container>
        );
    }

    private printSinglePhoto(photo: PhotoType){
        return (
                <Card>
                    <Card.Body>
                        <img alt={ "Photo " + photo.photoId }
                             src={ ApiConfig.PHOTO_PATH + photo.imagePath }
                             className="w-100"/>
                    </Card.Body>
                </Card>
        )
    }
    private printEditModalFeatureInput(feature: any){
        return (
            <Form.Group>
                <Row>
                    { feature.name }: { feature.value }<br/>
                </Row>
            </Form.Group>
        );
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
            apiFeature.value = '';
            if(!furniture.furnitureFeatures){
                continue;
            }
            for(const furnitureFeature of furniture.furnitureFeatures){
                if(furnitureFeature.featureId===apiFeature.featureId){
                    apiFeature.value = furnitureFeature.value
                }
            }
        }

        this.setState(Object.assign(this.state,
                Object.assign(this.state.editModal, {
                    features: allFeatures
                })))

    }

    private doEditFurniture() {
        api('/api/furniture/' + String(this.state.editModal.furnitureId), 'patch', {
            name: this.state.editModal.name,
            description: this.state.editModal.description,
            price: this.state.editModal.price,
            status: this.state.editModal.status,
            features: this.state.editModal.features
            .map(feature => ({
                featureId: feature.featureId,
                value: feature.value
            }))
        }, 'visitor')
        .then((res: ApiResponse) => {

            if (res.status === 'error') {
                this.setEditModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            this.setEditModalVisibleState(false);
            this.getFurnitures();
        });
    }
}
export default FurniturePage;