import { Application } from 'express';
import { DocsController } from '../controllers/docsController';
import ValidationMiddleware from '../middleware/ValidateMiddleware';
import AuthMiddelware from '../middleware/AuthMiddleware';
import { GetAllDocsDto, CreateDocsDto } from '../modules/document/docs.dto';

export class DocRoutes {
  private docs_controller: DocsController = new DocsController();

  public route(app: Application): void {
    app.route('/docs').get(this.docs_controller.healthy);
    app
      .get('/docs/:type', AuthMiddelware(1), this.docs_controller.view)
      .get('/docs/:type/:apply_id', AuthMiddelware(1), this.docs_controller.view)
      .post('/docs/get', AuthMiddelware(1), ValidationMiddleware(GetAllDocsDto, false), this.docs_controller.get)
      .post('/docs', AuthMiddelware(1), ValidationMiddleware(CreateDocsDto, false), this.docs_controller.create)
      .delete('/docs', AuthMiddelware(3), this.docs_controller.delete);
  }
}

// https://stackoverflow.com/questions/35847293/uploading-a-file-and-passing-a-additional-parameter-with-multer
