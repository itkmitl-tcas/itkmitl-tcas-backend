import { Application } from 'express';
import { AuditController } from '../controllers/auditController';
import { MappingDto, GetMappingDto } from '../modules/audit/index.dto';
import AuthMiddleware from '../middleware/AuthMiddleware';
import ValidationMiddleware from '../middleware/ValidateMiddleware';

export class AuditRoutes {
  private audit_controller: AuditController = new AuditController();

  public route(app: Application) {
    // ! healthly
    app.route('/audit').get(this.audit_controller.healthy);

    // ! get export
    app.route('/audit/export').get(AuthMiddleware(2), this.audit_controller.exportAudit);
    // ! get mapping
    app
      .route('/audit/:teacher_id')
      .get(ValidationMiddleware(GetMappingDto), AuthMiddleware(2), this.audit_controller.get);

    // ! mapping
    app
      .route('/audit/mapping')
      .post(ValidationMiddleware(MappingDto), AuthMiddleware(2), this.audit_controller.mapping);

    // ! delete
    app.route('/audit/:student_id').delete(AuthMiddleware(2), this.audit_controller.delete);

    // ! gradeAudit
    app
      .route('/audit/grade')
      .post(ValidationMiddleware(GetMappingDto), AuthMiddleware(2), this.audit_controller.gradeAudit);
    app
      .route('/audit/submit')
      .post(ValidationMiddleware(GetMappingDto), AuthMiddleware(2), this.audit_controller.submitAudit);
  }
}
