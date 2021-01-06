import { Application } from 'express';
import { AssessmentController } from '../controllers/assessmentController';
import AuthMiddleware from '../middleware/AuthMiddleware';

export class AssessmentRoutes {
  private assessment_controller: AssessmentController = new AssessmentController();

  public route(app: Application) {
    app.route('/assessment').get(AuthMiddleware(2), this.assessment_controller.get);
    app.route('/assessment').post(AuthMiddleware(2), this.assessment_controller.save);
    app.route('/assessment/start').post(AuthMiddleware(2), this.assessment_controller.start);
  }
}
