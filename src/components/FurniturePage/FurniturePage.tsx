import React from "react";
import api, { ApiResponse } from "../../api/api";
import FurnitureType from "../../types/FurnitureType";
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";
import { Container } from "react-bootstrap";


interface FurniturePageProperties {
    match: {
        params: {
            fId: number;
        }
    }
}

interface FurniturePageState {
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
}


export default class FurniturePage extends React.Component<FurniturePageProperties> {
    state: FurniturePageState;

    constructor(props: Readonly<FurniturePageProperties>) {
        super(props);

        this.state = {
                message: '',
                name: '',
                categoryId: 1,
                description: '',
                status: 'available',
                price: 0.01,
                features: [],
        }
    }

    private setFurnitureData(furniture: FurnitureType) {
        this.setState(Object.assign(this.state, {
            furniture: furniture
        }))
    }

    componentDidMount() {
        this.getFurniture();
    }

    componentDidUpdate(oldProperties: FurniturePageProperties) {
        if (oldProperties.match.params.fId === this.props.match.params.fId) {
            return;
        }
        this.getFurniture();
    }

    private getFurniture() {
        api('/api/furniture/' + this.props.match.params.fId , 'get', {})
        .then((res: ApiResponse) => {
            const furnitureData: FurnitureType = {
                furnitureId: res.data.furnitureId,
                name: res.data.name,
                description: res.data.description,
                imageUrl: res.data.photos[0].imagePath,
                price: res.data.furniturePrices[res.data.furniturePrices.length-1].price,
                status: res.data.status,
                furnitureFeatures: res.data.furnitureFeatures,
                features: res.data.features,
                furniturePrices: res.data.furniturePrices,
                photos: res.data.photos,
                category: res.data.category,
                categoryId: res.data.categoryId
            }
            this.setFurnitureData(furnitureData);
        });
    }

    render() {
        return(
        <Container>
            <RoleMainMenu role="visitor"/>
        <h1>{this.state.status.toString()}
            {this.state.price}
            {this.state.categoryId}
            {this.state.name}
        </h1>
        </Container>
        );
    }
}