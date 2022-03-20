import { Request, Response } from 'express';
import Menu from '../models/menu';
import Funcao from '../utils/funcao';

export default {
    create: async (request: Request, response: Response): Promise<Response> => {
        try {
            const { name, relatedId } = request.body;

            if (!Funcao.isNullOrUndefined(relatedId) && !Funcao.isValidId(relatedId)) {
                return response.status(400).json({ message: 'relatedId must be a valid ID' });
            }

            const { id } = await Menu.create(request.body);
            return response.status(201).json({
                id
            });
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Error creating menu' });
        }
    },
    getOne: async (request: Request, response: Response): Promise<Response> => {
        try {
            const menu = await Menu.findOne({ _id: request.params.id });
            return response.json(menu);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Error loading menu' });
        }
    },
    getTree: async (request: Request, response: Response): Promise<Response> => {
        try {
            const menu = await Menu.find();
            const tree = await Funcao.menuTree(menu);
            return response.json(tree);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Error loading menu' });
        }
    },
    update: async (request: Request, response: Response): Promise<Response> => {
        try {
            const menu = await Menu.findOne({ _id: request.params.id });
            if (!menu || !menu?.id) {
                return response.status(400).json({ message: 'Menu not found' });
            }
            
            await Menu.updateOne({ id: menu.id }, request.body);
            return response.json({
                id: menu.id
            });
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Error updating menu' });
        }
    },
    delete: async (request: Request, response: Response): Promise<Response> => {
        try {
            const menu = await Menu.findOneAndDelete({ _id: request.params.id });
            if (!menu || !menu?.id) {
                return response.status(400).json({ message: 'Menu not found' });
            }
            Funcao.removeSubMenu(menu.id);
            return response.json({
                id: menu.id
            });
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Error deleting menu' });
        }
    }
}


