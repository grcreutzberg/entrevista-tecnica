import mongoose from "mongoose";
import Menu from "../models/menu";

export default {

    isNullOrUndefined(data: String) {
        if (data === undefined || data === null || data === '') {
            return true;
        }
        return false;
    },

    isValidId(data: String) {
        if (mongoose.isValidObjectId(data)) {
            return true;
        }
        return false;
    },

    async removeSubMenu(id: any) {
        const menu = await Menu.find();
        const submenu = menu.filter((related: { relatedId: any; }) => related.relatedId[0] && related.relatedId[0].toString() === id.toString());
        for (let item of submenu) {
            await this.removeSubMenu(item._id);
            await Menu.deleteOne({ _id: item._id })
        }
    },

    menuTree(data: any) {
        let tree: any[] = [];
        const firstLevel = data.filter((item: { relatedId: any; }) => !item.relatedId[0]);
        for (let item of firstLevel) {
            let branch = {
                id: item._id,
                name: item.name,
                submenu: []
            }
            tree.push(branch);
        }
        buildTree(data, tree);
        return tree;
    }
}

function buildTree(data: any, tree: any[]) {
    tree.forEach(branch => {
        const level = data.filter((related: { relatedId: any; }) => related.relatedId[0] && related.relatedId[0].toString() === branch.id.toString());
        for (let item of level) {
            let newItem = {
                id: item._id,
                name: item.name,
                submenu: []
            }
            branch.submenu.push(newItem);
        }
        buildTree(data, branch.submenu);
    });
}
