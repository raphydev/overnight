/**
 * Example Sending Email for the OvernightJS web library.
 *
 * created by Sean Maxwell Aug 28, 2018
 */

import { Request, Response } from 'express'
import { Controller, Post  } from '@overnightjs/core'
import { cinfo, cerr, } from 'simple-color-print'
import ParentController from './ParentController'


@Controller('api/signup')
export class SignupController extends ParentController {


    @Post()
    private async signup(req: Request, res: Response): Promise<void> {

        try {
            let info = await this.mailer_.send(req.body.email, 'Overnight Developers',
                'Thanks for signing up', null, '<h1>You are awesome</h1>');

            cinfo(info.response);
            res.status(200).json({msg: 'email_sent_to_' + req.body.email});
        } catch (err) {
            cerr(err);
            res.status(400).json({msg: 'problem_sending_email'});
        }
    }
}
