import React from "react";
import { Container, Card, Col, Row, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import api, { ApiResponse } from '../../api/api';
import { Link } from 'react-router-dom';
import FurnitureType from "../../types/FurnitureType";
import { ApiConfig } from "../../config/api.confing";

interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    subcategories?: CategoryType[];
    furnitures?: FurnitureType[];
    message: string;
    filters: {
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
    }
}

interface CategoryDto {
    categoryId: number;
    name: string;
}

interface FurnitureDto {
    furnitureId: number;
    name: string;
    description?: string;
    construction?: string;
    color?: string;
    height?: number;
    width?: number;
    deep?: number;
    material?: string;
    furniturePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;
    }[]
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;
    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            message: '',
            filters: {
                keywords: '',
                priceMinimum: 0.01,
                priceMaximum: 1000000,
                order: "price asc",
            }
        };
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message
        })
        this.setState(newState);
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category
        }))
    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories
        }))
    }

    private setFurnitures(furnitures: FurnitureType[]) {
        this.setState(Object.assign(this.state, {
            furnitures: furnitures
        }))
    }

    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> {this.state.category?.name}
                        </Card.Title>
                        {this.printOptionalMessage()}

                        {this.showSubcategories()}
                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>
                            <Col xs="12" md="8" lg="9">
                                {this.showFurnitures()}
                            </Col>
                        </Row>
                        <Card.Text>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private setNewFilter(newFilter: any){
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMaximum: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private applyFilters(){
        this.getCategoryData();
    }

    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">
                        Search keywords:
                    </Form.Label>
                    <Form.Control type="text" id="keywords" value={this.state.filters.keywords} onChange={(e) => this.filterKeywordsChanged(e as any)} />
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMin">
                                Min. price:
                            </Form.Label>
                            <Form.Control type="number" id="priceMin" step="0.01" min="0.01" max="999999.99" value={this.state.filters.priceMinimum} onChange={(e) => this.filterPriceMinChanged(e as any)} />

                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMax">
                                Max. price:
                            </Form.Label>
                            <Form.Control type="number" id="priceMax" step="0.01" min="0.02" max="1000000" value={this.state.filters.priceMaximum} onChange={(e) => this.filterPriceMaxChanged(e as any)} />

                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder" value={this.state.filters.order} onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - ascending</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" block onClick={() => this.applyFilters() }>
                        <FontAwesomeIcon icon={ faSearch }/> Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }
        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        )
    }

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
        );
    }
    private singleCategory(category: CategoryType) {
        return (
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title as="p">
                            {category.name}
                        </Card.Title>
                        <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm">
                            Open Category
            </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }


    private showFurnitures() {
        if (this.state.furnitures?.length === 0) {
            if (this.state.subcategories?.length === 0) {
                return (
                    <div>There are no furnitures to show in this category</div>
                )
            }
            return;
        }

        return (
            <Row>
                {this.state.furnitures?.map(this.singleFurniture)}
            </Row>
        )
    }

    private singleFurniture(furniture: FurnitureType) {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={furniture.name} src={ApiConfig.PHOTO_PATH + furniture.imageUrl}
                            className="w-100" />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">
                            <strong> {furniture.name} </strong>
                        </Card.Title>
                        <Card.Text>
                            {furniture.construction}
                        </Card.Text>
                        <Card.Text>
                            Price: {Number(furniture.price).toFixed(2)} RSD
            </Card.Text>
                        <Link to={`/furniture/${furniture.furnitureId}`} className="btn btn-primary btn-block btn-sm">
                            Open Furniture page
            </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }


    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    return this.setMessage('Request error. Please try to refresh the page.');
                }

                const categoryData: CategoryType = {
                    categoryId: res.data.categoryId,
                    name: res.data.name,
                };

                this.setCategoryData(categoryData);

                const subcategories: CategoryType[] = res.data.categories.map((category: CategoryDto) => {
                    return {
                        categoryId: category.categoryId,
                        name: category.name
                    }
                });

                this.setSubcategories(subcategories);
            });

            const orderParts = this.state.filters.order.split(' ');
            const orderBy = orderParts[0];
            const orderDirection = orderParts[1].toUpperCase();

        api('api/furniture/search', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            stores: [],
            orderBy: orderBy,
            orderDirection: orderDirection
        }).then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setFurnitures([]);
                return;
            }

            const furnitures: FurnitureType[] = res.data.map((furniture: FurnitureDto) => {

                const object: FurnitureType = {
                    furnitureId: furniture.furnitureId,
                    name: furniture.name,
                    description: furniture.description,
                    construction: furniture.construction,
                    color: furniture.color,
                    height: furniture.height,
                    width: furniture.width,
                    deep: furniture.deep,
                    material: furniture.material,
                    imageUrl: '',
                    price: 0,
                }

                if (furniture.photos !== undefined && furniture.photos?.length > 0) {
                    object.imageUrl = furniture.photos[furniture.photos?.length - 1].imagePath
                }

                if (furniture.furniturePrices !== undefined && furniture.furniturePrices?.length > 0) {
                    object.price = furniture.furniturePrices[furniture.furniturePrices?.length - 1].price;
                }

                return object
            })

            this.setFurnitures(furnitures);
        })
    }
}