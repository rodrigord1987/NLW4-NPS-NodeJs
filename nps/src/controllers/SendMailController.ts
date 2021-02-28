import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { default as SendMailService, default as sendMailService } from "../services/sendMailService";


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;
        const userRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await userRepository.findOne({ email })

        if (!user) {
            throw new AppError("User does not exists")
        };

        const survey = await surveysRepository.findOne({ id: survey_id })

        if (!survey) {
            throw new AppError("Survey does not exists")
        }

        //verifica se já possui a pesquisa para aquele usuário. 
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        })

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const variabels = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        //se já possui a pesquisa, então só envia o email.
        if (surveyUserAlreadyExists) {
            variabels.id = surveyUserAlreadyExists.id;
            await sendMailService.execute(email, survey.title, variabels, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        //Se não possui o registro da pesquisa para o usuário, então salva as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });
        await surveysUsersRepository.save(surveyUser);

        variabels.id = surveyUser.id;
        
        //Enviar e-mail para o usuário
        await SendMailService.execute(email, survey.title, variabels, npsPath);

        return response.json(surveyUser);

    }
}

export { SendMailController };

