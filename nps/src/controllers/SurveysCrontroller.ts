import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";


class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        const allSurveys = await surveysRepository.find()

        return response.json(allSurveys);

    }

    async showOne(request: Request, response: Response) {
        const idSurvey = request.params.id;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const allSurveys = await surveysRepository.findOne(idSurvey);

        return allSurveys ? response.json(allSurveys) : response.json({Message: "Registro não encontrado"}).status(404);

    }
}

export { SurveysController };
