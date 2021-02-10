import { Application } from 'express';
import { AuditController } from '../controllers/auditController';
import { MappingDto, GetMappingDto } from '../modules/audit/index.dto';
import AuthMiddleware from '../middleware/AuthMiddleware';
import ValidationMiddleware from '../middleware/ValidateMiddleware';

export class AuditRoutes {
  private audit_controller: AuditController = new AuditController();

  public route(app: Application) {
    app.route('/audit').get(this.audit_controller.healthy);
    app
      .route('/audit/:teacher_id')
      .get(ValidationMiddleware(GetMappingDto), AuthMiddleware(2), this.audit_controller.get);
    app
      .route('/audit/mapping')
      .post(ValidationMiddleware(MappingDto), AuthMiddleware(2), this.audit_controller.mapping);
    // app.route('/audit').post(AuthMiddleware(2), this.audit_controller.save);
    // app.route('/audit/start').post(AuthMiddleware(2), this.audit_controller.start);
  }
}
