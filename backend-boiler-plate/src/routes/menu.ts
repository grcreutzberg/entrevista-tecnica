import express from 'express';
import Menu from '../controllers/menu';
import validation from '../validation/menu';

const routes = express.Router();

routes.post('/', validation.upsert, Menu.create);
routes.get('/:id', validation.objectId, Menu.getOne);
routes.get('/', Menu.getTree);
//routes.put('/:id', validation.objectId, validation.upsert, Menu.update);
routes.delete('/:id', validation.objectId, Menu.delete);

export default routes;
