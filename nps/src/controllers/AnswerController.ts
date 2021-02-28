import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { stringify } from "uuid";
import { AppError } from "../errors/AppError";
import { SurveyUser } from "../models/SurveyUser";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
    //http://localhost:8084/answers/10?u=70ea3abd-5f35-49c3-9356-f1030d5b17bc
    async execute(request: Request, response: Response) {

        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });
        if (!SurveyUser) {
            throw new AppError("Survey User does not exists")
        };
        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);
        return response.json(surveyUser);
    }
}
export { AnswerController }