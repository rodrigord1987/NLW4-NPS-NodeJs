//para criar migration: npx typeorm migration:create -n CreateSurveys
//para rodar a migration: npm run typeorm migration:run
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveys1614447113672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"surveys",
                columns:[
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "title",
                        type: "varchar"
                    },
                    {
                        name: "description",
                        type:"varchar"
                    },
                    {
                        name: "created_at",
                        type:"timestamp",
                        default: "now()"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Surveys");
    }

}
