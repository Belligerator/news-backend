import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
}) export class AuthModule { }
