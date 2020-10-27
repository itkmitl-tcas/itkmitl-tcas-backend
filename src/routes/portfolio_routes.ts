import { Application } from 'express';
import { PortfolioController, PortfolioTypeController } from '../controllers/portController';
import { CreatePortfolioDto, CreatePortfolioTypeDto, DeletePortfolioTypeDto } from '../modules/portfolio/model.dto';
import ValidationMiddleware from '../middleware/ValidateMiddleware';
import AuthMiddleware from '../middleware/AuthMiddleware';

export class PortfolioRoutes {
  private portfolio_controller: PortfolioController = new PortfolioController();
  private portfolio_type_controller: PortfolioTypeController = new PortfolioTypeController();
  public route(app: Application): void {
    /* -------------------------------- Portfolio ------------------------------- */
    app.route('/portfolio/healthy').get(this.portfolio_controller.healthy);
    app.route('/portfolio').get(AuthMiddleware(2), this.portfolio_controller.getAll);
    app.route('/portfolio/:apply_id').get(AuthMiddleware(1), this.portfolio_controller.get);
    app
      .route('/portfolio')
      .post(AuthMiddleware(1), ValidationMiddleware(CreatePortfolioDto, false), this.portfolio_controller.create);

    /* ----------------------------- Portfolio Types ---------------------------- */
    app.route('/portfoliotype/healthy').get(AuthMiddleware(1), this.portfolio_type_controller.healthy);
    app
      .route('/portfoliotype')
      .get(AuthMiddleware(1), this.portfolio_type_controller.getAll)
      .post(
        AuthMiddleware(2),
        ValidationMiddleware(CreatePortfolioTypeDto, false),
        this.portfolio_type_controller.create,
      )
      .delete(
        AuthMiddleware(2),
        ValidationMiddleware(DeletePortfolioTypeDto, false),
        this.portfolio_type_controller.delete,
      );
  }
}
