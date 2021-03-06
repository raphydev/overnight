/**
 * Server super calls, for adding all controller routes to express server.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as express from 'express';
import { Application, Request, Response, NextFunction, Router } from 'express';


interface Controller {
    controllerBasePath?: string;
    [key: string]: any;
}


export class Server {

    private readonly _NOT_CTLR_ERR = 'Value passed was not a controller. Please make sure to ' +
        'use a TypeScript class with the @Controller decorator';
    private readonly _APP: Application;


    constructor() {
        this._APP = express();
    }


    protected get app(): Application {
        return this._APP;
    }


    /***********************************************************************************************
     *                                      Setup Controllers
     **********************************************************************************************/

    protected addControllers<T extends object>(controllers: T | Array<T>, customRouterLib?: Function): void {

        let count = 0;
        let routerLib = customRouterLib || express.Router;

        if (controllers instanceof Array) {
            controllers.forEach(controller => {
                this._applyRouterObj(controller, routerLib);
                count++;
            })
        } else {
            this._applyRouterObj(controllers, routerLib);
            count = 1;
        }

        let s = count === 1 ? '' : 's';
        console.log(count +  ` controller${s} configured.`);
    }


    private _applyRouterObj(controller: Controller, routerLib: Function): void {

        if (!controller.controllerBasePath) {
            if (controller.hasOwnProperty('name')) {
                console.error(`Object with name ${controller.name} does not have the basePath property`)
            }
            throw Error(this._NOT_CTLR_ERR);
        }

        let router = this._getRouter(controller, routerLib);
        this.app.use(controller.controllerBasePath, router);
    }


    private _getRouter(controller: Controller, RouterLib: Function): Router {

        let router = RouterLib();

        for (let member in controller) {

            if ((controller)[member] && (controller)[member].overnightRouteProperties) {

                let { middleware, httpVerb, path } = (controller)[member].overnightRouteProperties;

                let callBack = (req: Request, res: Response, next: NextFunction) => {
                    return (controller)[member](req, res, next);
                };

                if (middleware) {
                    router[httpVerb](path, middleware, callBack);
                } else {
                    router[httpVerb](path, callBack);
                }
            }
        }

        return router;
    }
}