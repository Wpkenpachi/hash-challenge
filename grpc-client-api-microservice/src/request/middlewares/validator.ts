import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";

export const headerValidation = (interfaceClass: any) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const output: any = plainToClass(interfaceClass, req.headers, { enableImplicitConversion: true });
        validate(output, { skipMissingProperties: true }).then(errors => {
            if (errors.length > 0) {
                // console.log(errors);
                let errorTexts: any[] = [];
                for (const errorItem of errors) {
                    errorTexts = errorTexts.concat(errorItem.constraints);
                }
                res.status(400).send(errorTexts);
                return;
            } else {
                res.locals.input = output;
                next();
            }
        });
    };
};