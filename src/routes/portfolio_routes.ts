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
    // view by type
    app.get('/portfolio/view/:type', AuthMiddleware(1), this.portfolio_controller.view);
    // view by type & id
    app.get('/portfolio/view/:type/:apply_id', AuthMiddleware(1), this.portfolio_controller.view);
    // get all
    app.route('/portfolio').get(AuthMiddleware(2), this.portfolio_controller.getAll);
    // get by id
    app.route('/portfolio/:apply_id').get(AuthMiddleware(1), this.portfolio_controller.get);
    // create
    app.route('/portfolio').post(AuthMiddleware(1), this.portfolio_controller.create);
    // delete
    app.post(
      '/portfolio/delete',
      AuthMiddleware(1),
      ValidationMiddleware(DeletePortfolioTypeDto, false),
      this.portfolio_controller.delete,
    );

    /* ----------------------------- Portfolio Types ---------------------------- */
    app.route('/portfoliotype/healthy').get(AuthMiddleware(1), this.portfolio_type_controller.healthy);
    app
      .route('/portfoliotype')
      .get(AuthMiddleware(1), this.portfolio_type_controller.getAll)
      .post(
        AuthMiddleware(2),
        ValidationMiddleware(CreatePortfolioTypeDto, false),
        this.portfolio_type_controller.create,
      );
    app
      .route('/portfoliotype/delete')
      .post(
        AuthMiddleware(2),
        ValidationMiddleware(DeletePortfolioTypeDto, false),
        this.portfolio_type_controller.delete,
      );
  }
}
