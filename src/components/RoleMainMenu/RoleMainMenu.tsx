import React from 'react';
import { MainMenuItem, MainMenu } from '../MainMenu/MainMenu';

interface RoleMainMenuProperties{
    role: 'administrator' | 'visitor'
}
export default class RoleMainMenu extends React.Component <RoleMainMenuProperties>{
    render(){
        let items: MainMenuItem[] = [];

        switch(this.props.role){
            case 'visitor': items = this.getVisitorMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
        }
        return <MainMenu items={ items }/>
    }

    getAdministratorMenuItems(): MainMenuItem[]{
        return[
            new MainMenuItem("Dashboard", "/administrator/dashboard/"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }
    getVisitorMenuItems(): MainMenuItem[]{
        return[
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact/"),
            new MainMenuItem("Customer service", "/service/"),
            new MainMenuItem("Custom furniture", "/custom/"),
            new MainMenuItem("Administrator log in", "/administrator/login/")
        ];
    }
}